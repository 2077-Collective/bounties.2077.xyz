ALTER TABLE "sponsors" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sponsors" ALTER COLUMN "website" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sponsors" ALTER COLUMN "twitter" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "bio" DROP NOT NULL;