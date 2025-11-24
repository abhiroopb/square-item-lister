import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  enhanceImage, 
  generateTitle, 
  generateDescription,
  suggestPrice 
} from '../services/ai.js';
import { searchProductInfo } from '../services/search.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'item-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

/**
 * POST /api/upload
 * Upload and process image
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Return relative path for frontend, keep absolute path for backend
    const relativePath = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imagePath: relativePath,  // Relative path for frontend
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message 
    });
  }
});

/**
 * POST /api/upload/enhance
 * Enhance uploaded image
 */
router.post('/enhance', async (req, res) => {
  try {
    const { imagePath } = req.body;
    const userOpenAIKey = req.headers['x-openai-key'];
    
    if (!imagePath) {
      return res.status(400).json({ error: 'Image path required' });
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

    console.log('Enhancing image:', { imagePath, fullImagePath });

    const result = await enhanceImage(fullImagePath, userOpenAIKey);
    
    res.json(result);
  } catch (error) {
    console.error('Enhancement error:', error);
    res.status(500).json({ 
      error: 'Failed to enhance image',
      details: error.message 
    });
  }
});

/**
 * POST /api/upload/analyze
 * Analyze image and generate title, description, price
 */
router.post('/analyze', async (req, res) => {
  try {
    const { imagePath } = req.body;
    const userOpenAIKey = req.headers['x-openai-key'];
    
    if (!imagePath) {
      return res.status(400).json({ error: 'Image path required' });
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

    console.log('Analyzing image:', { imagePath, fullImagePath });

    // Run AI analysis in parallel
    const [titleResult, descResult, priceResult] = await Promise.all([
      generateTitle(fullImagePath, userOpenAIKey),
      generateDescription(fullImagePath, null, userOpenAIKey),
      suggestPrice(fullImagePath, 'Item', userOpenAIKey)
    ]);

    // If we have a title, search for more info
    let searchResults = null;
    if (titleResult.success && titleResult.title) {
      const searchResult = await searchProductInfo(titleResult.title);
      if (searchResult.success) {
        searchResults = searchResult.results;
        
        // Regenerate description with search results
        const enhancedDesc = await generateDescription(fullImagePath, searchResults, userOpenAIKey);
        if (enhancedDesc.success) {
          descResult.description = enhancedDesc.description;
        }
      }
    }

    res.json({
      success: true,
      title: titleResult.title || 'Untitled Item',
      description: descResult.description || 'No description available',
      suggestedPrice: priceResult.price || 0,
      searchResults
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze image',
      details: error.message 
    });
  }
});

export default router;
