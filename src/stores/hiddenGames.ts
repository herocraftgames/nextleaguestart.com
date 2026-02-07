import { persistentJSON } from "@nanostores/persistent";

export type HiddenGamesState = Record<string, boolean>;

export const hiddenGames = persistentJSON<HiddenGamesState>("nextleaguestart:hidden", {});

export function toggleGameVisibility(gameId: string) {
  const current = hiddenGames.get();
  hiddenGames.set({ ...current, [gameId]: !current[gameId] });
}

export function isGameHidden(gameId: string): boolean {
  return !!hiddenGames.get()[gameId];
}
