import React from 'react';
import { Source } from '../types';
import { ExternalLink } from 'lucide-react';

interface SourceListProps {
  sources: Source[];
}

export const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  // Deduplicate sources based on normalized URI
  const uniqueSources = sources.filter((source, index, self) =>
    index === self.findIndex((t) => {
      // Simple normalization: remove trailing slash and protocol for comparison if needed
      // But keeping strict URI match is usually safer, just checking exact string match here.
      // We will check if the uri is exactly the same.
      return t.uri === source.uri;
    })
  );

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
        <ExternalLink className="w-3 h-3" />
        Sources & Citations
      </h4>
      <div className="flex flex-wrap gap-2">
        {uniqueSources.map((source, idx) => (
          <a
            key={idx}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-900 border border-gray-200 dark:border-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300 transition-colors duration-200 truncate max-w-[200px]"
            title={source.title}
          >
            <span className="truncate">{source.title || "Reference"}</span>
          </a>
        ))}
      </div>
    </div>
  );
};
