import { body, validationResult } from 'express-validator';

import {
    getAllProjects,
    getProjectDetails,
    createProject
} from '../models/projects.js';

import { getCategoriesByProjectId } from '../models/categories.js';

import { getAllOrganizations } from '../models/organizations.js';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// Display all service projects
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getAllProjects();

        const title = 'All Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        next(error);
    }
};

// Display service project details
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        const project = await getProjectDetails(projectId);

        if (!project) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        const categories = await getCategoriesByProjectId(projectId);

        const title = project.title;

        res.render('project', {
            title,
            project,
            categories
        });
    } catch (error) {
        next(error);
    }
};

// Display the new project form
const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        const title = 'Add New Service Project';

        res.render('new-project', {
            title,
            organizations
        });
    } catch (error) {
        next(error);
    }
};

// Process the new project form

const processNewProjectForm = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Loop through validation errors and flash them
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            // Redirect back to the new project form
            return res.redirect('/new-project');
        }

        // Extract form data from req.body
        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;

        // Create the new project in the database
        const newProjectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash(
            'success',
            'New service project created successfully!'
        );

        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);

        req.flash(
            'error',
            'There was an error creating the service project.'
        );

        res.redirect('/new-project');
    }
};


// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
};
