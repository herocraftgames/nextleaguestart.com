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
    League Filter
  </h2>
  <ul class="space-y-2">
    {#each leagues as league}
      <li>
        <label
          class="flex cursor-pointer items-center gap-3 rounded px-2 py-1.5 text-sm transition-colors hover:bg-ash"
        >
          <input
            type="checkbox"
            checked={!$hiddenGames[league.id]}
            onchange={() => toggleGameVisibility(league.id)}
            class="h-4 w-4 rounded border-slate bg-ash text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
          />
          <span>{league.game}</span>
        </label>
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
