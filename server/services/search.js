import axios from 'axios';

/**
 * Search the web for product information
 * Uses a simple web scraping approach
 * For production, consider using Google Custom Search API or similar
 */
export async function searchProductInfo(productName) {
  try {
    // For now, we'll return a mock result
    // In production, integrate with a search API
    
    // Simulate web search delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      results: `${productName} is a popular product. Key features include quality materials and excellent craftsmanship.`,
      sources: ['Web Search Results']
    };
  } catch (error) {
    console.error('Error searching product info:', error);
    return {
      success: false,
      error: error.message,
      results: null
    };
  }
}

/**
 * Extract product category from title
 */
export function extractCategory(title) {
  const categories = {
    'Electronics': ['phone', 'laptop', 'tablet', 'camera', 'headphone', 'speaker'],
    'Clothing': ['shirt', 'pants', 'dress', 'jacket', 'shoes', 'hat'],
    'Home & Garden': ['furniture', 'lamp', 'decor', 'plant', 'cushion'],
    'Sports': ['ball', 'equipment', 'fitness', 'yoga', 'bike'],
    'Books': ['book', 'novel', 'magazine', 'journal'],
    'Toys': ['toy', 'game', 'puzzle', 'doll'],
    'Food & Beverage': ['food', 'drink', 'coffee', 'tea', 'snack']
  };
  
  const lowerTitle = title.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerTitle.includes(keyword))) {
      return category;
    }
  }
  
  return 'General';
}
