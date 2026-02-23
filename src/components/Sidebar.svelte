<script lang="ts">
  import { getEnabledLeagues } from "../lib/leagues";
  import { hiddenGames, toggleGameVisibility } from "../stores/hiddenGames";
  import { showLiveLeagues, toggleShowLiveLeagues } from "../stores/showLiveLeagues";

  const leagues = getEnabledLeagues();
</script>

<aside
  class="flex w-32 shrink-0 flex-col border-r border-slate bg-void-soft p-4"
  role="navigation"
>
  <h2 class="mb-4 border-b border-slate pb-2 text-center text-sm font-semibold uppercase tracking-wider text-mist">
    Game filter
  </h2>

  <ul class="flex flex-col items-center gap-2">
    {#each leagues as league}
      <li>
        <button
          type="button"
          onclick={() => toggleGameVisibility(league.id)}
          class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded border-2 border-mist transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-void focus:ring-mist"
          class:border-slate={$hiddenGames[league.id]}
          class:grayscale={$hiddenGames[league.id]}
          class:opacity-50={$hiddenGames[league.id]}
          title={`${league.game} — Click to toggle visibility`}
          aria-pressed={!$hiddenGames[league.id]}
        >
          {#if league.logo}
            <img
              src={league.logo}
              alt={league.game}
              class="h-full w-full object-contain p-1.5"
              loading="lazy"
            />
          {:else}
            <span
              class="flex h-full w-full items-center justify-center text-xs font-bold"
              style="color: {league.accent_color}"
            >
              {league.game.slice(0, 2).toUpperCase()}
            </span>
          {/if}
        </button>
      </li>
    {/each}
  </ul>

  <div
    class="mt-4 flex flex-col items-center gap-2 border-t border-slate pt-4 pb-4 text-center text-[10px] text-mist"
    title="Show or hide leagues that have already launched"
  >
    <span class="block font-medium uppercase tracking-wider">Show live leagues</span>
    <button
      type="button"
      role="switch"
      aria-checked={$showLiveLeagues}
      onclick={toggleShowLiveLeagues}
      class="inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2 focus:ring-offset-void {$showLiveLeagues
        ? 'bg-[var(--accent-color)]'
        : 'bg-slate'}"
    >
      <span
        class="block h-5 w-5 shrink-0 rounded-full bg-white shadow-sm transition-transform duration-200 {$showLiveLeagues
          ? 'translate-x-5'
          : 'translate-x-0'}"
      ></span>
    </button>
  </div>

  <div class="mt-auto pt-6">
    <h2 class="mb-4 border-b border-slate pb-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-wider text-mist">
      Support the developer
    </h2>
    <a
      href="https://buymeacoffee.com/herocraftgames"
      target="_blank"
      rel="noopener noreferrer"
      class="btn-accent block rounded px-2 py-1.5 text-center text-[10px] font-medium leading-tight"
      title="Support the developer — Buy a mana potion"
    >
      Buy a mana potion
    </a>
  </div>
</aside>
