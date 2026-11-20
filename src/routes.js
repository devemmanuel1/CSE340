import express from 'express';

// Import home controller
import { showHomePage } from './controllers/index.js';

// Import organization controllers
import {
    showOrganizationsPage,
    showOrganizationDetailsPage
} from './controllers/organizations.js';

// Import project controllers
import {
    showProjectsPage,
    showProjectDetailsPage
} from './controllers/projects.js';

// Import category controllers
import {
    showCategoriesPage,
    showCategoryDetailsPage
} from './controllers/categories.js';

// Import error controller
import { testErrorPage } from './controllers/errors.js';

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

// Export router
export default router;