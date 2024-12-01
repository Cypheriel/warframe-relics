<script lang="ts">
	let { data, children } = $props();
</script>

<div class="navbar bg-base-300">
	<div class="flex-1">
		<a class="btn btn-ghost text-xl text-primary" href="/">Relic Share</a>
	</div>
	<div class="flex-none gap-2">
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
					<path fill-rule="evenodd"
								d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
								clip-rule="evenodd" />
				</svg>
			</div>
			<div class="menu menu-md dropdown-content bg-base-200 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg">
				<p class="mx-auto font-bold">{data.user.username ?? data.user.email}</p>
				<hr class="my-2" />
				<ul tabindex="0" role="menu">
					<li>
						<a href="/username-verification">Change username</a>
					</li>
					<li>
						<a href="/logout">Logout</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>

{@render children()}

<div class="toast md:hidden">
	<div class="alert alert-info text-wrap">
		<p>Responsive design for smaller screens is currently in-development. So long as you can see this warning, expect issues.</p>
	</div>
</div>