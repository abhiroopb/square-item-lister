import OpenAI from 'openai';
import { config } from '../config/config.js';
import sharp from 'sharp';
import fs from 'fs/promises';

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
 * 1. Remove background using remove.bg API
 * 2. Add white background
 * 3. Apply professional enhancements
 */
export async function enhanceImage(imagePath) {
  try {
    const enhancedPath = imagePath.replace(/(\.\w+)$/, '-enhanced$1');
    
    // Try to remove background using remove.bg API if key is available
    const removeBgKey = process.env.REMOVE_BG_API_KEY || config.removeBg?.apiKey;
    
    if (removeBgKey) {
      try {
        const FormData = (await import('form-data')).default;
        const axios = (await import('axios')).default;
        
        const formData = new FormData();
        formData.append('image_file', await fs.readFile(imagePath), {
          filename: 'image.jpg'
        });
        formData.append('size', 'auto');
        formData.append('bg_color', 'ffffff'); // White background
        
        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
          headers: {
            ...formData.getHeaders(),
            'X-Api-Key': removeBgKey
          },
          responseType: 'arraybuffer'
        });
        
        // Save the background-removed image
        const noBgPath = imagePath.replace(/(\.\w+)$/, '-nobg.png');
        await fs.writeFile(noBgPath, response.data);
        
        // Apply final enhancements
        await sharp(noBgPath)
          .resize(1200, 1200, { 
            fit: 'inside',
            withoutEnlargement: true,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .sharpen()
          .toFile(enhancedPath);
        
        // Clean up temp file
        await fs.unlink(noBgPath).catch(() => {});
        
        return {
          success: true,
          enhancedPath,
          message: 'Image enhanced with background removal'
        };
      } catch (bgError) {
        console.warn('Background removal failed, falling back to basic enhancement:', bgError.message);
        // Fall through to basic enhancement
      }
    }
    
    // Fallback: Basic enhancement without background removal
    await sharp(imagePath)
      .resize(1200, 1200, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .normalize() // Auto-adjust brightness/contrast
      .sharpen() // Enhance sharpness
      .flatten({ background: { r: 255, g: 255, b: 255 } }) // Add white background
      .toFile(enhancedPath);
    
    return {
      success: true,
      enhancedPath,
      message: 'Image enhanced successfully'
    };
  } catch (error) {
    console.error('Error enhancing image:', error);
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
