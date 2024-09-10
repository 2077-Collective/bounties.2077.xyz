CREATE TABLE IF NOT EXISTS "waitlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"referral_uuid" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	"invite_used" boolean DEFAULT false NOT NULL,
	"invite_sent_at" timestamp,
	"referred_by" integer,
	CONSTRAINT "waitlist_id_unique" UNIQUE("id"),
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
