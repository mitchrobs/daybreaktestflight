import React from "react";
import { ArrowLeftRight, Calculator, Puzzle, Search, Table2, Type, Waypoints, Zap } from "lucide-react";

type GameVariant = "bridges" | "barter" | "moji-mash" | "wordie" | "mini-sudoku" | "whodunit" | "trivia" | "mini-crossword";

type IconComponent = React.ComponentType<{
  className?: string;
  size?: number;
  strokeWidth?: number;
}>;

type GameIconEntry = {
  id: string;
  name: string;
  tagline: string;
  href: string;
  variant: GameVariant;
  icon: IconComponent;
  tileClassName: string;
};

const gamesById: Record<GameVariant, GameIconEntry> = {
  bridges: {
    id: "bridges",
    name: "Bridges",
    tagline: "Link the islands",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "bridges",
    icon: Waypoints,
    tileClassName: "tile-bridges"
  },
  barter: {
    id: "barter",
    name: "Barter",
    tagline: "Trade to the goal",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "barter",
    icon: ArrowLeftRight,
    tileClassName: "tile-barter"
  },
  "moji-mash": {
    id: "moji-mash",
    name: "Moji Mash",
    tagline: "Guess the blend",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "moji-mash",
    icon: Puzzle,
    tileClassName: "tile-moji"
  },
  wordie: {
    id: "wordie",
    name: "Wordie",
    tagline: "Five letters, six tries",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "wordie",
    icon: Type,
    tileClassName: "tile-wordie"
  },
  "mini-sudoku": {
    id: "mini-sudoku",
    name: "Mini Sudoku",
    tagline: "6x6 logic sprint",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "mini-sudoku",
    icon: Calculator,
    tileClassName: "tile-sudoku"
  },
  whodunit: {
    id: "whodunit",
    name: "Whodunit",
    tagline: "Daily mystery case",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "whodunit",
    icon: Search,
    tileClassName: "tile-whodunit"
  },
  trivia: {
    id: "trivia",
    name: "Trivia",
    tagline: "Quickfire rounds",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "trivia",
    icon: Zap,
    tileClassName: "tile-trivia"
  },
  "mini-crossword": {
    id: "mini-crossword",
    name: "Mini Crossword",
    tagline: "Tiny, sharp clues",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "mini-crossword",
    icon: Table2,
    tileClassName: "tile-crossword"
  }
};

const gameRows: GameIconEntry[][] = [
  [gamesById["moji-mash"], gamesById.bridges, gamesById.whodunit, gamesById.barter],
  [gamesById.wordie, gamesById["mini-crossword"], gamesById["mini-sudoku"], gamesById.trivia]
];

type GameIconShowcaseProps = {
  embedded?: boolean;
};

export function GameIconShowcase({ embedded = false }: GameIconShowcaseProps) {
  const Wrapper: "section" | "div" = embedded ? "div" : "section";
  const titleId = embedded ? "games-title-embedded" : "games-title";
  const className = embedded ? "games-showcase games-showcase--embedded" : "games-showcase";

  return (
    <Wrapper className={className} aria-labelledby={titleId}>
      <p className="section-kicker">Today in Gameshow</p>
      <div className="games-heading-row">
        <h2 id={titleId}>A lineup you&apos;ll open every day.</h2>
        <p>Eight daily games in a compact lineup.</p>
      </div>

      <div className="games-grid-rows">
        {gameRows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="games-row">
            {row.map((game) => {
              const Icon = game.icon;

              return (
                <a
                  key={game.id}
                  className="game-icon-card"
                  data-game={game.variant}
                  href={game.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Open ${game.name} on Gameshow`}
                >
                  <span className={`game-icon-tile ${game.tileClassName}`} aria-hidden="true">
                    <Icon className="game-icon-symbol" size={18} strokeWidth={2.1} />
                  </span>
                  <span className="game-icon-meta">
                    <strong>{game.name}</strong>
                    <span>{game.tagline}</span>
                  </span>
                </a>
              );
            })}
          </div>
        ))}
      </div>
    </Wrapper>
  );
}
