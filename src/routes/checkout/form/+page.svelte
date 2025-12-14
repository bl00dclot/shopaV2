<script lang="ts">
	// import type { PageProps } from './$types';
	import { Label, Input, Checkbox, Button, A } from 'flowbite-svelte';

	let { data } = $props();
</script>

<form>
	<div class="mb-6 grid gap-6 md:grid-cols-2">
		<div class="mb-6">
			<Label for="default-input" class="mb-2 block">Default input</Label>
			<Input id="default-input" placeholder="Default input" />
		</div>
		<div class="mb-6">
			<Label for="default-input" class="mb-2 block">Default input</Label>
			<Input id="default-input" placeholder="Default input" />
		</div>
		<div class="mb-6">
			<Label for="email" class="mb-2">Email address</Label>
			<Input type="email" id="email" placeholder="john.doe@company.com" required />
		</div>
		<div class="mb-6">
			<Label for="default-input" class="mb-2 block">Default input</Label>
			<Input id="default-input" placeholder="Default input" />
		</div>
		<div class="mb-6">
			<Label for="number-input">Select a number:</Label>
			<Input
				type="number"
				id="number-input"
				aria-describedby="helper-text-explanation"
				placeholder="90210"
				required
			/>
		</div>
	</div>
	<Checkbox classes={{ div: 'mb-6 gap-1 rtl:space-x-reverse' }} required>
		I agree with the <A href="" class="text-primary-700 dark:text-primary-600 hover:underline"
			>terms and conditions</A>.
	</Checkbox>
	<Button type="submit">Submit</Button>
</form>
