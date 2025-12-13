import React from 'react';
import { HistoryItem } from '../types';
import { X, Clock, MessageSquare, Trash2 } from 'lucide-react';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, history, onSelect, onClear }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-[60]"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Panel - Increased width to sm:w-[640px] */}
      <div className={`
        fixed inset-y-0 right-0 z-[70] w-full sm:w-[640px] bg-white dark:bg-dark-900 shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-800
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-dark-950">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary-500" />
              History
            </h3>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-600">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg">No history yet.</p>
              </div>
            ) : (
              history.slice().reverse().map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="w-full text-left p-5 rounded-2xl bg-gray-50 dark:bg-dark-800 hover:bg-primary-50 dark:hover:bg-dark-700 hover:ring-2 hover:ring-primary-200 dark:hover:ring-primary-900 transition-all group"
                >
                  {/* Display title instead of raw query */}
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1 mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-400">
                    {item.summaryData.title || item.query}
                  </p>
                  
                  {/* Show link/query as smaller subtitle if it differs from title */}
                  {item.summaryData.title !== item.query && (
                    <p className="text-sm text-gray-400 dark:text-gray-500 line-clamp-1 mb-3 font-mono opacity-80">
                      {item.query}
                    </p>
                  )}

                  <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                    {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </button>
              ))
            )}
          </div>
          
          {history.length > 0 && (
             <div className="p-6 border-t border-gray-100 dark:border-gray-800">
               <button 
                 onClick={onClear}
                 className="w-full flex items-center justify-center gap-3 py-4 text-base text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-colors font-bold"
               >
                 <Trash2 className="w-5 h-5" />
                 Clear All History
               </button>
             </div>
          )}
        </div>
      </div>
    </>
  );
};
