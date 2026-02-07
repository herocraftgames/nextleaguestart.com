<script lang="ts">
  import { onMount } from "svelte";

  export let date: string = "";
  let parts = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  let isLive = false;

  onMount(() => {
    const target = new Date(date).getTime();
    const tick = () => {
      const ms = target - Date.now();
      if (ms <= 0) {
        isLive = true;
        return;
      }
      parts = {
        seconds: Math.floor((ms / 1000) % 60),
        minutes: Math.floor((ms / (1000 * 60)) % 60),
        hours: Math.floor((ms / (1000 * 60 * 60)) % 24),
        days: Math.floor(ms / (1000 * 60 * 60 * 24)),
      };
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  });
</script>

{#if isLive}
  <span class="accent-glow font-mono text-2xl font-bold">Live!</span>
{:else}
  {@const units = [
    { value: parts.days, label: "days" },
    { value: parts.hours, label: "hours" },
    { value: parts.minutes, label: "minutes" },
    { value: parts.seconds, label: "seconds" },
  ]}
  <div class="flex gap-4">
    {#each units as { value, label }}
      <div class="flex flex-col items-center gap-1.5">
        <span class="accent-glow font-mono text-2xl font-bold tabular-nums">{value}</span>
        <span class="rounded-md border border-slate px-2.5 py-0.5 text-xs text-mist">{label}</span>
      </div>
    {/each}
  </div>
{/if}
