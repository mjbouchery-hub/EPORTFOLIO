/*
  Warnings:

  - You are about to drop the column `cast` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `director` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "cast",
DROP COLUMN "director",
DROP COLUMN "genre",
DROP COLUMN "rating",
DROP COLUMN "releaseDate",
DROP COLUMN "thumbnailUrl",
ADD COLUMN     "releaseYear" INTEGER,
ALTER COLUMN "duration" DROP NOT NULL,
ALTER COLUMN "maturityRating" DROP NOT NULL;
