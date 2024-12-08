INSERT INTO teams (id, name, department) VALUES
    ('00000000-0000-0000-0000-000000000000', 'Root', 'Root');
-- Populate Teams
INSERT INTO teams (id, name, department) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Engineering Leadership', 'Engineering'),
    ('22222222-2222-2222-2222-222222222222', 'Backend Team', 'Engineering'),
    ('33333333-3333-3333-3333-333333333333', 'Frontend Team', 'Engineering'),
    ('44444444-4444-4444-4444-444444444444', 'Product Management', 'Product'),
    ('55555555-5555-5555-5555-555555555555', 'UX Design', 'Product'),
    ('66666666-6666-6666-6666-666666666666', 'HR Operations', 'Human Resources');

-- Set up Team Relationships (Engineering Leadership is parent to Backend and Frontend teams)
INSERT INTO team_relationships (parent_team_id, child_team_id) VALUES
    ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'),
    ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444'),
    ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
    ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333'),
    ('44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555');

-- Populate Members
INSERT INTO members (id, email, first_name, last_name, is_active) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'sarah.smith@company.com', 'Sarah', 'Smith', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'john.doe@company.com', 'John', 'Doe', true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'maria.garcia@company.com', 'Maria', 'Garcia', true),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'alex.wong@company.com', 'Alex', 'Wong', true),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'lisa.johnson@company.com', 'Lisa', 'Johnson', true),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'james.wilson@company.com', 'James', 'Wilson', false);

-- Assign Members to Teams with Roles
INSERT INTO team_members (team_id, member_id, role) VALUES
    -- Engineering Leadership
    ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Engineering Director'),
    
    -- Backend Team
    ('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Team Lead'),
    ('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Senior Engineer'),
    
    -- Frontend Team
    ('33333333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Team Lead'),
    
    -- Product Management
    ('44444444-4444-4444-4444-444444444444', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Product Director'),
    
    -- UX Design
    ('55555555-5555-5555-5555-555555555555', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'UX Designer');