import {
	bounties,
	chains,
	comments,
	rewards,
	skills,
	sponsors,
	submissions,
	tokens,
	users,
	waitlist
} from '$lib/types/schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export interface Account {
	users: SelectUser;
	sponsors: SelectSponsor | null;
}

export const InsertSponsorSchema = createInsertSchema(sponsors);
export const UpdateSponsorSchema = InsertSponsorSchema.partial();
export type SelectSponsor = typeof sponsors.$inferSelect;
export type InsertSponsor = typeof sponsors.$inferInsert;

export const InsertBountySchema = createInsertSchema(bounties);
export const UpdateBountySchema = InsertBountySchema.extend({
	skills: z.array(z.string()).transform((arr) => arr.map((val) => parseInt(val, 10)))
});
export type SelectBounty = typeof bounties.$inferSelect;
export type InsertBounty = typeof bounties.$inferInsert;
export type UpdateBounty = z.infer<typeof UpdateBountySchema>;
export type EnhancedBounty = SelectBounty & {
	bountySkills: {
		bountyId: number;
		skillId: number;
		skill: SelectSkill;
	}[];
	comments: SelectComment[];
	submissions: SelectSubmission[];
	rewards: SelectReward[];
};

export const InsertRewardSchema = createInsertSchema(rewards);
export type SelectReward = typeof rewards.$inferSelect;
export type InsertReward = typeof rewards.$inferInsert;

export const InsertUserSchema = createInsertSchema(users);
export const UpdateUserSchema = InsertUserSchema.partial();
export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const InsetCommentSchema = createInsertSchema(comments);
export type SelectComment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

export const InsertSubmissionSchema = createInsertSchema(submissions);
export const UpdateSubmissionSchema = InsertSubmissionSchema.partial();
export type SelectSubmission = typeof submissions.$inferSelect;
export type InsertSubmission = typeof submissions.$inferInsert;
export type UpdateSubmission = z.infer<typeof UpdateSubmissionSchema>;
export const SubmissionState = {
	Unreviewed: 0,
	Accepted: 1,
	Rejected: 2
} as const;

export const InsertSkillSchema = createInsertSchema(skills);
export type SelectSkill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;

export type InsertToken = typeof tokens.$inferInsert;
export type SelectToken = typeof tokens.$inferSelect;

export type InsertChain = typeof chains.$inferInsert;
export type SelectChain = typeof chains.$inferSelect;

export const InsertWaitlistSchema = createInsertSchema(waitlist);
export type SelectWaitlist = typeof waitlist.$inferSelect;
export type InsertWaitlist = typeof waitlist.$inferInsert;
