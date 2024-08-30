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
							<a href="/bounty" class="block hover:bg-gray-50">
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
