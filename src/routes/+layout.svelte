<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}

<div class="toast md:hidden">
	<div class="alert alert-info text-wrap">
		<p>Responsive design for smaller screens is currently in-development. So long as you can see this warning, expect issues.</p>
	</div>
</div>