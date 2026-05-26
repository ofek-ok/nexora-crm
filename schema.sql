-- PostgreSQL Database Schema for Nexora CRM
-- Designed for Supabase / standard PostgreSQL instances

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS Table (Linked with Supabase Auth or custom auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. PIPELINE STATUSES Table
CREATE TABLE pipeline_statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(100) NOT NULL,
    name_he VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#2563EB', -- Hex color
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. LEADS Table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    industry VARCHAR(100),
    lead_source VARCHAR(100),
    deal_value NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    assigned_owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    status_id UUID REFERENCES pipeline_statuses(id) ON DELETE RESTRICT,
    tags TEXT[] DEFAULT '{}'::TEXT[],
    last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. CUSTOMERS Table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    industry VARCHAR(100),
    deal_value NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. TASKS Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT check_target CHECK (
        (lead_id IS NOT NULL AND customer_id IS NULL) OR 
        (lead_id IS NULL AND customer_id IS NOT NULL) OR 
        (lead_id IS NULL AND customer_id IS NULL)
    )
);

-- 6. NOTES Table
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT check_note_target CHECK (
        (lead_id IS NOT NULL AND customer_id IS NULL) OR 
        (lead_id IS NULL AND customer_id IS NOT NULL)
    )
);

-- 7. ATTACHMENTS Table
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size VARCHAR(50) NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT check_attachment_target CHECK (
        (lead_id IS NOT NULL AND customer_id IS NULL) OR 
        (lead_id IS NULL AND customer_id IS NOT NULL)
    )
);

-- 8. ACTIVITIES Table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('note', 'call', 'meeting', 'email', 'status_change', 'file_upload', 'convert')),
    content_en TEXT NOT NULL,
    content_he TEXT NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create Indexes for performance
CREATE INDEX idx_leads_status ON leads(status_id);
CREATE INDEX idx_leads_owner ON leads(assigned_owner_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_activities_lead ON activities(lead_id);
CREATE INDEX idx_activities_customer ON activities(customer_id);

-- Default statuses data insertion
INSERT INTO pipeline_statuses (id, name_en, name_he, color, order_index) VALUES
('8b3e8e21-0a67-4d92-9df7-2856c805175a', 'New Lead', 'ליד חדש', '#2563EB', 0),
('3f6c8d76-bc3e-4b4e-868c-02cf97b9195b', 'Contacted', 'נוצר קשר', '#8B5CF6', 1),
('2d8b4e72-a1f9-4bce-be1c-dc3a9f02905f', 'Negotiation', 'משא ומתן', '#F59E0B', 2),
('6e2b4f91-5a2a-4dfb-9db7-29cb1ea519c2', 'Proposal Sent', 'הצעה נשלחה', '#06B6D4', 3),
('9d7b4c81-8b7a-4db3-9dc7-28cb1eb619d2', 'Closed Won', 'עסקה נסגרה בהצלחה', '#10B981', 4),
('1f7b4c82-9c7b-4db4-9dc8-29cb1ec719d3', 'Closed Lost', 'עסקה אבודה', '#EF4444', 5);
