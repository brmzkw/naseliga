-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- AlterTable
ALTER TABLE "players" ALTER COLUMN "name" type CITEXT;