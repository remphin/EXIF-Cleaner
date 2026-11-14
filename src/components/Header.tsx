import React from 'react';
import { Translations } from '../utils/i18n';

interface HeaderProps {
  t: Translations;
  onTriggerUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ t, onTriggerUpload }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F4F8FB]/95 backdrop-blur-sm border-b border-[#D8E6F3]">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#workspace"
          className="text-lg font-bold tracking-tight text-[#0F2537] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-sky-600 rounded"
        >
          {t.appName}
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A6B88]"
        >
          <a
            href="#workspace"
            className="hover:text-[#0F2537] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navWorkspace}
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#0F2537] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navHowItWorks}
          </a>
          <a
            href="#ai-signatures"
            className="hover:text-[#0F2537] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navAiSignatures}
          </a>
          <a
            href="#privacy"
            className="hover:text-[#0F2537] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navPrivacy}
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onTriggerUpload}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            {t.uploadNewBtn}
          </button>
        </div>
      </div>
    </header>
  );
};
