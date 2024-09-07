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
import { relations } from 'drizzle-orm';

export const sponsors = pgTable('sponsors', {
	id: serial('id').primaryKey().unique(),
	displayName: text('display_name').notNull(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	email: text('email').notNull(),
	website: text('website').notNull(),
	twitter: text('twitter').notNull(),
	image: text('image').notNull(),
	bio: text('bio').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
});

export const sponsorRelations = relations(sponsors, ({ one }) => ({
	user: one(users, {
		fields: [sponsors.userId],
		references: [users.id]
	})
}));

export const skills = pgTable('skills', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique()
});

export const skillRelations = relations(skills, ({ many }) => ({
	users: many(users),
	bounties: many(bounties)
}));

// TODO: need to ensure that user always has a wallet address or an email address
// Wallet adress used to authenticate via SIWE
// Email is used to authenticate via social login
export const users = pgTable('users', {
	id: serial('id').primaryKey().unique(),
	displayName: text('display_name').notNull(),
	// TODO: wallet address can be null in a future where we have social login
	walletAddress: text('wallet_address').unique().notNull(),
	email: text('email').notNull().unique(),
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

export const userRelations = relations(users, ({ many }) => ({
	sponsors: many(sponsors),
	skills: many(skills)
}));

export const bounties = pgTable('bounties', {
	id: serial('id').primaryKey().unique(),
	sponsorId: serial('sponsor_id')
		.notNull()
		.references(() => sponsors.id),
	title: text('title').notNull(),
	description: text('description').notNull(),
	startDate: date('start_date').notNull(),
	endDate: date('end_date').notNull(),
	excerpt: text('excerpt').notNull(),
	approved: boolean('approved').notNull().default(false),
	createdAt: date('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
	draft: boolean('draft').notNull().default(true)
});

export const bountyRelations = relations(bounties, ({ many, one }) => ({
	skills: many(bountySkills),
	sponsor: one(sponsors, {
		fields: [bounties.sponsorId],
		references: [sponsors.id]
	}),
	comments: many(comments),
	submissions: many(submissions),
	rewards: many(rewards)
}));

export const bountySkills = pgTable('bounty_skills', {
	bountyId: integer('bounty_id')
		.references(() => bounties.id)
		.notNull(),
	skillId: integer('skill_id')
		.references(() => skills.id)
		.notNull()
});

export const bountySkillsRelations = relations(bountySkills, ({ one }) => ({
	bounty: one(bounties, {
		fields: [bountySkills.bountyId],
		references: [bounties.id]
	}),
	skill: one(skills, {
		fields: [bountySkills.skillId],
		references: [skills.id]
	})
}));
export const chains = pgTable('chains', {
	id: integer('id').primaryKey().unique(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
});

export const tokens = pgTable('tokens', {
	id: serial('id').primaryKey().unique(),
	name: text('name').notNull(),
	symbol: text('symbol').notNull(),
	address: text('address').notNull(),
	decimals: integer('decimals').notNull(),
	chainId: integer('chain_id')
		.references(() => chains.id)
		.notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
});

export const chainRelations = relations(chains, ({ many }) => ({
	tokens: many(tokens)
}));

export const tokenRelations = relations(tokens, ({ one }) => ({
	chain: one(chains, {
		fields: [tokens.chainId],
		references: [chains.id]
	})
}));

export const rewards = pgTable('rewards', {
	id: serial('id').primaryKey().unique(),
	rank: integer('rank').notNull(),
	bountyId: integer('bounty_id')
		.references(() => bounties.id)
		.notNull(),
	tokenId: integer('token_id')
		.references(() => tokens.id)
		.notNull(),
	amount: bigint('amount', { mode: 'bigint' }).notNull(),
	winner: integer('winner').references(() => submissions.id),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
});

export const rewardRelations = relations(rewards, ({ one }) => ({
	bounty: one(bounties, {
		fields: [rewards.bountyId],
		references: [bounties.id]
	}),
	token: one(tokens, {
		fields: [rewards.tokenId],
		references: [tokens.id]
	}),
	winner: one(submissions, {
		fields: [rewards.winner],
		references: [submissions.id]
	})
}));

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

export const submissionRelations = relations(submissions, ({ one }) => ({
	bounty: one(bounties, {
		fields: [submissions.bountyId],
		references: [bounties.id]
	}),
	user: one(users, {
		fields: [submissions.userId],
		references: [users.id]
	})
}));

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

export const commentRelations = relations(comments, ({ one }) => ({
	bounty: one(bounties, {
		fields: [comments.bountyId],
		references: [bounties.id]
	}),
	user: one(users, {
		fields: [comments.userId],
		references: [users.id]
	})
}));

export default {
	sponsors,
	bounties,
	rewards,
	users,
	comments,
	submissions,
	skills,
	tokens,
	chains,

	sponsorRelations,
	bountyRelations,
	bountySkillsRelations,
	rewardRelations,
	userRelations,
	commentRelations,
	submissionRelations,
	tokenRelations,
	chainRelations
} as const;
