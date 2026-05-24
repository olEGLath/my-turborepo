-- AlterTable
ALTER TABLE "members" ALTER COLUMN "role" SET DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "should_attach_users_by_domain" BOOLEAN NOT NULL DEFAULT false;
