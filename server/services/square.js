import { Client, Environment } from 'square';
import { config } from '../config/config.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

// Initialize Square client
const client = new Client({
  accessToken: config.square.accessToken,
  environment: config.square.environment === 'production' 
    ? Environment.Production 
    : Environment.Sandbox,
});

/**
 * Create a catalog item in Square
 */
export async function createCatalogItem(itemData) {
  try {
    const { title, description, price, imageId } = itemData;
    
    // Convert price to cents (integer)
    const priceInCents = Math.round(parseFloat(price) * 100);
    
    console.log('Creating item:', { title, description, price, priceInCents });
    
    // Create the catalog object
    const catalogObject = {
      type: 'ITEM',
      id: `#${uuidv4()}`,
      itemData: {
        name: title,
        description: description,
        variations: [
          {
            type: 'ITEM_VARIATION',
            id: `#${uuidv4()}`,
            itemVariationData: {
              name: 'Regular',
              pricingType: 'FIXED_PRICING',
              priceMoney: {
                amount: BigInt(priceInCents), // Convert to BigInt for Square API
                currency: 'USD'
              }
            }
          }
        ]
      }
    };

    // Add image if available
    if (imageId) {
      catalogObject.itemData.imageIds = [imageId];
    }

    const response = await client.catalogApi.upsertCatalogObject({
      idempotencyKey: uuidv4(),
      object: catalogObject
    });

    return {
      success: true,
      catalogObject: response.result.catalogObject,
      itemId: response.result.catalogObject.id
    };
  } catch (error) {
    console.error('Error creating catalog item:', error);
    console.error('Error details:', error.errors);
    return {
      success: false,
      error: error.message,
      details: error.errors || []
    };
  }
}

/**
 * Upload image to Square
 */
export async function uploadImage(imagePath, itemName) {
  try {
    const imageFile = await fs.readFile(imagePath);
    
    // The Square SDK expects a FileWrapper object
    const request = {
      idempotencyKey: uuidv4(),
      image: {
        type: 'IMAGE',
        id: `#${uuidv4()}`,
        imageData: {
          caption: itemName
        }
      },
      imageFile: imageFile
    };
    
    const response = await client.catalogApi.createCatalogImage(request);

    return {
      success: true,
      imageId: response.result.image.id,
      imageUrl: response.result.image.imageData?.url
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    console.error('Error details:', JSON.stringify(error.errors, null, 2));
    return {
      success: false,
      error: error.message,
      details: error.errors || []
    };
  }
}

/**
 * Complete workflow: Create catalog item (with optional image upload)
 */
export async function createCompleteItem(itemData, imagePath) {
  try {
    // For now, create item without image due to Square SDK multipart/form-data issue
    // TODO: Fix image upload with proper multipart handling
    console.log('Creating item without image (image upload needs fixing)');
    
    const itemResult = await createCatalogItem(itemData);

    if (!itemResult.success) {
      return {
        success: false,
        error: 'Failed to create catalog item',
        details: itemResult.error
      };
    }

    return {
      success: true,
      item: itemResult.catalogObject,
      itemId: itemResult.itemId,
      imageUrl: null,
      note: 'Item created successfully. Image upload temporarily disabled - working on fix.'
    };
    
    /* Original image upload code - needs fixing
    // Step 1: Upload image
    const imageResult = await uploadImage(imagePath, itemData.title);
    
    if (!imageResult.success) {
      console.warn('Image upload failed, creating item without image');
      // Continue without image
    } else {
      itemData.imageId = imageResult.imageId;
    }

    // Step 2: Create catalog item
    const itemResult = await createCatalogItem(itemData);

    if (!itemResult.success) {
      return {
        success: false,
        error: 'Failed to create catalog item',
        details: itemResult.error
      };
    }

    return {
      success: true,
      item: itemResult.catalogObject,
      itemId: itemResult.itemId,
      imageUrl: imageResult?.imageUrl
    };
    */
  } catch (error) {
    console.error('Error in complete item creation:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get catalog items (for testing/verification)
 */
export async function listCatalogItems(limit = 10) {
  try {
    const response = await client.catalogApi.listCatalog(
      undefined, // cursor
      'ITEM',    // types
      limit      // limit
    );

    return {
      success: true,
      items: response.result.objects || [],
      cursor: response.result.cursor
    };
  } catch (error) {
    console.error('Error listing catalog items:', error);
    return {
      success: false,
      error: error.message,
      items: []
    };
  }
}
