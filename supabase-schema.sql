-- BuildWise Database Schema for Supabase

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE quality_level AS ENUM ('basic', 'standard', 'premium');

-- Projects table
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    floors INTEGER NOT NULL DEFAULT 1,
    quality quality_level NOT NULL DEFAULT 'standard',
    project_data JSONB,
    materials_total DECIMAL(15,2) DEFAULT 0,
    labor_total DECIMAL(15,2) DEFAULT 0,
    total_cost DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Project templates table
CREATE TABLE project_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    floors INTEGER NOT NULL DEFAULT 1,
    bedrooms INTEGER NOT NULL DEFAULT 1,
    bathrooms INTEGER NOT NULL DEFAULT 1,
    kitchens INTEGER NOT NULL DEFAULT 1,
    halls INTEGER NOT NULL DEFAULT 1,
    quality quality_level NOT NULL DEFAULT 'standard',
    estimated_cost DECIMAL(15,2),
    template_data JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Material rates table
CREATE TABLE material_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    location TEXT NOT NULL,
    material_type TEXT NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    source TEXT
);

-- Labor rates table
CREATE TABLE labor_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    location TEXT NOT NULL,
    labor_type TEXT NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    source TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_location ON projects(location);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_material_rates_location ON material_rates(location);
CREATE INDEX idx_labor_rates_location ON labor_rates(location);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE labor_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view their own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for project_templates (public read, admin write)
CREATE POLICY "Anyone can view active templates" ON project_templates
    FOR SELECT USING (is_active = true);

-- RLS Policies for rates (public read for now, can be restricted later)
CREATE POLICY "Anyone can view material rates" ON material_rates
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view labor rates" ON labor_rates
    FOR SELECT USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample project templates
INSERT INTO project_templates (name, description, category, area, floors, bedrooms, bathrooms, kitchens, halls, quality, estimated_cost, template_data) VALUES
('1BHK Standard', 'Compact 1 bedroom apartment', '1BHK', 300, 1, 1, 1, 1, 1, 'standard', 1200000, '{"rooms": {"bedroom": 1, "bathroom": 1, "kitchen": 1, "hall": 1}}'),
('2BHK Standard', 'Comfortable 2 bedroom apartment', '2BHK', 450, 1, 2, 2, 1, 1, 'standard', 1800000, '{"rooms": {"bedroom": 2, "bathroom": 2, "kitchen": 1, "hall": 1}}'),
('3BHK Standard', 'Spacious 3 bedroom apartment', '3BHK', 700, 1, 3, 2, 1, 1, 'standard', 2500000, '{"rooms": {"bedroom": 3, "bathroom": 2, "kitchen": 1, "hall": 1}}'),
('2BHK Premium', 'Luxury 2 bedroom with premium finishes', '2BHK', 800, 1, 2, 2, 1, 1, 'premium', 2800000, '{"rooms": {"bedroom": 2, "bathroom": 2, "kitchen": 1, "hall": 1}}'),
('Duplex Villa', 'Modern duplex villa design', 'Villa', 950, 2, 3, 3, 1, 2, 'standard', 3500000, '{"rooms": {"bedroom": 3, "bathroom": 3, "kitchen": 1, "hall": 2}}'),
('Studio Apartment', 'Minimalist studio space', 'Studio', 400, 1, 0, 1, 1, 1, 'basic', 800000, '{"rooms": {"bedroom": 0, "bathroom": 1, "kitchen": 1, "hall": 1}}');

-- Insert sample material rates (Delhi/NCR)
INSERT INTO material_rates (location, material_type, rate, unit, source) VALUES
('Delhi', 'cement', 800, '₹/bag', 'Local market'),
('Delhi', 'steel', 100, '₹/kg', 'Local market'),
('Delhi', 'sand', 100, '₹/cft', 'Local market'),
('Delhi', 'bricks', 21, '₹/brick', 'Local market'),
('Delhi', 'aggregate', 70, '₹/cft', 'Local market');

-- Insert sample labor rates (Delhi/NCR)
INSERT INTO labor_rates (location, labor_type, daily_rate, source) VALUES
