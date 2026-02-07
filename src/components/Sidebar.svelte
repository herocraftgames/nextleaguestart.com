<script lang="ts">
  import { getEnabledLeagues } from "../lib/leagues";
  import { hiddenGames, toggleGameVisibility } from "../stores/hiddenGames";

  const leagues = getEnabledLeagues();
</script>

<aside
  class="flex w-64 shrink-0 flex-col border-r border-slate bg-void-soft p-4"
  role="navigation"
>
  <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-mist">
    Games I want to see
  </h2>
  <p class="mb-4 text-xs text-mist">Click to toggle visibility</p>

  <ul class="flex flex-wrap gap-2">
    {#each leagues as league}
      <li>
        <button
          type="button"
          onclick={() => toggleGameVisibility(league.id)}
          class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded border-2 border-mist transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-void focus:ring-mist"
          class:border-slate={$hiddenGames[league.id]}
          class:grayscale={$hiddenGames[league.id]}
          class:opacity-50={$hiddenGames[league.id]}
          title={league.game}
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
    <a
      href="https://buymeacoffee.com"
      target="_blank"
      rel="noopener noreferrer"
      class="btn-accent block rounded px-3 py-2 text-center text-sm font-medium"
    >
      Support the servers (Buy a Mana Potion)
    </a>
  </div>
</aside>
