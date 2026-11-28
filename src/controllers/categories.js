
import {
    getAllCategories,
    getCategoryDetails,
    getCategoriesByProjectId,
    updateCategoryAssignments
} from '../models/categories.js';

import {
    getProjectsByCategoryId,
    getProjectDetails
} from '../models/projects.js';

// Display all categories
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';

        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};

// Display category details and associated projects
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        const category = await getCategoryDetails(categoryId);

        if (!category) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }

        const projects = await getProjectsByCategoryId(categoryId);
        const title = category.name;

        res.render('category', {
            title,
            category,
            projects
        });

    } catch (error) {
        next(error);
    }
};

// Display assign categories form
const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        const categories = await getAllCategories();

        const assignedCategories = await getCategoriesByProjectId(projectId);

        const title = 'Assign Categories to Project';

        res.render('assign-categories', {
            title,
            projectId,
            projectDetails,
            categories,
            assignedCategories
        });

    } catch (error) {
        next(error);
    }
};

// Process assign categories form
const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const selectedCategoryIds = req.body.categoryIds || [];

        // Ensure selectedCategoryIds is an array
        const categoryIdsArray = Array.isArray(selectedCategoryIds)
            ? selectedCategoryIds
            : [selectedCategoryIds];

        await updateCategoryAssignments(projectId, categoryIdsArray);

        req.flash('success', 'Categories updated successfully.');

        res.redirect(`/project/${projectId}`);

    } catch (error) {
        next(error);
    }
};

// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};
