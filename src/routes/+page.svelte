<script lang="ts">
    import MurmurHash3 from "imurmurhash";
    import { copy } from "svelte-copy";

    let { data } = $props();

    let username = $state("");
    let hash = $state("");
    let confirmed = $state(false);
    let done = $state(false);
    let verificationAttempted = $state(false);
    let verified = $state(false);

    async function verify(): Promise<void> {
        const response = await fetch(`/api/v1/profile/username/${username}`, { method: "PUT" });
        verificationAttempted = true;
        verified = response.ok;
    }
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
						<a href="/profile">Profile</a>
					</li>
					<li>
						<a href="/logout">Logout</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<div class="flex flex-col items-center w-screen mt-16 gap-y-4">
	<h1 class="text-6xl font-bold text-secondary">Verification</h1>
	<h2 class="text-2xl text-accent">Instructions</h2>
	<ol class="list-decimal w-1/4">
		<li>
			<p>Enter your username</p>
			<input class="input input-bordered w-full mt-4 mb-2" placeholder="Enter username" type="text" name="profile"
						 bind:value={username} oninput={() => {confirmed = false}} disabled={username !== "" && confirmed}
						 required />
			{#if !username || !confirmed}
				<button type="button" class="btn btn-primary w-full mt-4 mb-2"
								onclick={() => {confirmed = true; hash=MurmurHash3(username).result().toString()}}>Confirm
				</button>
			{/if}
		</li>
		{#if username && confirmed}
			<li>
				<p>In Warframe, enter the following into the name of your currently-equipped loadout</p>
				<div class="flex flex-row justify-center items-center gap-4">
					<div class="border my-2 py-2 w-min mx-auto col-span-3 grow">
						<a href={"javascript:void(0)"} use:copy={hash} class="text-2xl mx-2"><code class="code">{hash}</code></a>
					</div>
					<button type="button" class="btn btn-primary" onclick={() => {done=true}} disabled={done}>Done</button>
				</div>
			</li>
		{/if}
	</ol>
	{#if username && confirmed && done}
		<button type="button" class="btn btn-primary" onclick={verify} disabled={verified}>Submit</button>
	{/if}
	{#if verified}
		<p class="text-success">Successfully verified.</p>
	{:else if verificationAttempted && !verified}
		<p class="text-error">Failed to verify. Please try again in 5-10 minutes.</p>
	{/if}
</div>