/*
  # Typing Learning Website Schema

  ## Overview
  Creates the database structure for a typing learning platform with lessons and progress tracking.

  ## New Tables
  
  ### `lessons`
  Stores typing lessons with different difficulty levels
  - `id` (uuid, primary key) - Unique lesson identifier
  - `title` (text) - Lesson title
  - `content` (text) - The text to type
  - `difficulty` (text) - Difficulty level: 'beginner', 'intermediate', 'advanced'
  - `category` (text) - Category like 'quotes', 'programming', 'stories'
  - `created_at` (timestamptz) - When lesson was created
  
  ### `typing_sessions`
  Records each typing practice session with performance metrics
  - `id` (uuid, primary key) - Unique session identifier
  - `user_id` (uuid) - References auth.users
  - `lesson_id` (uuid) - References lessons table
  - `wpm` (integer) - Words per minute achieved
  - `accuracy` (numeric) - Accuracy percentage (0-100)
  - `time_taken` (integer) - Time in seconds
  - `completed` (boolean) - Whether the session was completed
  - `created_at` (timestamptz) - When session occurred

  ## Security
  - Enable RLS on all tables
  - Users can read all lessons
  - Users can only view and create their own typing sessions
  
  ## Sample Data
  - Includes beginner, intermediate, and advanced lessons
*/

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  difficulty text NOT NULL DEFAULT 'beginner',
  category text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

-- Create typing sessions table
CREATE TABLE IF NOT EXISTS typing_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  wpm integer NOT NULL DEFAULT 0,
  accuracy numeric(5,2) NOT NULL DEFAULT 0,
  time_taken integer NOT NULL DEFAULT 0,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_sessions ENABLE ROW LEVEL SECURITY;

-- Lessons policies (public read access)
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  USING (true);

-- Typing sessions policies
CREATE POLICY "Users can view own sessions"
  ON typing_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON typing_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON typing_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample lessons
INSERT INTO lessons (title, content, difficulty, category) VALUES
  ('Basic Keys - Home Row', 'the quick brown fox jumps over the lazy dog', 'beginner', 'basics'),
  ('Common Words Practice', 'and the of to a in is it you that he was for on are with as his they be at one have this from or had by but some what there we can out other were all your when up use how said an each she which do their time if will way about many then them would write like so these her long make thing see him two has look more day could go come did my sound no most number who oil its now find', 'beginner', 'words'),
  ('Inspirational Quote', 'The only way to do great work is to love what you do. If you have not found it yet, keep looking. Do not settle.', 'intermediate', 'quotes'),
  ('Programming Practice', 'function calculateSum(a, b) { return a + b; } const result = calculateSum(10, 20); console.log(result);', 'intermediate', 'programming'),
  ('Advanced Punctuation', 'Hello, world! This is a test; it includes various punctuation marks: commas, semicolons, colons, and more. "Can you type this accurately?" she asked. The answer was yes—definitely, yes!', 'advanced', 'punctuation'),
  ('Code Snippet Challenge', 'import React, { useState, useEffect } from "react"; export default function App() { const [count, setCount] = useState(0); useEffect(() => { document.title = `Count: ${count}`; }, [count]); return <button onClick={() => setCount(count + 1)}>Click me</button>; }', 'advanced', 'programming');