import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT
            project.project_id,
            project.name,
            project.description,
            organization.name AS organization_name
        FROM project
        INNER JOIN organization
            ON project.organization_id = organization.organization_id
        ORDER BY project.project_id;
    `;

    const result = await db.query(query);
    return result.rows;
};

export { getAllProjects };