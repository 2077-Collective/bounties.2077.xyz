import { eq, inArray } from 'drizzle-orm';
import { db } from '.';
import { users, type InsertUser, type UpdateUser, type SelectUser } from '../schema';

export function createNewUser(user: InsertUser) {
	return db.insert(users).values(user).returning();
}

export async function getUsers(ids: number[]) {
	return db.select().from(users).where(inArray(users.id, ids)).execute();
}

export async function getUserById(id: number) {
	const user: SelectUser[] = await db
		.select()
		.from(users)
		.where(eq(users.id, id))
		.limit(1)
		.execute();

	if (user.length === 0) return null;

	return user[0];
}

export async function updateUserById(id: number, user: UpdateUser) {
	return db.update(users).set(user).where(eq(users.id, id));
}
