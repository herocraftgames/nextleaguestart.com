<script lang="ts">
  import { getEnabledLeagues } from "../lib/leagues";
  import { hiddenGames, toggleGameVisibility } from "../stores/hiddenGames";

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
