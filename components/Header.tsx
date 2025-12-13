import React from 'react';
import { Scroll, History, Sun, Moon, LogOut } from 'lucide-react';
import { User, Theme } from '../types';

interface HeaderProps {
  user: User | null;
  theme: Theme;
  toggleTheme: () => void;
  toggleHistory: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, theme, toggleTheme, toggleHistory, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      {/* Removed max-w-7xl mx-auto to allow full width spanning */}
      <div className="w-full px-6 sm:px-10 h-24 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary-600 p-3 rounded-2xl text-white shadow-lg shadow-primary-500/30">
            {/* Thread Roll Icon */}
            <Scroll className="w-9 h-9" />
          </div>
          <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Thread<span className="text-primary-600">Digest</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
           {/* Theme Toggle */}
           <button 
            onClick={toggleTheme}
            className="p-3 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
          </button>

          {user && (
            <>
              {/* History Toggle */}
              <button 
                onClick={toggleHistory}
                className="p-3 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full transition-colors"
                title="View History"
              >
                <History className="w-8 h-8" />
              </button>

              <div className="h-12 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
              
              <div className="flex items-center gap-5 pl-2">
                <span className="text-xl font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                  Hi, {user.name}
                </span>
                <button
                  onClick={onLogout}
                  className="text-lg text-red-500 hover:text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-5 py-2.5 rounded-xl transition-colors"
                >
                  <LogOut className="w-7 h-7 sm:hidden" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
