import {
	bigint,
	boolean,
	date,
	integer,
	pgTable,
	serial,
	smallint,
	text
} from 'drizzle-orm/pg-core';

export const sponsors = pgTable('sponsors', {
	id: serial('id').primaryKey(),
	displayName: text('name').notNull(),
	username: text('name').notNull(),
	email: text('email').notNull(),
	website: text('website').notNull(),
	twitter: text('twitter').notNull(),
	image: text('image').notNull(),
	bio: text('bio').notNull(),
	createdAt: date('created_at').notNull(),
	updatedAt: date('updated_at')
});

export const skills = pgTable('skills', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique()
});

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	displayName: text('name').notNull(),
	username: text('name').notNull(),
	email: text('email').notNull(),
	image: text('image'),
	website: text('website'),
	twitter: text('twitter'),
	bio: text('bio').notNull(),
	createdAt: date('created_at').notNull().defaultNow(),
	updatedAt: date('updated_at')
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
	id: serial('id').primaryKey(),
	sponsorId: serial('sponsor_id')
		.references(() => sponsors.id)
		.notNull(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	startDate: date('start_date').notNull(),
	endDate: date('end_date').notNull(),
	contact: text('contact').notNull(),
	approved: boolean('approved').notNull().default(false),
	createdAt: date('created_at').notNull(),
	updatedAt: date('updated_at')
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
	id: serial('id').primaryKey(),
	bountyId: integer('bounty_id')
		.references(() => bounties.id)
		.notNull(),
	amount: bigint('amount', { mode: 'bigint' }).notNull(),
	winner: integer('winner').references(() => submissions.id),
	createdAt: date('created_at').notNull(),
	updatedAt: date('updated_at')
});

export const submissions = pgTable('submissions', {
	id: serial('id').primaryKey(),
	bountyId: integer('bounty_id')
		.references(() => bounties.id)
		.notNull(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	state: smallint('state').notNull().default(0),
	link: text('link').notNull(),
	details: text('description').notNull(),
	createdAt: date('created_at').notNull(),
	updatedAt: date('updated_at')
});

export const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	bountyId: integer('bounty_id')
		.references(() => bounties.id)
		.notNull(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	content: text('content').notNull(),
	createdAt: date('created_at').notNull(),
	updatedAt: date('updated_at')
});
