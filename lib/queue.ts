export type QueueUser = {
  id: string;
  score: number;
  confirmedAt: string | null;
};

export function sortQueue(users: QueueUser[]): QueueUser[] {
  return [...users].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    const aTime = a.confirmedAt ? new Date(a.confirmedAt).getTime() : Number.POSITIVE_INFINITY;
    const bTime = b.confirmedAt ? new Date(b.confirmedAt).getTime() : Number.POSITIVE_INFINITY;

    if (aTime !== bTime) {
      return aTime - bTime;
    }

    return a.id.localeCompare(b.id);
  });
}

export function getQueueRank(users: QueueUser[], userId: string): number {
  const ranked = sortQueue(users);
  const index = ranked.findIndex((user) => user.id === userId);

  return index >= 0 ? index + 1 : 0;
}
