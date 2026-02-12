create extension if not exists pgcrypto;

create table if not exists public.waitlist_users (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email_normalized text not null unique,
  email_raw text not null,
  referral_code text not null unique,
  status text not null default 'pending_email' check (status in ('pending_email', 'active', 'invited', 'accepted', 'unsubscribed')),
  score integer not null default 0 check (score >= 0),
  referred_by_user_id uuid references public.waitlist_users(id),
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  invited_at timestamptz,
  constraint waitlist_users_not_self_referred check (referred_by_user_id is null or referred_by_user_id <> id),
  constraint waitlist_users_first_name_len check (char_length(trim(first_name)) between 1 and 80)
);

create index if not exists idx_waitlist_users_status on public.waitlist_users(status);
create index if not exists idx_waitlist_users_score on public.waitlist_users(score desc, confirmed_at asc, id asc);
create index if not exists idx_waitlist_users_referred_by on public.waitlist_users(referred_by_user_id);

create table if not exists public.email_verification_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.waitlist_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_tokens_user_id on public.email_verification_tokens(user_id);
create index if not exists idx_email_tokens_expires on public.email_verification_tokens(expires_at);

create table if not exists public.referral_events (
  id uuid primary key default gen_random_uuid(),
  inviter_user_id uuid not null references public.waitlist_users(id) on delete cascade,
  invitee_user_id uuid not null references public.waitlist_users(id) on delete cascade,
  source_referral_code text not null,
  credit_points integer not null default 5 check (credit_points = 5),
  credited_at timestamptz not null default now(),
  constraint referral_events_unique_invitee unique (invitee_user_id),
  constraint referral_events_not_self check (inviter_user_id <> invitee_user_id)
);

create index if not exists idx_referral_events_inviter on public.referral_events(inviter_user_id);

create table if not exists public.waitlist_events (
  id bigserial primary key,
  user_id uuid references public.waitlist_users(id) on delete set null,
  event_name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_waitlist_events_event on public.waitlist_events(event_name, created_at desc);
create index if not exists idx_waitlist_events_user on public.waitlist_events(user_id, created_at desc);

create or replace function public.confirm_waitlist_user(p_raw_token text)
returns table (
  user_id uuid,
  referral_code text,
  score integer,
  referrals integer,
  queue_rank bigint,
  inviter_name text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token_hash text := encode(digest(p_raw_token, 'sha256'), 'hex');
  v_token public.email_verification_tokens%rowtype;
  v_user public.waitlist_users%rowtype;
  v_rows integer := 0;
begin
  select *
  into v_token
  from public.email_verification_tokens
  where token_hash = v_token_hash
  for update;

  if not found then
    raise exception 'INVALID_TOKEN';
  end if;

  if v_token.used_at is not null then
    raise exception 'TOKEN_ALREADY_USED';
  end if;

  if v_token.expires_at < now() then
    raise exception 'TOKEN_EXPIRED';
  end if;

  update public.email_verification_tokens
  set used_at = now()
  where id = v_token.id;

  select *
  into v_user
  from public.waitlist_users
  where id = v_token.user_id
  for update;

  if not found then
    raise exception 'USER_NOT_FOUND';
  end if;

  if v_user.status = 'pending_email' then
    update public.waitlist_users
    set
      status = 'active',
      confirmed_at = coalesce(confirmed_at, now())
    where id = v_user.id
    returning * into v_user;

    insert into public.waitlist_events (user_id, event_name, payload)
    values (v_user.id, 'signup_confirmed', '{}'::jsonb);
  end if;

  if v_user.referred_by_user_id is not null and v_user.referred_by_user_id <> v_user.id then
    insert into public.referral_events (inviter_user_id, invitee_user_id, source_referral_code, credit_points)
    select
      v_user.referred_by_user_id,
      v_user.id,
      inviter.referral_code,
      5
    from public.waitlist_users inviter
    where inviter.id = v_user.referred_by_user_id
    on conflict (invitee_user_id) do nothing;

    get diagnostics v_rows = row_count;

    if v_rows > 0 then
      update public.waitlist_users
      set score = score + 5
      where id = v_user.referred_by_user_id;

      insert into public.waitlist_events (user_id, event_name, payload)
      values (
        v_user.referred_by_user_id,
        'referral_credit',
        jsonb_build_object('invitee_user_id', v_user.id, 'points', 5)
      );
    end if;
  end if;

  return query
  with ranked as (
    select
      wu.id,
      row_number() over (order by wu.score desc, wu.confirmed_at asc nulls last, wu.id asc) as rank_position
    from public.waitlist_users wu
    where wu.status in ('active', 'invited', 'accepted')
  ),
  referral_counts as (
    select
      re.inviter_user_id,
      count(*)::integer as referral_count
    from public.referral_events re
    group by re.inviter_user_id
  )
  select
    u.id,
    u.referral_code,
    u.score,
    coalesce(rc.referral_count, 0) as referrals,
    coalesce(ranked.rank_position, 0)::bigint as queue_rank,
    inviter.first_name
  from public.waitlist_users u
  left join ranked on ranked.id = u.id
  left join referral_counts rc on rc.inviter_user_id = u.id
  left join public.waitlist_users inviter on inviter.id = u.referred_by_user_id
  where u.id = v_user.id;
end;
$$;

create or replace function public.get_waitlist_status_by_code(p_referral_code text)
returns table (
  user_id uuid,
  first_name text,
  referral_code text,
  status text,
  score integer,
  referrals integer,
  queue_rank bigint,
  inviter_name text
)
language sql
stable
security definer
set search_path = public
as $$
  with target as (
    select *
    from public.waitlist_users
    where referral_code = p_referral_code
    limit 1
  ),
  ranked as (
    select
      wu.id,
      row_number() over (order by wu.score desc, wu.confirmed_at asc nulls last, wu.id asc) as rank_position
    from public.waitlist_users wu
    where wu.status in ('active', 'invited', 'accepted')
  ),
  referral_counts as (
    select
      re.inviter_user_id,
      count(*)::integer as referral_count
    from public.referral_events re
    group by re.inviter_user_id
  )
  select
    t.id,
    t.first_name,
    t.referral_code,
    t.status,
    t.score,
    coalesce(rc.referral_count, 0) as referrals,
    coalesce(ranked.rank_position, 0)::bigint as queue_rank,
    inviter.first_name
  from target t
  left join ranked on ranked.id = t.id
  left join referral_counts rc on rc.inviter_user_id = t.id
  left join public.waitlist_users inviter on inviter.id = t.referred_by_user_id;
$$;
