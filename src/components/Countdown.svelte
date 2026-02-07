<script lang="ts">
  import { onMount } from "svelte";

  export let date: string = "";
  let display = "--";

  function formatTimeLeft(ms: number): string {
    if (ms <= 0) return "Live!";
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(" ");
  }

  onMount(() => {
    const target = new Date(date).getTime();
    const tick = () => {
      display = formatTimeLeft(target - Date.now());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  });
</script>

<span>{display}</span>
