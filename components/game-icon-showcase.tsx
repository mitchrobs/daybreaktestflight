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

const games: GameIconEntry[] = [
  {
    id: "bridges",
    name: "Bridges",
    tagline: "Link the islands",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "bridges",
    icon: Waypoints,
    tileClassName: "tile-bridges"
  },
  {
    id: "barter",
    name: "Barter",
    tagline: "Trade to the goal",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "barter",
    icon: ArrowLeftRight,
    tileClassName: "tile-barter"
  },
  {
    id: "moji-mash",
    name: "Moji Mash",
    tagline: "Guess the blend",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "moji-mash",
    icon: Puzzle,
    tileClassName: "tile-moji"
  },
  {
    id: "wordie",
    name: "Wordie",
    tagline: "Five letters, six tries",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "wordie",
    icon: Type,
    tileClassName: "tile-wordie"
  },
  {
    id: "mini-sudoku",
    name: "Mini Sudoku",
    tagline: "6x6 logic sprint",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "mini-sudoku",
    icon: Calculator,
    tileClassName: "tile-sudoku"
  },
  {
    id: "whodunit",
    name: "Whodunit",
    tagline: "Daily mystery case",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "whodunit",
    icon: Search,
    tileClassName: "tile-whodunit"
  },
  {
    id: "trivia",
    name: "Trivia",
    tagline: "Quickfire rounds",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "trivia",
    icon: Zap,
    tileClassName: "tile-trivia"
  },
  {
    id: "mini-crossword",
    name: "Mini Crossword",
    tagline: "Tiny, sharp clues",
    href: "https://mitchrobs.github.io/gameshow/",
    variant: "mini-crossword",
    icon: Table2,
    tileClassName: "tile-crossword"
  }
];

export function GameIconShowcase() {
  return (
    <section className="games-showcase" aria-labelledby="games-title">
      <p className="section-kicker">Today in Gameshow</p>
      <div className="games-heading-row">
        <h2 id="games-title">A lineup you&apos;ll open every day.</h2>
        <p>Eight daily games with compact cards. Swipe to browse.</p>
      </div>

      <div className="games-carousel" role="region" aria-label="Games carousel">
        <div className="games-carousel-track">
          {games.map((game) => {
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
      </div>
    </section>
  );
}
