import React, { useState } from 'react';
import { BookOpen, Sparkles, Loader2, MessageSquare, CheckCircle, Download } from 'lucide-react';
import { openai } from '../lib/openai';
import { jsPDF } from 'jspdf';
import { convertMarkdownToHtml } from '../lib/markdown';

export default function ProductForm() {
  const [description, setDescription] = useState('');
  const [outline, setOutline] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [chapters, setChapters] = useState<string[]>([]);
  const [isGeneratingChapters, setIsGeneratingChapters] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please enter a product description');
      return;
    }

    setIsLoading(true);
    setError('');
    setOutline('');
    setChapters([]);

    try {
      const generatedOutline = await openai.generateOutline(description);
      setOutline(generatedOutline);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate outline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImproveOutline = async () => {
    if (!comment.trim()) {
      setError('Please enter a comment for improvement');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const improvedOutline = await openai.improveOutline(outline, comment);
      setOutline(improvedOutline);
      setComment('');
      setChapters([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to improve outline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateOutline = async () => {
    setIsGeneratingChapters(true);
    setError('');

    try {
      const generatedChapters = await openai.generateChapters(outline);
      setChapters(generatedChapters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate chapters. Please try again.');
    } finally {
      setIsGeneratingChapters(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 50;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    doc.setFont('helvetica', 'bold');
    
    // Title page
    doc.setFontSize(32);
    const title = 'Your Professional eBook';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, yPosition + 60);

    doc.addPage();
    yPosition = margin;

    const addContent = (text: string, fontSize: number, isBold: boolean = false) => {
      const segments = text.split(/(\*\*.*?\*\*)/g);
      let xPosition = margin;
      
      doc.setFontSize(fontSize);
      
      segments.forEach(segment => {
        const isBoldSegment = segment.startsWith('**') && segment.endsWith('**');
        const cleanSegment = isBoldSegment ? segment.slice(2, -2) : segment;
        
        doc.setFont('helvetica', isBoldSegment || isBold ? 'bold' : 'normal');
        const lines = doc.splitTextToSize(cleanSegment, contentWidth);
        
        lines.forEach((line: string) => {
          if (yPosition > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
            xPosition = margin;
          }
          doc.text(line, xPosition, yPosition);
          yPosition += fontSize * 1.5;
        });
      });
      
      yPosition += fontSize;
    };

    chapters.forEach((chapter, index) => {
      const title = index === 0 ? 'Introduction' : 
                   index === chapters.length - 1 ? 'Conclusion' : 
                   `Chapter ${index}`;
      
      addContent(title, 24, true);
      yPosition += 20;
      
      addContent(chapter, 12);
      yPosition += 40;
    });

    doc.save('professional-ebook.pdf');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-center space-x-2 mb-6">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Describe Your Product</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Product Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Describe your product in detail. Include its features, benefits, and target audience..."
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            <span>{isLoading ? 'Generating Outline...' : 'Generate eBook Outline'}</span>
          </button>
        </div>
      </form>

      {outline && (
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h3 className="text-xl font-semibold mb-4">Generated Outline</h3>
          <div className="prose prose-indigo max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg text-left">
              {outline}
            </pre>
          </div>

          <button
            onClick={handleValidateOutline}
            disabled={isGeneratingChapters}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGeneratingChapters ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span>{isGeneratingChapters ? 'Generating Chapters...' : 'Validate & Generate Chapters'}</span>
          </button>

          <div className="space-y-4">
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Improvement Comments
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="What would you like to improve about this outline? Add your comments here..."
                disabled={isLoading}
              />
            </div>

            <button
              type="button"
              onClick={handleImproveOutline}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <MessageSquare className="w-5 h-5" />
              )}
              <span>{isLoading ? 'Improving Outline...' : 'Improve Outline'}</span>
            </button>
          </div>

          {chapters.length > 0 && (
            <div className="mt-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Generated Chapters</h3>
                <button
                  onClick={generatePDF}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </button>
              </div>
              {chapters.map((chapter, index) => (
                <div key={index} className="prose prose-indigo max-w-none">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-4">
                      {index === 0 ? 'Introduction' : 
                       index === chapters.length - 1 ? 'Conclusion' : 
                       `Chapter ${index}`}
                    </h4>
                    <div 
                      className="text-gray-700 text-left"
                      dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(chapter) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}