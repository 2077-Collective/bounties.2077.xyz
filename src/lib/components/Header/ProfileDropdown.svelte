<script lang="ts">
	import ProfileImage from '$lib/components/ProfileImage.svelte';
	import { CirclePlus, LogOut, User, Settings, RefreshCcw, LayoutDashboard } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { getAccount } from '$lib/stores/account.svelte';

	const account = getAccount();
</script>

<!-- TODO: When implementing switch profile functions, make sure to update locals on the API -->
<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<!-- TODO: Review this logic when implementing user profile -->
		<ProfileImage image={account?.users?.image} />
	</DropdownMenu.Trigger>

	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.Item class="cursor-pointer" href={`/app/profile/user/${account?.users.id}`}>
				<User class="mr-2 h-4 w-4" />
				<span>Profile</span>
				<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
			</DropdownMenu.Item>

			{#if account?.sponsors}
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="cursor-pointer" href="/app/dashboard/sponsor/bounties">
					<LayoutDashboard class="mr-2 h-4 w-4" />
					<span>Sponsor dashboard</span>
					<DropdownMenu.Shortcut>⇧⌘D</DropdownMenu.Shortcut>
				</DropdownMenu.Item>

				<DropdownMenu.Item class="cursor-pointer" href="/app/dashboard/sponsor/create-bounty">
					<CirclePlus class="mr-2 h-4 w-4" />
					<span>Create bounty</span>
					<DropdownMenu.Shortcut>⇧⌘B</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
			{/if}

			<DropdownMenu.Item class="cursor-pointer" href="/app/dashboard/user/edit">
				<Settings class="mr-2 h-4 w-4" />
				<span>Settings</span>
				<DropdownMenu.Shortcut>⇧⌘,</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		</DropdownMenu.Group>

		<DropdownMenu.Separator />

		<DropdownMenu.Item class="cursor-pointer">
			<LogOut class="mr-2 h-4 w-4" />
			<span>Log out</span>
			<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
