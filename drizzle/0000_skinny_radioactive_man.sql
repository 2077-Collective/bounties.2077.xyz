CREATE TABLE IF NOT EXISTS "bounties" (
	"id" serial PRIMARY KEY NOT NULL,
	"sponsor_id" serial NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"excerpt" text NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	"draft" boolean DEFAULT true NOT NULL,
	CONSTRAINT "bounties_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bounty_skills" (
	"bounty_id" integer NOT NULL,
	"skill_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chains" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	CONSTRAINT "chains_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"bounty_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	CONSTRAINT "comments_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"rank" integer NOT NULL,
	"bounty_id" integer NOT NULL,
	"token_id" integer NOT NULL,
	"amount" bigint NOT NULL,
	"winner" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	CONSTRAINT "rewards_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "skills_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sponsors" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"user_id" integer NOT NULL,
	"email" text NOT NULL,
	"website" text NOT NULL,
	"twitter" text NOT NULL,
	"image" text NOT NULL,
	"bio" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	CONSTRAINT "sponsors_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"bounty_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"state" smallint DEFAULT 0 NOT NULL,
	"link" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	CONSTRAINT "submissions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"symbol" text NOT NULL,
	"address" text NOT NULL,
	"decimals" integer NOT NULL,
	"chain_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	CONSTRAINT "tokens_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_skills" (
	"user_id" integer NOT NULL,
	"skill_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"wallet_address" text NOT NULL,
	"email" text NOT NULL,
	"image" text,
	"website" text,
	"twitter" text,
	"bio" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_wallet_address_unique" UNIQUE("wallet_address"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bounties" ADD CONSTRAINT "bounties_sponsor_id_sponsors_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bounty_skills" ADD CONSTRAINT "bounty_skills_bounty_id_bounties_id_fk" FOREIGN KEY ("bounty_id") REFERENCES "public"."bounties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bounty_skills" ADD CONSTRAINT "bounty_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_bounty_id_bounties_id_fk" FOREIGN KEY ("bounty_id") REFERENCES "public"."bounties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rewards" ADD CONSTRAINT "rewards_bounty_id_bounties_id_fk" FOREIGN KEY ("bounty_id") REFERENCES "public"."bounties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rewards" ADD CONSTRAINT "rewards_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rewards" ADD CONSTRAINT "rewards_winner_submissions_id_fk" FOREIGN KEY ("winner") REFERENCES "public"."submissions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_bounty_id_bounties_id_fk" FOREIGN KEY ("bounty_id") REFERENCES "public"."bounties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tokens" ADD CONSTRAINT "tokens_chain_id_chains_id_fk" FOREIGN KEY ("chain_id") REFERENCES "public"."chains"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
