<script>
	import { Section, Page404, Page500 } from 'flowbite-svelte-blocks';
	import { Button } from 'flowbite-svelte';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} - {page.error?.message || 'Error'}</title>
</svelte:head>

{#if page.status === 404}
	<Section name="page404">
		<Page404>
			{#snippet h1()}
				404
			{/snippet}
			{#snippet paragraph()}
				<p class="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
					Something's missing.
				</p>
				<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
					Sorry, we can't find that page. You'll find lots to explore on the home page.
				</p>
				<Button href="/" size="lg" color="red">Back to Homepage</Button>
			{/snippet}
		</Page404>
	</Section>
{:else if page.status >= 500}
	<Section name="page500">
		<Page500>
			{#snippet h1()}500{/snippet}
			{#snippet paragraph()}
				<p class="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
					Internal Server Error.
				</p>
				<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
					We are already working to solve the problem.
				</p>
			{/snippet}
		</Page500>
	</Section>
{:else}
	<!-- Generic Error Icon -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
	>
		<path
			d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
		></path>
		<line x1="12" y1="9" x2="12" y2="13"></line>
		<line x1="12" y1="17" x2="12.01" y2="17"></line>
	</svg>
	{#snippet h1()}{page.status}{/snippet}
	{#snippet paragraph()}
	{page.error}
	{/snippet}
{/if}

	{#if import.meta.env.DEV && page.error?.stack}
			<details class="error-details">
				<summary>Error Details (Development Only)</summary>
				<pre>{page.error.stack}</pre>
			</details>
		{/if}