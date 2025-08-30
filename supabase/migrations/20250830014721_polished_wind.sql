/*
  # Crear esquema para plataforma de recursos

  1. Nuevas Tablas
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, nombre de la categoría)
      - `color` (text, color hexadecimal)
      - `description` (text, descripción opcional)
      - `icon` (text, icono)
      - `resource_type` (text, tipo de recurso)
      - `created_at` (timestamp)
    
    - `resources`
      - `id` (uuid, primary key)
      - `title` (text, título del recurso)
      - `type` (text, tipo: link, file, document)
      - `url` (text, URL opcional)
      - `description` (text, descripción)
      - `category_id` (uuid, referencia a categoría)
      - `tags` (text[], array de etiquetas)
      - `file_name` (text, nombre del archivo opcional)
      - `file_size` (bigint, tamaño del archivo opcional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en ambas tablas
    - Permitir lectura pública para todos
    - Permitir escritura solo para usuarios autenticados
*/

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL DEFAULT '#3B82F6',
  description text DEFAULT '',
  icon text DEFAULT 'folder',
  resource_type text NOT NULL DEFAULT 'documents',
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de recursos
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('link', 'file', 'document')),
  url text,
  description text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  tags text[] DEFAULT '{}',
  file_name text,
  file_size bigint,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Políticas para categorías (lectura pública)
CREATE POLICY "Todos pueden leer categorías"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Solo autenticados pueden crear categorías"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Solo autenticados pueden actualizar categorías"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Solo autenticados pueden eliminar categorías"
  ON categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para recursos (lectura pública)
CREATE POLICY "Todos pueden leer recursos"
  ON resources
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Solo autenticados pueden crear recursos"
  ON resources
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Solo autenticados pueden actualizar recursos"
  ON resources
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Solo autenticados pueden eliminar recursos"
  ON resources
  FOR DELETE
  TO authenticated
  USING (true);

-- Insertar categorías por defecto
INSERT INTO categories (name, color, description, icon, resource_type) VALUES
  ('Documentos Importantes', '#3B82F6', 'Documentos oficiales y certificaciones', 'folder', 'documents'),
  ('Enlaces Útiles', '#10B981', 'Enlaces web de interés', 'folder', 'links'),
  ('Recursos Multimedia', '#F59E0B', 'Imágenes, videos y audio', 'folder', 'media')
ON CONFLICT DO NOTHING;