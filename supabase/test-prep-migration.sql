-- =============================================
-- Test Prep Feature Migration
-- Run this in your Supabase SQL Editor
-- =============================================

-- Add test prep usage tracking to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS test_prep_used_this_month INT NOT NULL DEFAULT 0;

-- =============================================
-- TESTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES children(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  grade TEXT NOT NULL CHECK (grade IN ('K', '1', '2', '3', '4', '5', '6', '7', '8')),
  title TEXT NOT NULL DEFAULT '',
  questions JSONB NOT NULL DEFAULT '[]',
  total_points INT NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'generated' CHECK (status IN ('generated', 'graded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TEST SUBMISSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS test_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_paths TEXT[] NOT NULL DEFAULT '{}',
  feedback JSONB NOT NULL DEFAULT '{}',
  practice_exercises JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tests" ON tests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tests" ON tests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tests" ON tests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tests" ON tests
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own submissions" ON test_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON test_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- STORAGE POLICIES (run after creating bucket)
-- =============================================
CREATE POLICY "Users can upload own test images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'test-submissions'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own test images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'test-submissions'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own test images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'test-submissions'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_tests_user_id ON tests(user_id);
CREATE INDEX IF NOT EXISTS idx_tests_child_id ON tests(child_id);
CREATE INDEX IF NOT EXISTS idx_tests_created_at ON tests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_submissions_test_id ON test_submissions(test_id);
CREATE INDEX IF NOT EXISTS idx_test_submissions_user_id ON test_submissions(user_id);
