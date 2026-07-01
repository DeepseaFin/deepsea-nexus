'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface IntelligenceLayoutProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

const IntelligenceLayout: React.FC<IntelligenceLayoutProps> = ({
  title,
  subtitle,
  onBack,
  children,
  rightSidebar,
}) => {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
              {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="space-y-6">{children}</div>
          </div>

          {/* Right Sidebar */}
          {rightSidebar && (
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">{rightSidebar}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntelligenceLayout;
