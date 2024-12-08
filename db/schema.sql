CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    department TEXT
);

-- Relationship table for parent-child teams
CREATE TABLE IF NOT EXISTS team_relationships (
    parent_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    child_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    PRIMARY KEY (parent_team_id, child_team_id),
    -- Prevent circular references
    CHECK (parent_team_id != child_team_id)
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    title TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Team memberships (junction table with additional attributes)
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    role TEXT,
    UNIQUE(team_id, member_id) -- Prevent duplicate memberships
);
