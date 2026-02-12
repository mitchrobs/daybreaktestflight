import React from "react";

type GameVariant = "bridges" | "barter" | "moji-mash" | "wordie" | "mini-sudoku" | "whodunit" | "trivia" | "mini-crossword";

type GameIconEntry = {
  id: string;
  name: string;
  tagline: string;
  href: string;
  variant: GameVariant;
};

const games: GameIconEntry[] = [
  {
    id: "bridges",
    name: "Bridges",
    tagline: "Link the islands",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "bridges"
  },
  {
    id: "barter",
    name: "Barter",
    tagline: "Trade to the goal",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "barter"
  },
  {
    id: "moji-mash",
    name: "Moji Mash",
    tagline: "Guess the blend",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "moji-mash"
  },
  {
    id: "wordie",
    name: "Wordie",
    tagline: "Five letters, six tries",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "wordie"
  },
  {
    id: "mini-sudoku",
    name: "Mini Sudoku",
    tagline: "6x6 logic sprint",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "mini-sudoku"
  },
  {
    id: "whodunit",
    name: "Whodunit",
    tagline: "Daily mystery case",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "whodunit"
  },
  {
    id: "trivia",
    name: "Trivia",
    tagline: "Quickfire rounds",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "trivia"
  },
  {
    id: "mini-crossword",
    name: "Mini Crossword",
    tagline: "Tiny, sharp clues",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "mini-crossword"
  }
];

export function GameIconShowcase() {
  return (
    <section className="games-showcase" aria-labelledby="games-title">
      <p className="section-kicker">Today in Gameshow</p>
      <div className="games-heading-row">
        <h2 id="games-title">A lineup you&apos;ll open every day.</h2>
        <p>Eight daily games with polished iOS-style cards and quick play sessions. Swipe to browse.</p>
      </div>

      <div className="games-carousel" role="region" aria-label="Games carousel">
        <div className="games-carousel-track">
          {games.map((game) => (
            <a
              key={game.id}
              className="game-icon-card"
              data-game={game.variant}
              href={game.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Open ${game.name} on Gameshow`}
            >
              <span className="game-icon-shell" aria-hidden="true">
                <span className="game-icon-highlight" />
                <span className="game-icon-orb" />
                <span className="game-icon-glyph" />
              </span>
              <span className="game-icon-meta">
                <strong>{game.name}</strong>
                <span>{game.tagline}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
