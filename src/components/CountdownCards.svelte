<script lang="ts">
  import type { League } from "../lib/leagues";
  import { hiddenGames } from "../stores/hiddenGames";
  import Countdown from "./Countdown.svelte";

  export let leagues: League[] = [];

  $: visibleLeagues = leagues.filter((l) => !$hiddenGames[l.id]);
</script>

<div class="grid w-full grid-cols-1 gap-6 p-6">
  {#each visibleLeagues as league (league.id)}
    <article class="w-full min-w-0">
      <a
        href={`/games/${league.slug}`}
        class="accent-border group block overflow-hidden rounded-lg border bg-void-soft transition-all hover:scale-[1.005]"
      >
        <div
          class="relative h-32 bg-cover bg-center"
          style="background-image: linear-gradient(135deg, #1c1c1e 0%, #0a0a0b 100%), url({league.bg_image})"
        >
          <div
            class="absolute inset-0 bg-gradient-to-t from-void to-transparent"
          ></div>
          <div class="absolute bottom-3 left-4 flex items-center gap-3">
            {#if league.logo}
              <img
                src={league.logo}
                alt=""
                class="h-12 w-12 shrink-0 object-contain drop-shadow-md"
              />
            {/if}
            <div>
              <h3 class="text-lg font-bold text-bone">{league.game}</h3>
              <p class="text-sm text-silver">{league.event}</p>
            </div>
          </div>
        </div>
        <div class="p-4">
          <div class="mb-2 flex items-start gap-4">
            <div class="flex flex-col gap-1.5">
              <span class="accent-glow font-mono text-2xl font-bold uppercase tracking-wider">
                Launches in:
              </span>
              <span class="invisible rounded-md border border-slate px-2.5 py-0.5 text-xs">days</span>
            </div>
            <div class="accent-glow font-mono text-2xl font-bold">
              <Countdown date={league.date} />
            </div>
          </div>
          <span
            class="mt-2 inline-block text-sm font-medium text-[var(--accent-color)] transition-colors group-hover:text-[var(--accent-color)]"
          >
            View details →
          </span>
        </div>
      </a>
    </article>
  {/each}
</div>
