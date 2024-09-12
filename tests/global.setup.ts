import { createSponsorFixture, createUserFixture, runMigrations } from './fixtures';
import { globalSeeder } from '../scripts/db/seed';

async function globalSetup() {
	console.log('Running global setup');
	await runMigrations();
	await createUserFixture();
	await createSponsorFixture();
	await globalSeeder();
	console.log('Global setup complete');
}

export default globalSetup;
