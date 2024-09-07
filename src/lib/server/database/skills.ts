import { db } from '.';
import { skills } from '$lib/types/schema';
import type { InsertSkill } from '$lib/types';

export async function batchCreateSkills(s: InsertSkill[]) {
	return db.insert(skills).values(s).returning();
}

export async function getSkills() {
	return db.select().from(skills);
}
