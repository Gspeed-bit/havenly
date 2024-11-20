import express from 'express';
import { authMiddleware } from '@middleware/authMiddleware';
import {
  createProperty,
  deleteProperty,
  getProperties,
  getPropertyById,
  updateProperty,
} from '../controllers/propertyController';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Properties
 *   description: Endpoints for Creating and Managing Property Listings
 */

/**
 * @openapi
 * /properties:
 *   post:
 *     summary: Create a new property listing
 *     description: Creates a new property listing. Only accessible by admins.
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Property details to create a new property.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the property.
 *               description:
 *                 type: string
 *                 description: A detailed description of the property.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 description: List of image URLs for the property.
 *               price:
 *                 type: number
 *                 description: The price of the property.
 *               location:
 *                 type: string
 *                 description: The physical address of the property.
 *               propertyType:
 *                 type: string
 *                 description: The type of the property (e.g., Apartment, House).
 *               rooms:
 *                 type: number
 *                 description: The number of rooms in the property.
 *               company:
 *                 type: string
 *                 description: The company ID that manages the property.
 *               status:
 *                 type: string
 *                 description: The status of the property (e.g., under review, available).
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of amenities available in the property.
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     description: Latitude coordinate of the property.
 *                   lng:
 *                     type: number
 *                     description: Longitude coordinate of the property.
 *               isPublished:
 *                 type: boolean
 *                 description: Whether the property is published or not.
 *               agent:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the property agent.
 *                   contact:
 *                     type: string
 *                     description: The contact information of the agent.
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Bad request (validation errors)
 *       401:
 *         description: Unauthorized access (Admin only)
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /properties:
 *   get:
 *     summary: Get a list of properties
 *     description: Retrieves a paginated list of properties based on various filters.
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number for pagination.
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: The number of properties to return per page.
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: city
 *         required: false
 *         description: Filter properties by city.
 *         schema:
 *           type: string
 *       - in: query
 *         name: propertyType
 *         required: false
 *         description: Filter properties by property type (e.g., House, Apartment).
 *         schema:
 *           type: string
 *       - in: query
 *         name: priceRange
 *         required: false
 *         description: Filter properties by price range (e.g., "100000-500000").
 *         schema:
 *           type: string
 *       - in: query
 *         name: rooms
 *         required: false
 *         description: Filter properties by the number of rooms.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       location:
 *                         type: string
 *                       propertyType:
 *                         type: string
 *                       rooms:
 *                         type: number
 *                       company:
 *                         type: string
 *                       amenities:
 *                         type: array
 *                         items:
 *                           type: string
 *                       isPublished:
 *                         type: boolean
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /properties/{id}:
 *   get:
 *     summary: Get a property by ID
 *     description: Retrieves a single property by its ID.
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the property to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 location:
 *                   type: string
 *                 propertyType:
 *                   type: string
 *                 rooms:
 *                   type: number
 *                 company:
 *                   type: string
 *                 amenities:
 *                   type: array
 *                   items:
 *                     type: string
 *                 isPublished:
 *                   type: boolean
 *       404:
 *         description: Property not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /properties/{id}:
 *   put:
 *     summary: Update a property listing
 *     description: Updates an existing property listing. Only accessible by admins.
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the property to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated property details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               location:
 *                 type: string
 *               propertyType:
 *                 type: string
 *               rooms:
 *                 type: number
 *               company:
 *                 type: string
 *               status:
 *                 type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *               isPublished:
 *                 type: boolean
 *               agent:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   contact:
 *                     type: string
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       400:
 *         description: Bad request (validation errors)
 *       401:
 *         description: Unauthorized access (Admin only)
 *       404:
 *         description: Property not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /properties/{id}:
 *   delete:
 *     summary: Delete a property listing
 *     description: Deletes an existing property listing. Only accessible by admins.
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the property to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized access (Admin only)
 *       404:
 *         description: Property not found
 *       500:
 *         description: Internal server error
 */


router.post('/properties', authMiddleware, createProperty);
router.get('/properties', getProperties);
router.get('/properties/:id', getPropertyById);
router.put('/properties/:id', authMiddleware, updateProperty);
router.delete('/properties/:id', authMiddleware, deleteProperty);

export default router;
