
import {
    getAllCategories,
    getCategoryDetails,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';

import {
    getProjectsByCategoryId,
    getProjectDetails
} from '../models/projects.js';

import { body, validationResult } from 'express-validator';

// Validation rules for creating and editing categories
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

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

// Display the new category form
const showNewCategoryForm = (req, res) => {
    const title = 'Add New Category';

    res.render('new-category', { title });
};

// Process the new category form
const processNewCategoryForm = async (req, res, next) => {
    try {
        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            return res.redirect('/new-category');
        }

        const { name } = req.body;

        const categoryId = await createCategory(name);

        req.flash('success', 'Category added successfully!');

        res.redirect(`/category/${categoryId}`);

    } catch (error) {
        next(error);
    }
};

// Display the edit category form
const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        const category = await getCategoryDetails(categoryId);

        if (!category) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }

        const title = 'Edit Category';

        res.render('edit-category', {
            title,
            category
        });

    } catch (error) {
        next(error);
    }
};

// Process the edit category form
const processEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            return res.redirect(`/edit-category/${categoryId}`);
        }

        const { name } = req.body;

        await updateCategory(categoryId, name);

        req.flash('success', 'Category updated successfully!');

        res.redirect(`/category/${categoryId}`);

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
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};
