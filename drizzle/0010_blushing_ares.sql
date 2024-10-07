CREATE TABLE IF NOT EXISTS "submission_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL,
	"link" text NOT NULL,
	"is_file" boolean NOT NULL,
	CONSTRAINT "submission_links_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "submissions" RENAME COLUMN "description" TO "details";--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "recipient_wallet" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submission_links" ADD CONSTRAINT "submission_links_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "submissions" DROP COLUMN IF EXISTS "link";