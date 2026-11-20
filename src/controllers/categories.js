
import {
    getAllCategories,
    getCategoryDetails
} from '../models/categories.js';

import { getProjectsByCategoryId } from '../models/projects.js';

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

        // Get category details
        const category = await getCategoryDetails(categoryId);

        // Check if category exists
        if (!category) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }

        // Get projects associated with the category
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

// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage
};
