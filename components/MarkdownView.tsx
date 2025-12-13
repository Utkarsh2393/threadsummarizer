import React from 'react';

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-6 text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
      {lines.map((line, index) => {
        // Headers
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-3xl font-bold text-primary-700 dark:text-primary-400 mt-10 mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-4xl font-extrabold text-gray-900 dark:text-white mt-10 mb-6">{line.replace('# ', '')}</h1>;
        }

        // List items
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (
            <div key={index} className="flex items-start ml-6 mb-3">
              <span className="text-primary-500 mr-3 mt-1.5 transform scale-125">•</span>
              <span dangerouslySetInnerHTML={{ __html: parseBold(line.replace(/^(\s*[-*]\s*)/, '')) }} />
            </div>
          );
        }

        // Numbered lists
        if (/^\d+\.\s/.test(line.trim())) {
           return (
             <div key={index} className="flex items-start ml-6 mb-3">
               <span className="text-primary-500 font-bold mr-3">{line.match(/^\d+\./)?.[0]}</span>
               <span dangerouslySetInnerHTML={{ __html: parseBold(line.replace(/^\d+\.\s/, '')) }} />
             </div>
           );
        }

        // Empty lines
        if (line.trim() === '') {
          return <div key={index} className="h-4"></div>;
        }

        // Standard paragraph
        return (
          <p key={index} className="mb-3" dangerouslySetInnerHTML={{ __html: parseBold(line) }} />
        );
      })}
    </div>
  );
};

// Helper to handle **bold** text
const parseBold = (text: string) => {
  // Escape HTML first
  let safeText = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Replace **text** with <strong class="...">text</strong>
  return safeText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>');
};
