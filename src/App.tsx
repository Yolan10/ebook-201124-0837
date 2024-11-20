import React from 'react';
import Header from './components/Header';
import ProductForm from './components/ProductForm';
import { BookText, Sparkles, BookCheck, Download } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Transform Your Idea in a Bestseller in 1 click
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Create professional eBooks from your product descriptions using AI. Generate outlines, 
            refine content, and download your finished book in minutes.
          </p>
          
          {/* Product Form */}
          <ProductForm />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookText className="w-8 h-8 text-indigo-600" />}
              title="Describe Your Product"
              description="Start by providing detailed information about your product, its features, and target audience."
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-indigo-600" />}
              title="AI-Powered Outline"
              description="Our AI generates a comprehensive outline tailored to your product's unique aspects."
            />
            <FeatureCard
              icon={<BookCheck className="w-8 h-8 text-indigo-600" />}
              title="Refine Content"
              description="Review and refine the generated content with AI assistance to perfect your eBook."
            />
            <FeatureCard
              icon={<Download className="w-8 h-8 text-indigo-600" />}
              title="Download eBook"
              description="Get your professionally formatted eBook ready for distribution."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default App;