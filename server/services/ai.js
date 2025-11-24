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
 * Enhance image to studio quality using OpenAI DALL-E 3
 * Uses image editing to create a professional product photo
 */
export async function enhanceImage(imagePath, userOpenAIKey) {
  try {
    const openai = getOpenAIClient(userOpenAIKey);
    const enhancedPath = imagePath.replace(/(\.\w+)$/, '-enhanced.png');
    
    // Read the original image
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
    
    console.log('Using OpenAI to enhance image...');
    
    try {
      // Use GPT-4 Vision to generate an enhanced prompt describing the product
      const visionResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe ONLY the physical product in this image with extreme detail - exact colors, materials, text, labels, brand names, shape, size. Describe it exactly as it appears. Do not mention hands, background, or anything else. Be very specific about what makes this product unique. Max 150 words.'
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
        max_tokens: 250
      });
      
      const productDescription = visionResponse.choices[0].message.content.trim();
      console.log('Product description:', productDescription);
      
      // Generate a studio-quality product photo using DALL-E 3
      const dalleResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `Professional product photography of exactly this product: ${productDescription}. The product must look IDENTICAL to the description - same colors, same labels, same text, same everything. Pure white background, professional studio lighting with soft shadows, centered composition, high-resolution commercial photography. The product should be the ONLY thing visible - no hands, no people, no other objects.`,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'natural'
      });
      
      const imageUrl = dalleResponse.data[0].url;
      console.log('Generated enhanced image URL:', imageUrl);
      
      // Download the enhanced image
      const axios = (await import('axios')).default;
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      
      // Save and resize to consistent dimensions
      await sharp(Buffer.from(response.data))
        .resize(1200, 1200, { 
          fit: 'inside',
          withoutEnlargement: true,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFile(enhancedPath);
      
      return {
        success: true,
        enhancedPath,
        message: 'Image enhanced with OpenAI DALL-E 3'
      };
      
    } catch (openaiError) {
      console.warn('OpenAI enhancement failed, using fallback:', openaiError.message);
      
      // Fallback: Basic enhancement with Sharp
      await sharp(imagePath)
        .resize(1200, 1200, { 
          fit: 'inside',
          withoutEnlargement: true,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .extend({
          top: 50,
          bottom: 50,
          left: 50,
          right: 50,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .modulate({
          brightness: 1.1,
          saturation: 1.2
        })
        .normalize()
        .sharpen({ sigma: 1.5 })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .toFile(enhancedPath);
      
      return {
        success: true,
        enhancedPath,
        message: 'Image enhanced with basic processing'
      };
    }
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
