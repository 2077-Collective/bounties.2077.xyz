CREATE TABLE IF NOT EXISTS "user_bookmarks" (
	"user_id" integer NOT NULL,
	"bounty_id" integer NOT NULL,
	CONSTRAINT "user_bookmarks_user_id_bounty_id_pk" PRIMARY KEY("user_id","bounty_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_bookmarks" ADD CONSTRAINT "user_bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_bookmarks" ADD CONSTRAINT "user_bookmarks_bounty_id_bounties_id_fk" FOREIGN KEY ("bounty_id") REFERENCES "public"."bounties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
