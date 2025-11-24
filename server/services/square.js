import { Client, Environment, FileWrapper } from 'square';
import { config } from '../config/config.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { createReadStream } from 'fs';

// Helper to get Square client with user's token or default
function getSquareClient(userToken) {
  const accessToken = userToken || config.square.accessToken;
  
  if (!accessToken) {
    throw new Error('Square access token is required. Please configure it in Settings.');
  }
  
  return new Client({
    accessToken,
    environment: config.square.environment === 'production' 
      ? Environment.Production 
      : Environment.Sandbox,
  });
}

/**
 * Create a catalog item in Square
 */
export async function createCatalogItem(itemData, userToken = null) {
  try {
    const { title, description, price, imageId } = itemData;
    const client = getSquareClient(userToken);
    
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
export async function uploadImage(imagePath, itemName, userToken = null) {
  try {
    console.log('=== SQUARE IMAGE UPLOAD START ===');
    console.log('Image path:', imagePath);
    console.log('Item name:', itemName);
    
    const client = getSquareClient(userToken);
    
    // Check if file exists
    try {
      await fs.access(imagePath);
      console.log('✓ Image file exists at:', imagePath);
    } catch (err) {
      console.error('✗ Image file NOT found at:', imagePath);
      throw new Error(`Image file not found: ${imagePath}`);
    }
    
    // Read the image file as a buffer
    const imageBuffer = await fs.readFile(imagePath);
    console.log('✓ Image buffer read, size:', imageBuffer.length, 'bytes');
    
    // Determine content type from file extension
    const isPng = imagePath.toLowerCase().endsWith('.png');
    const contentType = isPng ? 'image/png' : 'image/jpeg';
    const filename = isPng ? 'item-image.png' : 'item-image.jpg';
    
    console.log('Content type:', contentType);
    console.log('Filename:', filename);
    
    // Create FileWrapper for the image
    const imageFile = new FileWrapper(imageBuffer, {
      contentType: contentType
    });
    
    const idempotencyKey = uuidv4();
    
    // Don't include image object - just idempotency key
    // The SDK will handle creating the image object from the file
    const request = {
      idempotencyKey: idempotencyKey
    };
    
    console.log('Calling Square createCatalogImage...');
    console.log('Idempotency key:', idempotencyKey);
    console.log('Content type:', contentType);
    console.log('Buffer size:', imageBuffer.length);
    
    // Try calling with just the file, no request object
    const response = await client.catalogApi.createCatalogImage(
      request,
      imageFile
    );
    
    console.log('✓ Image upload SUCCESS!');
    console.log('Image ID:', response.result.image.id);
    console.log('Image URL:', response.result.image.imageData?.url);
    console.log('=== SQUARE IMAGE UPLOAD END ===');

    return {
      success: true,
      imageId: response.result.image.id,
      imageUrl: response.result.image.imageData?.url
    };
  } catch (error) {
    console.error('=== SQUARE IMAGE UPLOAD ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error details:', JSON.stringify(error.errors, null, 2));
    console.error('=== END ERROR ===');
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
export async function createCompleteItem(itemData, imagePath, userToken = null) {
  try {
    console.log('Starting complete item creation...');
    
    // Step 1: Create catalog item first (without image)
    const itemResult = await createCatalogItem(itemData, userToken);

    if (!itemResult.success) {
      return {
        success: false,
        error: 'Failed to create catalog item',
        details: itemResult.error
      };
    }

    const itemId = itemResult.itemId;
    console.log('Item created successfully:', itemId);

    // Step 2: Upload image and attach it to the item
    let imageId = null;
    let imageUrl = null;
    let imageUploadError = null;
    
    if (imagePath) {
      console.log('Uploading and attaching image to item:', itemId);
      const imageResult = await uploadImageToItem(imagePath, itemId, itemData.title, userToken);
      
      if (imageResult.success) {
        imageId = imageResult.imageId;
        imageUrl = imageResult.imageUrl;
        console.log('Image uploaded and attached successfully:', imageId);
      } else {
        console.warn('Image upload failed:', imageResult.error);
        imageUploadError = {
          error: imageResult.error,
          details: imageResult.details
        };
        // Item is still created, just without image
      }
    }

    return {
      success: true,
      item: itemResult.catalogObject,
      itemId: itemId,
      imageUrl: imageUrl,
      imageUploaded: !!imageId,
      imageUploadError: imageUploadError // Include error details if image upload failed
    };
  } catch (error) {
    console.error('Error in complete item creation:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Upload image and attach it to an existing catalog item
 */
async function uploadImageToItem(imagePath, itemId, itemName, userToken = null) {
  try {
    const client = getSquareClient(userToken);
    
    console.log('=== UPLOAD IMAGE TO ITEM START ===');
    console.log('Item ID:', itemId);
    console.log('Image path:', imagePath);
    
    // Check if file exists
    try {
      await fs.access(imagePath);
      console.log('✓ Image file exists');
    } catch (err) {
      console.error('✗ Image file NOT found');
      throw new Error(`Image file not found: ${imagePath}`);
    }
    
    // Read the image file
    const imageBuffer = await fs.readFile(imagePath);
    console.log('✓ Image buffer read, size:', imageBuffer.length, 'bytes');
    
    // Determine content type
    const isPng = imagePath.toLowerCase().endsWith('.png');
    const contentType = isPng ? 'image/png' : 'image/jpeg';
    
    // Create FileWrapper
    const imageFile = new FileWrapper(imageBuffer, {
      contentType: contentType
    });
    
    const idempotencyKey = uuidv4();
    
    // Create request with objectId pointing to the item
    const request = {
      idempotencyKey: idempotencyKey,
      objectId: itemId, // Attach to existing item
      isPrimary: true // Make this the primary image
    };
    
    console.log('Uploading image with request:', {
      idempotencyKey,
      objectId: itemId,
      isPrimary: true,
      contentType
    });
    
    const response = await client.catalogApi.createCatalogImage(request, imageFile);
    
    console.log('✓ Image upload SUCCESS!');
    console.log('Image ID:', response.result.image.id);
    console.log('=== UPLOAD IMAGE TO ITEM END ===');

    return {
      success: true,
      imageId: response.result.image.id,
      imageUrl: response.result.image.imageData?.url
    };
  } catch (error) {
    console.error('=== UPLOAD IMAGE TO ITEM ERROR ===');
    console.error('Error:', error.message);
    if (error.errors) {
      console.error('Details:', JSON.stringify(error.errors, null, 2));
    }
    console.error('=== END ERROR ===');
    return {
      success: false,
      error: error.message,
      details: error.errors || []
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
