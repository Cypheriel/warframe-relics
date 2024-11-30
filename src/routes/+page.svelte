<script lang="ts">
    let { data } = $props();
    import { copy } from "svelte-copy";

    let code = Math.random().toString(36).slice(2, 8).toUpperCase();
    let profile = $state("");
    const profileIdRegExp = /profile\/(\d{1,8})/;
    const verifyCodeRegExp = /<p>[\s\b]+([A-Z0-9]+)\s<\/p>/;

    function getProfileId(url: string) {
        return (profileIdRegExp.exec(url) ?? [])[1];
    }

    async function verifyCode(): Promise<boolean> {
        const profileUrl = `https://cors-anywhere.herokuapp.com/https://forums.warframe.com/profile/${getProfileId(profile)}-undefined/?tab=field_core_pfield_1&code=${code}`
				console.log(`Profile URL: ${profileUrl}`);
        const response = await fetch(
            profileUrl, {
                headers: {
                    "Origin": "https://cors-anywhere.herokuapp.com",
										"X-Requested-With": "XMLHttpRequest",
										"Pragma": "no-cache",
										"Cache-Control": "no-cache",
								}
						});

        const body = await response.text()
				console.log(body)
        const content = (verifyCodeRegExp.exec(body) ?? [])[1]
				console.log(content)
				return content == code
    }

    let verified = $state(false);
    let failed = $state(false);
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
				<p class="mx-auto font-bold">{data.user.email}</p>
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
	<h2 class="text-2xl text-secondary">Instructions</h2>
	<ol class="list-decimal w-1/4">
		<li>Log into your <a class="underline" target="_blank" rel="noopener noreferrer"
												 href="https://forums.warframe.com/login">Warframe account</a></li>
		<li>Visit your profile on the <a class="underline" target="_blank" rel="noopener noreferrer"
																		 href="https://forums.warframe.com/">Warframe forums</a></li>
		<li>
			<p>Copy the URL of your profile and paste it below</p>
			<input class="input input-bordered w-full mt-4 mb-2"
						 placeholder="E.g. https://forums.warframe.com/profile/0000001-username/" type="text" name="profile"
						 bind:value={profile} required />
		</li>
		<li>
			Paste/enter your 6-character code into your
			<a class="underline" target="_blank" rel="noopener noreferrer"
				 href="https://forums.warframe.com/profile/{getProfileId(profile)}-undefined/edit/">About Me</a>
		</li>
	</ol>
	<a href={"javascript:void(0)"} class="underline tooltip tooltip-right text-5xl my-4" data-tip="Click to copy" use:copy={{
		text: code,
		onCopy: function () {
			alert("Code copied to clipboard.")
		},
	}}><code>{code}</code></a>
	<button type="button" class="btn btn-primary" onclick={async () => {verified = await verifyCode(); failed = !verified}}>Verify</button>
	{#if verified === true}
		<div class="flex flex-row gap-2">
			<p class="text-success text-lg font-bold">Success!</p>
			<p class="text-success">Your account has successfully been verified.</p>
		</div>
	{/if}
	{#if failed === true}
		<div class="flex flex-row gap-2">
			<p class="text-error text-lg font-bold">Failure!</p>
			<p class="text-error">Failed to verify your account. Please refresh and try again.</p>
		</div>
	{/if}
</div>

<div class="toast">
	<div class="alert alert-warning">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 shrink-0 stroke-current"
			fill="none"
			viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
		</svg>
		<span>Verification status is not being stored! This is currently a proof of concept.</span>
	</div>
</div>