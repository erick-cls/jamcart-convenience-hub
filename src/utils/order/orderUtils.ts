
// Utility functions for order processing

/**
 * Parse order items from a text string
 * @param text The raw text input from the user
 * @returns Array of cleaned order items
 */
export const parseOrderItems = (text: string): string[] => {
  // Split by newlines and filter out empty lines
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Process each line to remove bullet points or other markers
  const parsedItems = lines.map(line => {
    // Remove bullet points, dashes, or asterisks at the beginning of the line
    return line.replace(/^[•\-\*]\s*/, '').trim();
  });
  
  // Filter out the placeholder instructions
  return parsedItems.filter(item => 
    item !== 'Be specific with brands and quantities' && 
    item !== 'Mention alternatives if possible' && 
    item !== 'Add any special instructions'
  );
};
