/*
  # Fix Security Issues

  1. Performance Optimization
    - Add indexes on foreign key columns for faster queries
    - Optimize RLS policies to use subquery syntax for better performance

  2. Database Indexes
    - Add index on typing_sessions(user_id) for user session lookups
    - Add index on typing_sessions(lesson_id) for lesson session lookups

  3. RLS Policy Optimization
    - Replace auth.uid() with (select auth.uid()) in all policies
    - This prevents re-evaluation per row and improves performance at scale

  ## Notes
    - Foreign key indexes are critical for performance with RLS policies
    - Using subquery syntax for auth functions is Supabase best practice
    - These changes have no impact on security, only improve performance
*/

-- Add indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_typing_sessions_user_id ON public.typing_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_sessions_lesson_id ON public.typing_sessions(lesson_id);

-- Drop existing policies that need updating
DROP POLICY IF EXISTS "Users can view own sessions" ON public.typing_sessions;
DROP POLICY IF EXISTS "Users can create own sessions" ON public.typing_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.typing_sessions;

-- Recreate policies with optimized auth function calls
CREATE POLICY "Users can view own sessions"
  ON public.typing_sessions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own sessions"
  ON public.typing_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own sessions"
  ON public.typing_sessions FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));
