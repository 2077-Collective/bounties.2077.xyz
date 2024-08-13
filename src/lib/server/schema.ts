import {
	bigint,
	boolean,
	date,
	integer,
	pgTable,
	primaryKey,
	serial,
	smallint,
	text
} from 'drizzle-orm/pg-core';

export const sponsor = pgTable('sponsor', {
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

// TODO: missing skills
export const user = pgTable('user', {
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

// TODO: missing skills needed
export const bounty = pgTable('bounty', {
	id: serial('id').primaryKey(),
	sponsorId: serial('sponsor_id')
		.references(() => sponsor.id)
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

// TODO: missing winner submission
export const reward = pgTable('reward', {
	id: serial('id').primaryKey(),
	bountyId: integer('bounty_id')
		.references(() => bounty.id)
		.notNull(),
	amount: bigint('amount', { mode: 'bigint' }).notNull(),
	// winner: integer('winner').references(() => submission.),
	createdAt: date('created_at').notNull(),
	updatedAt: date('updated_at')
});

export const submission = pgTable(
	'submission',
	{
		bountyId: integer('bounty_id')
			.references(() => bounty.id)
			.notNull(),
		userId: integer('user_id')
			.references(() => user.id)
			.notNull(),
		state: smallint('state').notNull().default(0),
		link: text('link').notNull(),
		details: text('description').notNull(),
		createdAt: date('created_at').notNull(),
		updatedAt: date('updated_at')
	},
	(table) => ({
		pk: primaryKey({ columns: [table.bountyId, table.userId] })
	})
);

export const comment = pgTable('comment', {
	id: serial('id').primaryKey(),
	bountyId: integer('bounty_id')
		.references(() => bounty.id)
		.notNull(),
	userId: integer('user_id')
		.references(() => user.id)
		.notNull(),
	content: text('content').notNull(),
	createdAt: date('created_at').notNull(),
	updatedAt: date('updated_at')
});
