/*
  # Fix RLS policies for resources table

  1. Security Changes
    - Update resources table policies to allow public access
    - Maintain RLS enabled but allow public operations
    - This matches the current application authentication model

  2. Changes Made
    - Modified INSERT policy to allow public access
    - Modified UPDATE policy to allow public access  
    - Modified DELETE policy to allow public access
    - SELECT policy already allows public access
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Solo autenticados pueden crear recursos" ON resources;
DROP POLICY IF EXISTS "Solo autenticados pueden actualizar recursos" ON resources;
DROP POLICY IF EXISTS "Solo autenticados pueden eliminar recursos" ON resources;

-- Create new public policies for resources
CREATE POLICY "Public can insert resources"
  ON resources
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update resources"
  ON resources
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete resources"
  ON resources
  FOR DELETE
  TO public
  USING (true);

-- Also fix categories policies to match
DROP POLICY IF EXISTS "Solo autenticados pueden crear categorías" ON categories;
DROP POLICY IF EXISTS "Solo autenticados pueden actualizar categorías" ON categories;
DROP POLICY IF EXISTS "Solo autenticados pueden eliminar categorías" ON categories;

CREATE POLICY "Public can insert categories"
  ON categories
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update categories"
  ON categories
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete categories"
  ON categories
  FOR DELETE
  TO public
  USING (true);