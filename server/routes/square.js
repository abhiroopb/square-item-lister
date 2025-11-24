import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCompleteItem, listCatalogItems } from '../services/square.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper function to convert BigInt to regular numbers in objects
function convertBigIntToNumber(obj) {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'bigint') {
    return Number(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertBigIntToNumber(item));
  }
  
  if (typeof obj === 'object') {
    const converted = {};
    for (const key in obj) {
      converted[key] = convertBigIntToNumber(obj[key]);
    }
    return converted;
  }
  
  return obj;
}

/**
 * POST /api/square/create-item
 * Create a catalog item in Square
 */
router.post('/create-item', async (req, res) => {
  try {
    const { title, description, price, imagePath } = req.body;
    const userSquareToken = req.headers['x-square-token'];
    
    if (!title || !price || !imagePath) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, price, imagePath' 
      });
    }

    // Convert relative path to absolute path if needed
    let fullImagePath = imagePath;
    if (!path.isAbsolute(imagePath)) {
      // If it's a relative path like '/uploads/filename.jpg', convert to absolute
      if (imagePath.startsWith('/uploads/')) {
        const filename = path.basename(imagePath);
        fullImagePath = path.join(__dirname, '../uploads', filename);
      } else {
        fullImagePath = path.join(__dirname, '..', imagePath);
      }
    }

    console.log('Image path conversion:', { imagePath, fullImagePath });

    const result = await createCompleteItem(
      { title, description, price },
      fullImagePath,
      userSquareToken
    );

    if (result.success) {
      // Convert BigInt values to numbers before sending response
      const safeResult = convertBigIntToNumber(result);
      
      res.json({
        success: true,
        message: 'Item created successfully in Square',
        itemId: safeResult.itemId,
        imageUrl: safeResult.imageUrl,
        imageUploaded: safeResult.imageUploaded,
        imageUploadError: safeResult.imageUploadError, // Include image upload error if any
        note: safeResult.note,
        item: safeResult.item
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        details: result.details
      });
    }
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ 
      error: 'Failed to create item in Square',
      details: error.message 
    });
  }
});

/**
 * GET /api/square/items
 * List catalog items from Square
 */
router.get('/items', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const result = await listCatalogItems(limit);
    
    res.json(result);
  } catch (error) {
    console.error('List items error:', error);
    res.status(500).json({ 
      error: 'Failed to list items',
      details: error.message 
    });
  }
});

export default router;
