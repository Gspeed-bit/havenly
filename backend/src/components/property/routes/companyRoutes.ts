import express from 'express';
// import { authMiddleware } from '@middleware/authMiddleware';
// import { userMiddleware } from '@middleware/userMiddleware';
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController';
import { protect } from '@middleware/protect/protect';

const router = express.Router();
/**
 * @openapi
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the company.
 *         email:
 *           type: string
 *           description: Email address of the company.
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the company.
 *         address:
 *           type: string
 *           description: Address of the company.
 *         logo:
 *           type: string
 *           description: URL of the company logo.
 *         website:
 *           type: string
 *           description: URL of the company's website.
 *         description:
 *           type: string
 *           description: Brief description of the company.
 * 
 *     CompanyResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Company'
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the company.
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message.
 *         error:
 *           type: object
 *           description: Additional error details.
 */

/**
 * @openapi
 * tags:
 *   - name: Companies
 *     description: Endpoints for managing companies
 */

/**
 * @openapi
 * /companies:
 *   post:
 *     summary: Create a new company
 *     description: Creates a new company. Only accessible by admin users.
 *     tags:
 *       - Companies
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Company details to create a new company.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyResponse'
 *       400:
 *         description: Bad request (validation errors)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.post('/companies', protect, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  createCompany(req, res);
});

/**
 * @openapi
 * /companies:
 *   get:
 *     summary: Get all companies
 *     description: Fetches all companies from the database.
 *     tags:
 *       - Companies
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CompanyResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/companies', protect, getAllCompanies);

/**
 * @openapi
 * /companies/{id}:
 *   get:
 *     summary: Get a company by ID
 *     description: Fetches details of a specific company by its ID.
 *     tags:
 *       - Companies
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the company.
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyResponse'
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/companies/:id', protect, getCompanyById);

/**
 * @openapi
 * /companies/{id}:
 *   put:
 *     summary: Update a company by ID
 *     description: Updates details of a specific company by its ID. Only accessible by admin users.
 *     tags:
 *       - Companies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the company.
 *     requestBody:
 *       description: Fields to update in the company.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyResponse'
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.put('/companies/:id', protect, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  updateCompany(req, res);
});

/**
 * @openapi
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company by ID
 *     description: Deletes a specific company by its ID. Only accessible by admin users. Cannot delete if there are associated properties.
 *     tags:
 *       - Companies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the company.
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       400:
 *         description: Cannot delete due to associated properties
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.delete('/companies/:id', protect, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  deleteCompany(req, res);
});


export default router;
