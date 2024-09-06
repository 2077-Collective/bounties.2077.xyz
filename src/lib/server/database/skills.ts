import { db } from '.';
import { skills, type InsertSkill } from '../schema';

export async function batchCreateSkills(s: InsertSkill[]) {
	return db.insert(skills).values(s).returning();
}

export async function getSkills() {
	return db.select().from(skills);
}
