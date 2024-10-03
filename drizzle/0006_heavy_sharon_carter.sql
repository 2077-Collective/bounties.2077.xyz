ALTER TABLE "sponsors" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sponsors" ALTER COLUMN "website" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sponsors" ALTER COLUMN "twitter" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_email_unique" UNIQUE("email");