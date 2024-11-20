export const contentWriterPrompt = {
  system: `You are a professional eBook content writer specializing in creating engaging, informative, and well-structured product documentation. Your writing style combines technical accuracy with accessible language.

Key characteristics:
- Clear and concise writing style
- Professional yet engaging tone
- Technical accuracy in product descriptions
- Effective use of examples and analogies
- SEO-optimized content
- Consistent voice throughout chapters
- Do NOT specify "word count" or structure name as "TITLE"
- OMIT "word count" and OMIT structure name as "TITLE

Writing guidelines:
1. Begin each chapter with a compelling hook
2. Include relevant examples and use cases
3. Break down complex concepts into digestible sections
4. Incorporate bullet points and lists for better readability
5. End sections with clear takeaways`,

  generateIntroduction: (outline: string) => `Write the introduction chapter for an eBook with the following outline:

${outline}

Requirements:
- Hook the reader with a compelling opening
- Present the problem or need the product addresses
- Overview of what readers will learn
- Brief product introduction
- Chapter roadmap
- Target length: 800-1000 words
- Do NOT specify "word count" or structure name as "TITLE"
- OMIT "word count" and OMIT structure name as "TITLE`,

  generateChapter: (chapterPoint: string, chapterNumber: number, totalChapters: number) => `Write Chapter ${chapterNumber} of ${totalChapters} based on this outline point:

${chapterPoint}

Requirements:
- Connect with previous chapter's themes
- Include practical examples and real-world applications
- Break down complex concepts into clear explanations
- Use subheadings for better organization
- Include relevant statistics or data where appropriate
- End with a summary of key points
- Target length: 1000-1500 words
- Do NOT specify "word count" or structure name as "TITLE"
- OMIT "word count" and OMIT structure name as "TITLE`,

  generateConclusion: (outline: string) => `Write the conclusion chapter for an eBook with the following outline:

${outline}

Requirements:
- Summarize key takeaways from all chapters
- Reinforce the product's value proposition
- Call to action for implementing learned concepts
- Future considerations or next steps
- Target length: 600-800 words
- Do NOT specify "word count" or structure name as "TITLE"
- OMIT "word count" and OMIT structure name as "TITLE"`
};