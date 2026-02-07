import leaguesData from "../data/leagues.json";

export interface LeagueNews {
  title: string;
  link: string;
}

export interface League {
  id: string;
  game: string;
  slug: string;
  event: string;
  date: string;
  accent_color: string;
  bg_image: string;
  is_enabled: boolean;
  features: string[];
  news: LeagueNews[];
}

export const leagues = leaguesData as League[];

/** Get enabled leagues sorted by date (soonest first) */
export function getEnabledLeagues(): League[] {
  return leagues
    .filter((l) => l.is_enabled)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/** Get the league with the closest upcoming date (for accent color) */
export function getHeroLeague(): League | null {
  const enabled = getEnabledLeagues();
  const now = Date.now();
  const upcoming = enabled.filter((l) => new Date(l.date).getTime() > now);
  return upcoming[0] ?? enabled[enabled.length - 1] ?? null;
}

/** Get league by slug */
export function getLeagueBySlug(slug: string): League | undefined {
  return leagues.find((l) => l.slug === slug);
}
