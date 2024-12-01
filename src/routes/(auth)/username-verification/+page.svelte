<script lang="ts">
    import MurmurHash3 from "imurmurhash";
    import { copy } from "svelte-copy";

    const { data } = $props();

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

<div class="flex flex-col items-center w-screen mt-16 gap-y-4">
	<h1 class="text-6xl font-bold text-secondary">Verification</h1>
	<h2 class="text-2xl text-accent">Instructions</h2>
	<ol class="list-decimal w-screen lg:w-1/4 px-8">
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
					<div class="flex flex-row border my-2 py-2 w-full mx-auto col-span-3">
						<a href={"javascript:void(0)"} use:copy={hash} class="text-2xl mx-2 grow"><code
							class="code">{hash}</code></a>
						<p class="italic mr-4">Click to copy</p>
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
		<p class="text-error">Failed to verify. Re-confirm your details and/or try again in 5-10 minutes.</p>
	{/if}
</div>

{#if data.user.username != null}
	<div class="toast">
		<div class="alert alert-info text-wrap">
			<p>Your username has already been verified. If your username has changed, you may redo this process.</p>
		</div>
	</div>
{/if}