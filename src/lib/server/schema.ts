import {
	bigint,
	boolean,
	date,
	integer,
	pgTable,
	serial,
	smallint,
	text,
	timestamp
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod';

// Database schemas
export const sponsors = pgTable('sponsors', {
	id: serial('id').primaryKey().unique(),
	displayName: text('display_name').notNull(),
	username: text('username').notNull().unique(),
	email: text('email').notNull(),
	website: text('website').notNull(),
	twitter: text('twitter').notNull(),
	image: text('image').notNull(),
	bio: text('bio').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
});

export const skills = pgTable('skills', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique()
});

export const users = pgTable('users', {
	id: serial('id').primaryKey().unique(),
	displayName: text('display_name').notNull(),
	username: text('username').notNull().unique(),
	email: text('email').notNull(),
	image: text('image'),
	website: text('website'),
	twitter: text('twitter'),
	bio: text('bio').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
});

export const userSkills = pgTable('user_skills', {
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	skillId: integer('skill_id')
		.references(() => skills.id)
		.notNull()
});

export const bounties = pgTable('bounties', {
	id: serial('id').primaryKey().unique(),
	sponsorId: serial('sponsor_id')
		.references(() => sponsors.id)
		.notNull(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	startDate: date('start_date').notNull(),
	endDate: date('end_date').notNull(),
	contact: text('contact').notNull(),
	approved: boolean('approved').notNull().default(false),
	createdAt: date('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
});

export const bountySkills = pgTable('bounty_skills', {
	bountyId: integer('bounty_id')
		.references(() => bounties.id)
		.notNull(),
	skillId: integer('skill_id')
		.references(() => skills.id)
		.notNull()
});

export const rewards = pgTable('rewards', {
	id: serial('id').primaryKey().unique(),
	bountyId: integer('bounty_id')
		.references(() => bounties.id)
		.notNull(),
	amount: bigint('amount', { mode: 'bigint' }).notNull(),
	winner: integer('winner').references(() => submissions.id),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
});

export const submissions = pgTable('submissions', {
	id: serial('id').primaryKey().unique(),
	bountyId: integer('bounty_id')
		.references(() => bounties.id)
		.notNull(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	state: smallint('state').notNull().default(0),
	link: text('link').notNull(),
	details: text('description').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
});

export const comments = pgTable('comments', {
	id: serial('id').primaryKey().unique(),
	bountyId: integer('bounty_id')
		.references(() => bounties.id)
		.notNull(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
});

// Types
export const InsertSponsorSchema = createInsertSchema(sponsors);
export const UpdateSponsorSchema = InsertSponsorSchema.partial();
export type SelectSponsor = typeof sponsors.$inferSelect;
export type InsertSponsor = typeof sponsors.$inferInsert;

export const InsertBountySchema = createInsertSchema(bounties);
export const UpdateBountySchema = InsertBountySchema.partial();
export type SelectBounty = typeof bounties.$inferSelect;
export type InsertBounty = typeof bounties.$inferInsert;
export type UpdateBounty = z.infer<typeof UpdateBountySchema>;
