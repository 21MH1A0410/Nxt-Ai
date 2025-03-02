-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "contactInfo" JSONB,
ADD COLUMN     "education" JSONB,
ADD COLUMN     "experience" JSONB,
ADD COLUMN     "projects" JSONB,
ADD COLUMN     "skills" TEXT,
ADD COLUMN     "summary" TEXT;
