-- ============================================
-- Change require_spelling to learning_mode
-- Migrates from boolean to text enum (read_only | spelling)
-- ============================================

-- Add new learning_mode column
ALTER TABLE "public"."book_settings"
  ADD COLUMN IF NOT EXISTS "learning_mode" TEXT DEFAULT 'read_only' 
  CHECK (learning_mode IN ('read_only', 'spelling'));

-- Migrate existing data: false -> 'read_only', true -> 'spelling'
UPDATE "public"."book_settings"
SET "learning_mode" = CASE 
  WHEN "require_spelling" = true THEN 'spelling'
  ELSE 'read_only'
END;

-- Set NOT NULL constraint
ALTER TABLE "public"."book_settings"
  ALTER COLUMN "learning_mode" SET NOT NULL;

-- Drop old column
ALTER TABLE "public"."book_settings"
  DROP COLUMN IF EXISTS "require_spelling";

