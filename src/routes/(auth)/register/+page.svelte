<script lang="ts">
    import type { ActionData } from "../../../../.svelte-kit/types/src/routes";
    import { applyAction, enhance } from "$app/forms";
    import { goto } from "$app/navigation";

    export let form: ActionData;
    let isSubmitting = false;
</script>

<form method="POST" use:enhance={({cancel}) => {
	if (isSubmitting) {
		cancel();
	} else {
		isSubmitting = true;
	}

	return async ({ result }) => {
		if (result.type === 'redirect') {
			await goto(result.location);
		} else {
			isSubmitting = false
			await applyAction(result);
		}
	}
}}>
	<div class="flex flex-col justify-center items-center h-screen">
		<div class="flex flex-col w-1/5 gap-y-4">
			<h1 class="text-6xl font-bold text-center mb-8">Register</h1>
			<input
				class="input input-bordered"
				placeholder="Email"
				name="email"
				type="email"
				required
				value={form?.email ?? ""}
			/>
			<input
				class="input input-bordered"
				placeholder="Password"
				name="password"
				type="password"
				required
				value={form?.password ?? ""}
			/>
			<input
				class="input input-bordered"
				placeholder="Confirm password"
				name="passwordConfirmation"
				type="password"
				required
				value={form?.passwordConfirmation ?? ""}
			/>
			<div class="flex flex-row">
				<div class="flex-grow">
					<p><b>Note</b>: Email verifications not yet implemented! Expect database wipes.</p>
				</div>
				<input class="btn btn-primary w-1/12 min-w-24" type="submit" value="Submit" />
			</div>
		</div>
		<div class="mt-8 h-8">
			{#if form?.message != null}
				<p class="text-error"><b>Error</b>: {form?.message}</p>
			{/if}
		</div>
	</div>
</form>