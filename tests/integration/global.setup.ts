import { createSponsorFixture, createUserFixture, runMigrations } from './utils/fixtures';
import { globalSeeder } from '../../scripts/db/seed';

async function globalSetup() {
	await runMigrations();
	await createUserFixture();
	await createSponsorFixture();
	await globalSeeder();
}

export default globalSetup;
