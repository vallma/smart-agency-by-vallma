import { Info, KeyRound, Maximize2, Settings } from 'lucide-react';
import React, { useState } from 'react';
import packageJson from '../../package.json';
import { useCoreStore } from '../integration/store/coreStore';
import { useUiStore } from '../integration/store/uiStore';
import BYOKModal from './BYOKModal';
import InfoModal from './InfoModal';

const version = packageJson.version;

const Header: React.FC = () => {
  const { llmConfig, isBYOKOpen, setBYOKOpen } = useUiStore();
  const { setViewMode } = useCoreStore();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const hasKey = !!llmConfig.apiKey;

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <header className="h-14 border-b border-zinc-100 flex items-center justify-between px-6 bg-white shrink-0 relative z-40">
      {/* Left: Project Title */}
      <div className="flex items-center min-w-0">
        <img
          src="images/the-delegation.svg"
          alt="Smart Agency by Vallma"
          className="h-10 w-auto shrink-0"
        />

        <div className="flex items-center gap-3 self-start mt-3 ml-2 min-w-0">
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsInfoOpen(true)}
              className="text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer"
            >
              <Info size={14} strokeWidth={2} />
            </button>
            <span className="text-[10px] font-medium text-zinc-400 font-mono">v{version}</span>
          </div>

        </div>
      </div>

      {/* Right: Global Controls */}
      <div className="flex items-center gap-3">

        <button
          onClick={() => setViewMode('design')}
          className="flex items-center gap-2 px-3 py-1 bg-darkDelegation hover:bg-darkDelegation text-white rounded-lg transition-all shadow-lg shadow-black/10 active:scale-95 cursor-pointer h-9 shrink-0 ml-1"
          title="Manage Teams"
        >
          <Settings size={14} className="group-hover:rotate-45 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-wider ml-1 hidden sm:inline">Manage Teams</span>
        </button>

        <div className="w-px h-4 bg-zinc-200" />

        <div className="flex items-center gap-2">
          <button
            onClick={handleFullscreen}
            className="text-zinc-400 hover:text-darkDelegation transition-colors p-1"
            title="Fullscreen Browser"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={() => setBYOKOpen(true)}
            className="relative text-zinc-400 hover:text-darkDelegation transition-colors p-1"
            title="API Key (BYOK)"
          >
            <KeyRound size={16} className={hasKey ? 'text-emerald-500 hover:text-emerald-600' : ''} />
            {hasKey && (
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {isInfoOpen && (
        <InfoModal key="info-modal" onClose={() => setIsInfoOpen(false)} />
      )}

      {isBYOKOpen && (
        <BYOKModal key="byok-modal" onClose={() => setBYOKOpen(false)} />
      )}
    </header>
  );
};

export default Header;
