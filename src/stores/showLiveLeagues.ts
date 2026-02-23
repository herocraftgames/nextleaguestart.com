import { persistentJSON } from "@nanostores/persistent";

/** When false, hide leagues that have already launched. Default off. */
export const showLiveLeagues = persistentJSON<boolean>("nextleaguestart:showLive", false);

export function toggleShowLiveLeagues() {
  showLiveLeagues.set(!showLiveLeagues.get());
}
