import {
	createSponsorFixture,
	createUserFixture,
	runMigrations,
	truncateTables
} from './utils/fixtures';

async function globalSetup() {
	await runMigrations();
	await truncateTables();
	await createUserFixture();
	await createSponsorFixture();
	// await globalSeeder();
}

export default globalSetup;
