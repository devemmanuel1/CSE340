
import express from 'express';

// Import home controller
import { showHomePage } from './controllers/index.js';

// Import organization controllers
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';

// Import project controllers
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
} from './controllers/projects.js';

// Import category controllers
import {
    showCategoriesPage,
    showCategoryDetailsPage
} from './controllers/categories.js';

// Import error controller
import { testErrorPage } from './controllers/errors.js';

import { showAssignCategoriesForm, processAssignCategoriesForm } from './controllers/categories.js';

// Create router
const router = express.Router();

// Home page
router.get('/', showHomePage);

// Organization routes
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Project routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Category routes
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Error-handling test route
router.get('/test-error', testErrorPage);

// New organization form
router.get('/new-organization', showNewOrganizationForm);

// Process new organization form
router.post(
    '/new-organization',
    organizationValidation,
    processNewOrganizationForm
);

// Edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Process edit organization form
router.post(
    '/edit-organization/:id',
    organizationValidation,
    processEditOrganizationForm
);

// New project form
router.get('/new-project', showNewProjectForm);

// Process new project form
router.post('/new-project', projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

export default router;