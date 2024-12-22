
-- Populate Members
INSERT INTO members (id, email, first_name, last_name, is_active, avatar) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'sarah.smith@company.com', 'Sarah', 'Smith', true, 'https://via.placeholder.com/150'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'john.doe@company.com', 'John', 'Doe', true, 'https://via.placeholder.com/150'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'maria.garcia@company.com', 'Maria', 'Garcia', true, 'https://via.placeholder.com/150'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'alex.wong@company.com', 'Alex', 'Wong', true, 'https://via.placeholder.com/150'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'lisa.johnson@company.com', 'Lisa', 'Johnson', true, 'https://via.placeholder.com/150'),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'james.wilson@company.com', 'James', 'Wilson', false, 'https://via.placeholder.com/150');

-- Populate Teams
INSERT INTO teams (id, name, manager_id) VALUES
    ('00000000-0000-0000-0000-000000000000', 'Root', NULL),
    ('11111111-1111-1111-1111-111111111111', 'Engineering Leadership', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('22222222-2222-2222-2222-222222222222', 'Backend Team', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    ('33333333-3333-3333-3333-333333333333', 'Frontend Team', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
    ('44444444-4444-4444-4444-444444444444', 'Product Management', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
    ('55555555-5555-5555-5555-555555555555', 'UX Design', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
    ('66666666-6666-6666-6666-666666666666', 'HR Operations', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
    ('77777777-7777-7777-7777-777777777777', 'Data Science Team', NULL),
    ('88888888-8888-8888-8888-888888888888', 'Marketing Team', NULL),
    ('99999999-9999-9999-9999-999999999999', 'Sales Team', NULL),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Customer Support', NULL),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'IT Support', NULL);

-- Set up Team Relationships (Engineering Leadership is parent to Backend and Frontend teams)
INSERT INTO team_relationships (parent_team_id, child_team_id) VALUES
    ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'),
    ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444'),
    ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
    ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333'),
    ('44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555'),
    ('22222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777'),
    ('77777777-7777-7777-7777-777777777777', '88888888-8888-8888-8888-888888888888'),
    ('88888888-8888-8888-8888-888888888888', '99999999-9999-9999-9999-999999999999'),
    ('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');


-- Assign Members to Teams with Roles
INSERT INTO team_members (team_id, member_id, title) VALUES
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