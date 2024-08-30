<script lang="ts">
	import { Calendar, DollarSign, Edit, User } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// Mock data
	let sponsorData = {
		id: 1,
		displayName: 'TechCorp',
		email: 'sponsor@techcorp.com',
		website: 'https://techcorp.com',
		twitter: '@techcorp',
		image: '/placeholder.svg?height=100&width=100',
		bio: 'Leading technology solutions provider'
	};

	let bountiesData = [
		{
			id: 1,
			title: 'Develop a DeFi Dashboard',
			status: 'Open',
			startDate: '2023-06-01',
			endDate: '2023-07-31',
			prizes: [
				{ rank: 1, amount: 5000 },
				{ rank: 2, amount: 2000 },
				{ rank: 3, amount: 1000 }
			],
			submissions: [
				{ id: 1, userId: 101, state: 'Submitted', link: 'https://github.com/user1/defi-dashboard' },
				{
					id: 2,
					userId: 102,
					state: 'Under Review',
					link: 'https://github.com/user2/defi-dashboard'
				}
			]
		},
		{
			id: 2,
			title: 'Create an NFT Marketplace',
			status: 'Closed',
			startDate: '2023-05-01',
			endDate: '2023-06-15',
			prizes: [
				{ rank: 1, amount: 10000 },
				{ rank: 2, amount: 5000 }
			],
			submissions: [
				{ id: 3, userId: 103, state: 'Winner', link: 'https://github.com/user3/nft-marketplace' },
				{ id: 4, userId: 104, state: 'Runner-up', link: 'https://github.com/user4/nft-marketplace' }
			]
		}
	];

	let isEditing = false;
	let activeTab = 'bounties';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-8">Sponsor Dashboard</h1>

	<div class="mb-4">
		<div class="flex border-b">
			<button
				class="py-2 px-4 font-semibold {activeTab === 'bounties' ? 'border-b-2 border-black' : ''}"
				on:click={() => (activeTab = 'bounties')}
			>
				Bounties
			</button>
			<button
				class="py-2 px-4 font-semibold {activeTab === 'profile' ? 'border-b-2 border-black' : ''}"
				on:click={() => (activeTab = 'profile')}
			>
				Profile
			</button>
		</div>
	</div>

	{#if activeTab === 'bounties'}
		<div class="space-y-6">
			{#each bountiesData as bounty (bounty.id)}
				<div class="bg-white shadow-md rounded-lg p-6">
					<div class="mb-4">
						<h2 class="text-2xl font-bold">{bounty.title}</h2>
						<div class="flex items-center justify-between mt-2">
							<span
								class="px-2 py-1 text-sm font-semibold rounded-full {bounty.status === 'Open'
									? 'bg-green-100 text-green-800'
									: 'bg-gray-100 text-gray-800'}"
							>
								{bounty.status}
							</span>
							<div class="flex items-center space-x-2">
								<Calendar class="h-4 w-4" />
								<span class="text-sm text-gray-600"
									>{new Date(bounty.startDate).toLocaleDateString()} - {new Date(
										bounty.endDate
									).toLocaleDateString()}</span
								>
							</div>
						</div>
					</div>
					<div class="mb-4">
						<h3 class="text-lg font-semibold mb-2">Prizes</h3>
						<ul class="space-y-1">
							{#each bounty.prizes as prize (prize.rank)}
								<li class="flex items-center">
									<DollarSign class="h-4 w-4 mr-2 text-green-500" />
									<span>Rank {prize.rank}: ${prize.amount.toLocaleString()}</span>
								</li>
							{/each}
						</ul>
					</div>
					<div>
						<h3 class="text-lg font-semibold mb-2">Submissions</h3>
						<ul class="space-y-2">
							{#each bounty.submissions as submission (submission.id)}
								<li class="flex items-center justify-between">
									<span>User {submission.userId}</span>
									<span
										class="px-2 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800"
										>{submission.state}</span
									>
									<a
										href={submission.link}
										target="_blank"
										rel="noopener noreferrer"
										class="text-blue-500 hover:underline">View Submission</a
									>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
		</div>
	{:else if activeTab === 'profile'}
		<div class="bg-white shadow-md rounded-lg p-6">
			<h2 class="text-2xl font-bold mb-4">Sponsor Profile</h2>
			{#if isEditing}
				<form class="space-y-4" action="?/updateSponsor" method="POST">
					<div>
						<label for="displayName" class="block text-sm font-medium text-gray-700"
							>Display Name</label
						>
						<input
							id="displayName"
							name="displayName"
							type="text"
							bind:value={data.sponsor.displayName}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
						/>
					</div>
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							bind:value={data.sponsor.email}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
						/>
					</div>
					<div>
						<label for="website" class="block text-sm font-medium text-gray-700">Website</label>
						<input
							id="website"
							name="website"
							type="url"
							bind:value={data.sponsor.website}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
						/>
					</div>
					<div>
						<label for="twitter" class="block text-sm font-medium text-gray-700">Twitter</label>
						<input
							id="twitter"
							name="twitter"
							type="text"
							bind:value={data.sponsor.twitter}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
						/>
					</div>
					<div>
						<label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
						<textarea
							id="bio"
							name="bio"
							bind:value={data.sponsor.bio}
							rows="4"
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
						></textarea>
					</div>
					<button
						type="submit"
						class="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
					>
						Save Changes
					</button>
				</form>
			{:else}
				<div class="space-y-4">
					<div class="flex items-center space-x-4">
						<img
							src={data.sponsor.image}
							alt={data.sponsor.displayName}
							class="h-20 w-20 rounded-full"
						/>
						<div>
							<h3 class="text-xl font-semibold">{data.sponsor.displayName}</h3>
							<p class="text-gray-500">{data.sponsor.email}</p>
						</div>
					</div>
					<div>
						<h4 class="font-semibold">Website</h4>
						<a
							href={data.sponsor.website}
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-500 hover:underline">{data.sponsor.website}</a
						>
					</div>
					<div>
						<h4 class="font-semibold">Twitter</h4>
						<p>{data.sponsor.twitter}</p>
					</div>
					<div>
						<h4 class="font-semibold">Bio</h4>
						<p>{data.sponsor.bio}</p>
					</div>
					<button
						on:click={() => (isEditing = true)}
						class="flex items-center px-4 py-2 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
					>
						<Edit class="h-4 w-4 mr-2" />
						Edit Profile
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>
