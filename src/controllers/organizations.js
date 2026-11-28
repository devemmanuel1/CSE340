
import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

import { body, validationResult } from 'express-validator';

// Validation and sanitization rules
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .bail()
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .bail()
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),

    body('contactEmail')
        .trim()
        .notEmpty()
        .withMessage('Contact email is required')
        .bail()
        .normalizeEmail()
        .isEmail()
        .withMessage('Please provide a valid email address')
];

// Display all organizations
const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Organizations';

        res.render('organizations', { title, organizations });
    } catch (error) {
        next(error);
    }
};

// Display organization details
const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organizationId = req.params.id;

        if (!/^\d+$/.test(organizationId)) {
            const error = new Error('Organization not found');
            error.status = 404;
            return next(error);
        }

        const organizationDetails = await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            const error = new Error('Organization not found');
            error.status = 404;
            return next(error);
        }

        const projects = await getProjectsByOrganizationId(organizationId);

        const title = 'Organization Details';

        res.render('organization', {
            title,
            organizationDetails,
            projects
        });
    } catch (error) {
        next(error);
    }
};

// Display new organization form
const showNewOrganizationForm = (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
};

// Process new organization form
const processNewOrganizationForm = async (req, res, next) => {
    try {
        const results = validationResult(req);

        // Check for validation errors
        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            return res.redirect('/new-organization');
        }

        const { name, description, contactEmail } = req.body;

        const logoFilename = 'placeholder-logo.png';

        const organizationId = await createOrganization(
            name,
            description,
            contactEmail,
            logoFilename
        );

        req.flash('success', 'Organization added successfully!');

        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        next(error);
    }
};

const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);

    const title = 'Edit Organization';
    res.render('edit-organization', { title, organizationDetails });
};


const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;

    // Check for validation errors
    const results = validationResult(req);

    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit organization form
        return res.redirect('/edit-organization/' + req.params.id);
    }

    const { name, description, contactEmail, logoFilename } = req.body;

    await updateOrganization(
        organizationId,
        name,
        description,
        contactEmail,
        logoFilename
    );

    // Set a success flash message
    req.flash('success', 'Organization updated successfully!');

    res.redirect(`/organization/${organizationId}`);
};


// Export controller functions
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
};
