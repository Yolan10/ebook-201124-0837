export const openAIConfig = {
  models: {
    outline: 'gpt-4o-mini',        // Using standard gpt-4o-mini for reliable outline generation
    improvement: 'gpt-4o-mini',    // Using gpt-4o-mini for  improvements
    chapters: 'gpt-4o-mini',       // Using gpt-4o-mini for fast content
    counter: 'gpt-4o',  // Using gpt-4o for accurate counting
  },
  temperatures: {
    outline: 0.7,    // More creative for outline generation
    improvement: 0.5, // More focused for improvements
    chapters: 0.6,   // Balance between creativity and consistency
    counter: 0.1,    // Very low temperature for consistent counting
  },
  maxTokens: {
    outline: 200,     // Comprehensive outline structure
    improvement: 300, // Detailed improvements
    chapters: 400,    // Full chapter content
    counter: 10,      // Small token limit since we only need a number
  }
};