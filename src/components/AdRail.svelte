<script lang="ts">
  import { onMount } from "svelte";

  // Right rail for display ad space — hidden by default, show with ?ads=1
  let showAdRail = false;

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    showAdRail = params.get("ads") === "1";
  });
</script>

{#if showAdRail}
<aside
  class="hidden w-64 shrink-0 flex-col overflow-hidden border-l border-slate bg-void-soft p-4 lg:flex"
  role="complementary"
  aria-label="Advertisement"
>
  <div class="sticky top-4 min-w-0">
    <div
      class="relative flex min-h-[250px] w-full min-w-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate"
    >
      <!-- Background layer: visible when ad-block hides ad content -->
      <div
        class="absolute inset-0 flex flex-col items-center justify-center bg-ash/80 p-4 text-center"
        aria-hidden="true"
      >
        <p class="text-xs font-semibold uppercase tracking-wider text-mist">
          Attention Ad-Block User
        </p>
        <p class="mt-2 text-xs text-mist">
          Show your support by disabling Adblock
        </p>
      </div>
      <!-- Ad slot: add your ad code here; when blocked, background message shows through -->
      <div class="relative z-10 h-full min-h-full w-full min-w-0"></div>
    </div>
  </div>
</aside>
{/if}
