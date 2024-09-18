ALTER TABLE "bounty_skills" ADD CONSTRAINT "bounty_skills_bounty_id_skill_id_pk" PRIMARY KEY("bounty_id","skill_id");--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_user_id_skill_id_pk" PRIMARY KEY("user_id","skill_id");--> statement-breakpoint
ALTER TABLE "tokens" ADD COLUMN "logo" text NOT NULL;