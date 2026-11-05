-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Insert Service Project Categories
-- ========================================
INSERT INTO category (name)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness');


-- ========================================
-- Project Table
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    organization_id INTEGER NOT NULL,
    FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);

-- ========================================
-- Insert Sample Service Projects
-- ========================================
INSERT INTO project (name, description, organization_id)
SELECT
    project_data.name,
    project_data.description,
    organization.organization_id
FROM (
    VALUES
        (
            'Community Clean-Up and Tree Planting',
            'Organizing neighborhood clean-ups and planting trees to improve the environment.',
            'BrightFuture Builders'
        ),
        (
            'After-School Tutoring Program',
            'Providing educational support and tutoring opportunities for children in local communities.',
            'GreenHarvest Growers'
        ),
        (
            'Community Health and Wellness Outreach',
            'Organizing health awareness campaigns and wellness activities for community members.',
            'UnityServe Volunteers'
        )
) AS project_data(name, description, organization_name)
JOIN organization
    ON organization.name = project_data.organization_name;


-- ========================================
-- Project Category Relationship Table
-- ========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES project(project_id),

    FOREIGN KEY (category_id)
        REFERENCES category(category_id)
);


-- ========================================
-- Associate Projects with Categories
-- ========================================
INSERT INTO project_category (project_id, category_id)
SELECT
    project.project_id,
    category.category_id
FROM (
    VALUES
        ('Community Clean-Up and Tree Planting', 'Environmental'),
        ('Community Clean-Up and Tree Planting', 'Community Service'),

        ('After-School Tutoring Program', 'Educational'),
        ('After-School Tutoring Program', 'Community Service'),

        ('Community Health and Wellness Outreach', 'Health and Wellness'),
        ('Community Health and Wellness Outreach', 'Community Service')
) AS project_categories(project_name, category_name)
JOIN project
    ON project.name = project_categories.project_name
JOIN category
    ON category.name = project_categories.category_name;