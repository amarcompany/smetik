import React, { useState } from 'react';
import { FLUTTER_CODE_FILES, FlutterFile } from '../flutterCode';
import { File, Folder, Copy, Check, Info, Smartphone, FileCheck } from 'lucide-react';

interface FlutterExporterProps {
  onShowNotification: (msg: string) => void;
}

export const FlutterExporter: React.FC<FlutterExporterProps> = ({ onShowNotification }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = FLUTTER_CODE_FILES[selectedFileIdx];

  const handleCopyCode = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      onShowNotification(`${activeFile.name} code block extracted to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="flutter-exporter-pane" className="flex flex-col h-full bg-[#1e1e24] text-[#d4d4d8] border border-[#2d2d34] rounded-2xl overflow-hidden font-sans shadow-lg">
      {/* Code Header bar info */}
      <div className="bg-[#15151a] px-4 py-3 border-b border-[#2d2d34] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-bold text-white tracking-widest uppercase">Flutter (Dart) Code Hub</span>
        </div>
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider bg-white/5 py-0.5 px-2 rounded-full">
          Production Ready Frontend
        </span>
      </div>

      {/* Info Warning card brief */}
      <div className="bg-primary/10 border-b border-primary/20 p-3 flex gap-2.5 items-start text-xs text-[#ebd5ff]">
        <Info size={14} className="text-primary mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed text-[11px]">
          Below is Smetik's high-fidelity Flutter source code. Copy these files straight into a blank Flutter workspace, add the required dependencies via <code className="bg-black/40 text-primary py-0.5 px-1 rounded font-mono font-medium">pubspec.yaml</code>, and deploy to real iOS or Android cellphones.
        </p>
      </div>

      {/* Code hub splits workspace */}
      <div className="flex-1 flex min-h-0">
        {/* Left pane: File listing tree */}
        <div className="w-56 border-r border-[#26262d] bg-[#17171c] p-2 flex flex-col gap-1 overflow-y-auto pt-3">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest pl-2 mb-2">Project Files</span>
          
          <div className="flex items-center gap-1.5 pl-2 py-1 text-gray-400 text-xs font-semibold">
            <Folder size={13} className="text-primary" />
            <span>smetik_app/</span>
          </div>

          <div className="flex flex-col gap-0.5 pl-4">
            {FLUTTER_CODE_FILES.map((file, idx) => (
              <button
                key={file.name}
                id={`btn-code-file-${file.name.replace('.', '-')}`}
                onClick={() => setSelectedFileIdx(idx)}
                className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg text-left text-xs transition-colors ${
                  idx === selectedFileIdx
                    ? 'bg-primary/25 text-[#f5e6ff] font-bold border-l-2 border-primary'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'
                }`}
              >
                {file.name === 'pubspec.yaml' ? (
                  <FileCheck size={12} className="text-primary flex-shrink-0" />
                ) : (
                  <File size={11} className="text-gray-500 flex-shrink-0" />
                )}
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right pane: Code Editor display */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#121215]">
          {/* Editor subbar: path + copy button */}
          <div className="bg-[#16161a] px-3.5 py-2.5 border-b border-[#22222a] flex items-center justify-between z-10 text-[11px]">
            <span className="font-mono text-[10px] text-gray-400 font-semibold truncate">
              {activeFile.path}
            </span>

            <button
              id="btn-code-copy"
              onClick={handleCopyCode}
              className="py-1 px-3 bg-primary hover:bg-dark-accent text-white font-semibold rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 text-[10px] uppercase tracking-wider"
              title="Copy active file contents"
            >
              {copied ? (
                <>
                  <Check size={11} className="text-[#F3C5FF]" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={11} />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Editor contents view box */}
          <div className="flex-1 overflow-auto p-4 font-mono text-[10.5px] leading-relaxed text-[#c5c5ca] select-text">
            <pre className="whitespace-pre overflow-x-auto selection:bg-primary/30">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
