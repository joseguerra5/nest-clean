/*
  Warnings:

  - Made the column `created` on table `notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "created" SET NOT NULL;
