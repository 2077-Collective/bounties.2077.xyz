<script lang="ts">
	// Mock data for bounties
	const mockBounties = [
		{
			id: 1,
			title: 'Develop a DeFi Dashboard',
			sponsorName: 'DeFi Corp',
			status: 'Open',
			endDate: '2023-12-31'
		},
		{
			id: 2,
			title: 'Create an NFT Marketplace',
			sponsorName: 'NFT World',
			status: 'In Progress',
			endDate: '2023-11-30'
		},
		{
			id: 3,
			title: 'Implement a Smart Contract',
			sponsorName: 'Blockchain Inc',
			status: 'Closed',
			endDate: '2023-10-15'
		}
	];

	type BountyStatus = 'All' | 'Open' | 'In Progress' | 'Closed';

	let statusFilter: BountyStatus = 'All';

	$: filteredBounties =
		statusFilter === 'All'
			? mockBounties
			: mockBounties.filter((bounty) => bounty.status === statusFilter);
</script>

<div class="min-h-screen bg-gray-100">
	<nav class="bg-white shadow-lg">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex-shrink-0">
					<h1 class="text-xl font-bold text-gray-800">Bounty App</h1>
				</div>
				<div class="hidden md:block">
					<div class="ml-10 flex items-baseline space-x-4">
						<button
							class="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Profile
						</button>
						<button
							class="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Sponsor
						</button>
						<button
							class="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Config
						</button>
					</div>
				</div>
				<div class="md:hidden">
					<button
						class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
					>
						<span class="sr-only">Open main menu</span>
						<svg
							class="block h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</nav>

	<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-2xl font-semibold text-gray-900">Bounties</h2>
			</div>

			<div class="mb-6">
				<label for="status" class="block text-sm font-medium text-gray-700">Filter by Status</label>
				<select
					id="status"
					name="status"
					class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
					bind:value={statusFilter}
				>
					<option>All</option>
					<option>Open</option>
					<option>In Progress</option>
					<option>Closed</option>
				</select>
			</div>

			<div class="bg-white shadow overflow-hidden sm:rounded-md">
				<ul role="list" class="divide-y divide-gray-200">
					{#each filteredBounties as bounty (bounty.id)}
						<li>
							<a href="#" class="block hover:bg-gray-50">
								<div class="px-4 py-4 sm:px-6">
									<div class="flex items-center justify-between">
										<p class="text-sm font-medium text-indigo-600 truncate">{bounty.title}</p>
										<div class="ml-2 flex-shrink-0 flex">
											<p
												class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													bounty.status === 'Open'
														? 'bg-green-100 text-green-800'
														: bounty.status === 'In Progress'
															? 'bg-yellow-100 text-yellow-800'
															: 'bg-red-100 text-red-800'
												}`}
											>
												{bounty.status}
											</p>
										</div>
									</div>
									<div class="mt-2 sm:flex sm:justify-between">
										<div class="sm:flex">
											<p class="flex items-center text-sm text-gray-500">
												Sponsored by {bounty.sponsorName}
											</p>
										</div>
										<div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
											<p>
												Closes on {new Date(bounty.endDate).toLocaleDateString()}
											</p>
										</div>
									</div>
								</div>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>
