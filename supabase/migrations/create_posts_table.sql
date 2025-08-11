/*
  # Create posts table for social platform

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `content` (text, post content)
      - `user_id` (uuid, foreign key to auth.users)
      - `user_nickname` (text, cached nickname)
      - `user_username` (text, cached username)
      - `likes` (integer, like count)
      - `comments` (integer, comment count)
      - `shares` (integer, share count)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `posts` table
    - Add policy for authenticated users to create posts
    - Add policy for all users to read posts
    - Add policy for users to update their own posts
    - Add policy for users to delete their own posts
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_nickname text NOT NULL,
  user_username text NOT NULL,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  shares integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to create posts
CREATE POLICY "Authenticated users can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for all users to read posts
CREATE POLICY "Anyone can read posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for users to update their own posts
CREATE POLICY "Users can update own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own posts
CREATE POLICY "Users can delete own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
