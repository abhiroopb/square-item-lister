import OpenAI from 'openai';
import { config } from '../config/config.js';
import sharp from 'sharp';
import fs from 'fs/promises';
import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';

// Track remove.bg API usage
let removeBgCallCount = 0;
const REMOVE_BG_LIMIT = 45;

// Helper to get OpenAI client with user's key or default
function getOpenAIClient(userKey) {
  const apiKey = userKey || config.openai.apiKey;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is required. Please configure it in Settings.');
  }
  
  return new OpenAI({
    apiKey,
  });
}

/**
 * Enhance image to studio quality
 * Applies professional image processing to improve appearance while preserving the original product
 */
export async function enhanceImage(imagePath, userOpenAIKey) {
  try {
    const enhancedPath = imagePath.replace(/(\.\w+)$/, '-enhanced.png');
    
    console.log('=== IMAGE ENHANCEMENT START ===');
    console.log('Input path:', imagePath);
    console.log('Output path:', enhancedPath);
    console.log('Remove.bg API calls used:', removeBgCallCount, '/', REMOVE_BG_LIMIT);
    
    // Check if input file exists
    try {
      await fs.access(imagePath);
      console.log('✓ Input file exists');
    } catch (err) {
      console.error('✗ Input file does NOT exist');
      throw new Error(`Input file not found: ${imagePath}`);
    }
    
    // Check if we've hit the limit
    if (removeBgCallCount >= REMOVE_BG_LIMIT) {
      console.log('⚠️ Remove.bg API limit reached. Returning original image.');
      // Just copy the original file
      await fs.copyFile(imagePath, enhancedPath);
      
      const filename = enhancedPath.split('/').pop();
      return {
        success: true,
        enhancedPath: `/uploads/${filename}`,
        absolutePath: enhancedPath,
        message: 'API limit reached - using original image'
      };
    }
    
    // Try remove.bg API
    const removeBgApiKey = process.env.REMOVE_BG_API_KEY || 'tFSLZ66rEQGGSucN8cu4xZYr';
    
    if (removeBgApiKey) {
      try {
        console.log('Using remove.bg API for background removal...');
        
        const formData = new FormData();
        formData.append('image_file', createReadStream(imagePath));
        formData.append('size', 'auto');
        formData.append('bg_color', 'ffffff'); // White background
        
        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
          headers: {
            'X-Api-Key': removeBgApiKey,
            ...formData.getHeaders()
          },
          responseType: 'arraybuffer'
        });
        
        // Save the result
        await fs.writeFile(enhancedPath, response.data);
        
        // Increment counter
        removeBgCallCount++;
        console.log('✓ Background removed successfully');
        console.log('Remove.bg API calls used:', removeBgCallCount, '/', REMOVE_BG_LIMIT);
        
        const filename = enhancedPath.split('/').pop();
        return {
          success: true,
          enhancedPath: `/uploads/${filename}`,
          absolutePath: enhancedPath,
          message: 'Background removed with remove.bg'
        };
      } catch (error) {
        console.error('Remove.bg API error:', error.message);
        console.log('Falling back to original image...');
        
        // Fall back to original
        await fs.copyFile(imagePath, enhancedPath);
        
        const filename = enhancedPath.split('/').pop();
        return {
          success: true,
          enhancedPath: `/uploads/${filename}`,
          absolutePath: enhancedPath,
          message: 'Using original image (remove.bg failed)'
        };
      }
    } else {
      console.log('No remove.bg API key - using original image');
      await fs.copyFile(imagePath, enhancedPath);
      
      const filename = enhancedPath.split('/').pop();
      return {
        success: true,
        enhancedPath: `/uploads/${filename}`,
        absolutePath: enhancedPath,
        message: 'Using original image'
      };
    }
  } catch (error) {
    console.error('=== IMAGE ENHANCEMENT ERROR ===');
    console.error('Error:', error.message);
    console.error('=== END ERROR ===');
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Remove background from image (simplified version)
 * For production, you'd use a service like remove.bg or Replicate
 */
export async function removeBackground(imagePath) {
  try {
    // For now, we'll just return the enhanced image
    // In production, integrate with remove.bg API or similar
    const result = await enhanceImage(imagePath);
    return result;
  } catch (error) {
    console.error('Error removing background:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate item title from image using GPT-4 Vision
 */
export async function generateTitle(imagePath, userOpenAIKey) {
  try {
    const openai = getOpenAIClient(userOpenAIKey);
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this product image and generate a short, catchy product title (max 50 characters). Just return the title, nothing else.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 100
    });

    const title = response.choices[0].message.content.trim();
    
    return {
      success: true,
      title
    };
  } catch (error) {
    console.error('Error generating title:', error);
    return {
      success: false,
      error: error.message,
      title: 'Untitled Item'
    };
  }
}

/**
 * Generate item description from image using GPT-4 Vision
 */
export async function generateDescription(imagePath, webSearchResults = null, userOpenAIKey) {
  try {
    const openai = getOpenAIClient(userOpenAIKey);
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    let prompt = `Analyze this product image and create a detailed, professional product description (2-3 sentences). 
Focus on key features, materials, and benefits.`;

    if (webSearchResults) {
      prompt += `\n\nAdditional context from web search:\n${webSearchResults}`;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    const description = response.choices[0].message.content.trim();
    
    return {
      success: true,
      description
    };
  } catch (error) {
    console.error('Error generating description:', error);
    return {
      success: false,
      error: error.message,
      description: 'No description available'
    };
  }
}

/**
 * Suggest a price based on the item (optional feature)
 */
export async function suggestPrice(imagePath, title, userOpenAIKey) {
  try {
    const openai = getOpenAIClient(userOpenAIKey);
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Based on this product image (${title}), suggest a reasonable retail price in USD. Just return a number (e.g., 29.99), nothing else.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 50
    });

    const priceText = response.choices[0].message.content.trim();
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    return {
      success: true,
      price: isNaN(price) ? 0 : price
    };
  } catch (error) {
    console.error('Error suggesting price:', error);
    return {
      success: false,
      error: error.message,
      price: 0
    };
  }
}
