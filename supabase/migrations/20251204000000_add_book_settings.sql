-- ============================================
-- Book Settings Migration
-- Adds user-specific settings for vocabulary books
-- ============================================

-- Create book_settings table
CREATE TABLE IF NOT EXISTS "public"."book_settings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "book_id" UUID NOT NULL REFERENCES vocabulary_books(id) ON DELETE CASCADE,
  
  -- Daily limits
  "daily_new_limit" INTEGER NOT NULL DEFAULT 20,
  "daily_review_limit" INTEGER NOT NULL DEFAULT 60,
  
  -- Learning mode
  "require_spelling" BOOLEAN NOT NULL DEFAULT false,
  "study_order" TEXT NOT NULL DEFAULT 'sequential' CHECK (study_order IN ('sequential', 'random')),
  
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Unique constraint: one setting per user per book
  CONSTRAINT "book_settings_user_book_key" UNIQUE ("user_id", "book_id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_book_settings_user_id" ON "public"."book_settings" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_book_settings_book_id" ON "public"."book_settings" ("book_id");

-- Enable RLS
ALTER TABLE "public"."book_settings" ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own book settings" ON "public"."book_settings"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own book settings" ON "public"."book_settings"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own book settings" ON "public"."book_settings"
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own book settings" ON "public"."book_settings"
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION "public"."update_book_settings_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "update_book_settings_updated_at"
BEFORE UPDATE ON "public"."book_settings"
FOR EACH ROW
EXECUTE FUNCTION "public"."update_book_settings_updated_at"();

-- Grant permissions
GRANT ALL ON TABLE "public"."book_settings" TO "anon";
GRANT ALL ON TABLE "public"."book_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."book_settings" TO "service_role";

