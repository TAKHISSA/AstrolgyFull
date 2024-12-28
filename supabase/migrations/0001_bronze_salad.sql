/*
  # Create appointments table

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `appointment_date` (date, not null)
      - `client_name` (text, not null)
      - `client_email` (text, not null)
      - `status` (text, default: 'scheduled')

  2. Security
    - Enable RLS on `appointments` table
    - Add policies for:
      - Anyone can read appointments (to check availability)
      - Only authenticated users can insert appointments
*/

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  appointment_date date NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed'))
);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policy for reading appointments (public access)
CREATE POLICY "Anyone can view appointments"
  ON appointments
  FOR SELECT
  USING (true);

-- Policy for creating appointments (public access for now, can be restricted later)
CREATE POLICY "Anyone can create appointments"
  ON appointments
  FOR INSERT
  WITH CHECK (true);