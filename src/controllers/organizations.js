
import {
    getAllOrganizations,
    getOrganizationDetails
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

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

        // Check whether the ID is valid
        if (!/^\d+$/.test(organizationId)) {
            const error = new Error('Organization not found');
            error.status = 404;
            return next(error);
        }

        // Retrieve organization details
        const organizationDetails = await getOrganizationDetails(organizationId);

        // Check whether the organization exists
        if (!organizationDetails) {
            const error = new Error('Organization not found');
            error.status = 404;
            return next(error);
        }

        // Retrieve projects belonging to the organization
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

// Export controller functions
export {
    showOrganizationsPage,
    showOrganizationDetailsPage
};
