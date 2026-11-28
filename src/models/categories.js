
import db from './db.js';

// Get all categories
const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM category
        ORDER BY category_id;
    `;

    const result = await db.query(query);
    return result.rows;
};

// Get category details by ID
const getCategoryDetails = async (id) => {
    const query = `
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows.length > 0 ? result.rows[0] : null;
};

// Create a new category
const createCategory = async (name) => {
    const query = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [name]);
    return result.rows[0].category_id;
};

// Update an existing category
const updateCategory = async (id, name) => {
    const query = `
        UPDATE category
        SET name = $1
        WHERE category_id = $2;
    `;

    await db.query(query, [name, id]);
};

// Get all categories associated with a project
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            category.category_id,
            category.name
        FROM category
        INNER JOIN project_category
            ON category.category_id = project_category.category_id
        WHERE project_category.project_id = $1
        ORDER BY category.category_id;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
};

// Assign a category to a project
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

// Update category assignments for a project
const updateCategoryAssignments = async (projectId, categoryIds) => {
    const client = await db.connect();

    try {
        // Start database transaction
        await client.query('BEGIN');

        // Remove existing category assignments
        const deleteQuery = `
            DELETE FROM project_category
            WHERE project_id = $1;
        `;

        await client.query(deleteQuery, [projectId]);

        // Add the newly selected categories
        for (const categoryId of categoryIds) {
            const insertQuery = `
                INSERT INTO project_category (category_id, project_id)
                VALUES ($1, $2);
            `;

            await client.query(insertQuery, [categoryId, projectId]);
        }

        // Save all changes
        await client.query('COMMIT');

    } catch (error) {
        // Undo changes if something goes wrong
        await client.query('ROLLBACK');
        throw error;

    } finally {
        // Release database connection
        client.release();
    }
};

// Export model functions
export {
    getAllCategories,
    getCategoryDetails,
    createCategory,
    updateCategory,
    getCategoriesByProjectId,
    updateCategoryAssignments
};
