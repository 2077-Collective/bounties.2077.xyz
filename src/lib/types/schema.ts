import {
	bigint,
	boolean,
	date,
	integer,
	pgTable,
	primaryKey,
	serial,
	smallint,
	text,
	timestamp
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const sponsors = pgTable('sponsors', {
	id: serial('id').primaryKey().unique(),
	// TODO: display name needs to be unique
	displayName: text('display_name').notNull(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	// TODO: email should be unique
	email: text('email').notNull().unique(),
	website: text('website').notNull(),
	twitter: text('twitter').notNull(),
	image: text('image').notNull(),
	bio: text('bio').notNull(),
	createdAt: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
});

export const sponsorRelations = relations(sponsors, ({ one, many }) => ({
	user: one(users, {
		fields: [sponsors.userId],
		references: [users.id]
	}),
	bounties: many(bounties)
}));

export const skills = pgTable('skills', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique()
});

export const skillRelations = relations(skills, ({ many }) => ({
	userSkills: many(userSkills),
	bountySkills: many(bountySkills)
}));

// TODO: need to ensure that user always has a wallet address or an email address
// Wallet adress used to authenticate via SIWE
// Email is used to authenticate via social login
export const users = pgTable('users', {
	id: serial('id').primaryKey().unique(),
	displayName: text('display_name').notNull(),
	// TODO: wallet address can be null in a future where we have social login
	walletAddress: text('wallet_address').unique().notNull(),
	email: text('email').unique(),
	image: text('image'),
	website: text('website'),
	twitter: text('twitter'),
	bio: text('bio'),
	createdAt: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
});

export const userRelations = relations(users, ({ many }) => ({
	// TODO: do we want a many to one relationship or one to one?
	sponsors: many(sponsors),
	userSkills: many(userSkills),
	bookmarks: many(userBookmarks),
	submissions: many(submissions)
}));

export const userSkills = pgTable(
	'user_skills',
	{
		userId: integer('user_id')
			.references(() => users.id)
			.notNull(),
		skillId: integer('skill_id')
			.references(() => skills.id)
			.notNull()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.skillId] })
	})
);

export const userSkillsRelations = relations(userSkills, ({ one }) => ({
	user: one(users, {
		fields: [userSkills.userId],
		references: [users.id]
	}),
	skill: one(skills, {
		fields: [userSkills.skillId],
		references: [skills.id]
	})
}));

export const userBookmarks = pgTable(
	'user_bookmarks',
	{
		userId: integer('user_id')
			.references(() => users.id)
			.notNull(),
		bountyId: integer('bounty_id')
			.references(() => bounties.id)
			.notNull(),
		createdAt: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.bountyId] })
	})
);

export const userBookmarksRelations = relations(userBookmarks, ({ one }) => ({
	user: one(users, {
		fields: [userBookmarks.userId],
		references: [users.id]
	}),
	bounty: one(bounties, {
		fields: [userBookmarks.bountyId],
		references: [bounties.id]
	})
}));

export const bookmarkRelations = relations(userBookmarks, ({ one }) => ({
	user: one(users, {
		fields: [userBookmarks.userId],
		references: [users.id]
	}),
	bounty: one(bounties, {
		fields: [userBookmarks.bountyId],
		references: [bounties.id]
	})
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
	createdAt: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
	draft: boolean('draft').notNull().default(true)
});

export const bountyRelations = relations(bounties, ({ many, one }) => ({
	bountySkills: many(bountySkills),
	sponsor: one(sponsors, {
		fields: [bounties.sponsorId],
		references: [sponsors.id]
	}),
	comments: many(comments),
	submissions: many(submissions),
	rewards: many(rewards),
	bookmars: many(userBookmarks)
}));

export const bountySkills = pgTable(
	'bounty_skills',
	{
		bountyId: integer('bounty_id')
			.references(() => bounties.id)
			.notNull(),
		skillId: integer('skill_id')
			.references(() => skills.id)
			.notNull()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.bountyId, t.skillId] })
	})
);

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
	createdAt: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
});

export const tokens = pgTable('tokens', {
	id: serial('id').primaryKey().unique(),
	name: text('name').notNull(),
	symbol: text('symbol').notNull(),
	address: text('address').notNull(),
	decimals: integer('decimals').notNull(),
	logo: text('logo').notNull(),
	chainId: integer('chain_id')
		.references(() => chains.id)
		.notNull(),
	createdAt: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
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
	createdAt: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
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
	details: text('details').notNull(),
	recipientWallet: text('recipient_wallet').notNull(),
	createdAt: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
});

export const submissionLinks = pgTable('submission_links', {
	id: serial('id').primaryKey().unique(),
	submissionId: integer('submission_id')
		.references(() => submissions.id)
		.notNull(),
	link: text('link').notNull(),
	isFile: boolean('is_file').notNull()
});

export const submissionLinksRelations = relations(submissionLinks, ({ one }) => ({
	submission: one(submissions, {
		fields: [submissionLinks.submissionId],
		references: [submissions.id]
	})
}));

export const submissionRelations = relations(submissions, ({ one, many }) => ({
	bounty: one(bounties, {
		fields: [submissions.bountyId],
		references: [bounties.id]
	}),
	user: one(users, {
		fields: [submissions.userId],
		references: [users.id]
	}),
	submissionLinks: many(submissionLinks)
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
	createdAt: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
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

export const waitlist = pgTable('waitlist', {
	id: serial('id').primaryKey().unique(),
	email: text('email').notNull().unique(),
	referralCode: text('referral_uuid').notNull(),
	createdAt: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
	inviteUsed: boolean('invite_used').notNull().default(false),
	inviteSentAt: timestamp('invite_sent_at'),
	// Cannot set as refereced to waitlist.id because it is not created yet
	referredBy: integer('referred_by')
});

export const waitlistReferralRelations = relations(waitlist, ({ one }) => ({
	wailistId: one(waitlist, {
		fields: [waitlist.id],
		references: [waitlist.id]
	}),
	referredBy: one(waitlist, {
		fields: [waitlist.referredBy],
		references: [waitlist.id]
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
	waitlist,

	sponsorRelations,
	bountyRelations,
	bountySkillsRelations,
	rewardRelations,
	userRelations,
	commentRelations,
	submissionRelations,
	tokenRelations,
	chainRelations,
	waitlistReferralRelations
} as const;
