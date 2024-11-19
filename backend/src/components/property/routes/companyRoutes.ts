import express from 'express';
import { authMiddleware } from '@middleware/authMiddleware';
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Companies
 *   description: Endpoints for creating, fetching, updating, and deleting companies
 */

/**
 * @openapi
 * /companies:
 *   post:
 *     summary: Create a new company
 *     description: Creates a new company. Only accessible by authenticated users.
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the company.
 *               email:
 *                 type: string
 *                 description: Email address of the company.
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the company.
 *               address:
 *                 type: string
 *                 description: Address of the company.
 *               logo:
 *                 type: string
 *                 description: URL of the company logo.
 *               website:
 *                 type: string
 *                 description: URL of the company's website.
 *               description:
 *                 type: string
 *                 description: Brief description of the company.
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Bad request (validation errors)
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.post('/companies', authMiddleware, createCompany);

/**
 * @openapi
 * /companies:
 *   get:
 *     summary: Get all companies
 *     description: Fetches all companies in the database.
 *     tags:
 *       - Companies
 *     responses:
 *       200:
 *         description: List of companies
 *       500:
 *         description: Internal server error
 */
router.get('/companies', getAllCompanies);

/**
 * @openapi
 * /companies/{id}:
 *   get:
 *     summary: Get a company by ID
 *     description: Fetches a specific company by its ID.
 *     tags:
 *       - Companies
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the company to fetch
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company details
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */
router.get('/companies/:id', getCompanyById);

/**
 * @openapi
 * /companies/{id}:
 *   put:
 *     summary: Update a company by ID
 *     description: Updates an existing company by its ID.
 *     tags:
 *       - Companies
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the company to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Company details to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               logo:
 *                 type: string
 *               website:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */
router.put('/companies/:id', authMiddleware, updateCompany);

/**
 * @openapi
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company by ID
 *     description: Deletes a specific company by its ID.
 *     tags:
 *       - Companies
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the company to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */
router.delete('/companies/:id', authMiddleware, deleteCompany);

export default router;
