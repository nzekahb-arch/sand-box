import React, { useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  Play,
  RotateCcw,
  Save,
  Terminal,
  X,
} from 'lucide-react';
import { LabConfig } from '../types/sandbox';

interface CodeEditorProps {
  code: string;
  activeLab: LabConfig;
  allLabs: LabConfig[];
  isRunning: boolean;
  isDirty: boolean;
  fontSizePx: number;
  onChangeCode: (next: string) => void;
  onSelectLab: (labId: string) => void;
  onReset: () => void;
  onSave: () => void;
  onRun: () => void;
}

const KEYWORDS = new Set([
  'from',
  'import',
  'def',
  'while',
  'if',
  'elif',
  'else',
  'for',
  'in',
  'return',
  'and',
  'or',
  'not',
  'True',
  'False',
  'None',
]);

const BUILTINS = new Set(['print', 'len', 'range', 'min', 'max', 'abs']);

function highlightPythonLine(line: string): React.ReactNode[] {
  if (!line) return ['\u00A0'];
  const commentIdx = findCommentIndex(line);
  const codePart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : '';

  const nodes: React.ReactNode[] = [];
  // Tokenize strings, numbers, identifiers, punctuation
  const tokenRegex =
    /(f?"[^"]*"|f?'[^']*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|[^\s\w"']+|\s+)/g;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = tokenRegex.exec(codePart)) !== null) {
    const token = match[0];
    if (/^\s+$/.test(token)) {
      nodes.push(token);
      continue;
    }

    if (token.startsWith('"') || token.startsWith("'") || token.startsWith('f"') || token.startsWith("f'")) {
      nodes.push(
        <span key={key++} className="text-emerald-300">
          {token}
        </span>,
      );
    } else if (/^\d/.test(token)) {
      nodes.push(
        <span key={key++} className="text-orange-300">
          {token}
        </span>,
      );
    } else if (KEYWORDS.has(token)) {
      nodes.push(
        <span key={key++} className="text-purple-400 font-semibold">
          {token}
        </span>,
      );
    } else if (BUILTINS.has(token)) {
      nodes.push(
        <span key={key++} className="text-cyan-300">
          {token}
        </span>,
      );
    } else if (
      token === 'Rover' ||
      token === 'GridMap' ||
      token === 'Sensor'
    ) {
      nodes.push(
        <span key={key++} className="text-yellow-300">
          {token}
        </span>,
      );
    } else if (token === 'stem_robotics') {
      nodes.push(
        <span key={key++} className="text-cyan-300">
          {token}
        </span>,
      );
    } else if (
      token === 'navigate_to_target' ||
      token === 'scan_surroundings' ||
      token === 'calculate_a_star' ||
      token === 'move_to' ||
      token === 'step_forward'
    ) {
      const isMethod = codePart[match.index - 1] === '.';
      nodes.push(
        <span
          key={key++}
          className={isMethod ? 'text-emerald-400' : 'text-blue-400 font-medium'}
        >
          {token}
        </span>,
      );
    } else if (token === 'rover' || token === 'obstacles' || token === 'sensors' || token === 'next_step') {
      nodes.push(
        <span key={key++} className="text-blue-300">
          {token}
        </span>,
      );
    } else {
      nodes.push(
        <span key={key++} className="text-slate-200">
          {token}
        </span>,
      );
    }
  }

  if (commentPart) {
    nodes.push(
      <span key={key++} className="text-slate-400 italic">
        {commentPart}
      </span>,
    );
  }

  return nodes;
}

function findCommentIndex(line: string): number {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === "'" && !inDouble) inSingle = !inSingle;
    else if (c === '"' && !inSingle) inDouble = !inDouble;
    else if (c === '#' && !inSingle && !inDouble) return i;
  }
  return -1;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  activeLab,
  allLabs,
  isRunning,
  isDirty,
  fontSizePx,
  onChangeCode,
  onSelectLab,
  onReset,
  onSave,
  onRun,
}) => {
  const [labMenuOpen, setLabMenuOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const lines = code.split(/\r?\n/);

  const handleSaveClick = () => {
    onSave();
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 1600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const nextValue = code.slice(0, start) + '    ' + code.slice(end);
      onChangeCode(nextValue);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  const syncScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant/60 flex flex-col gap-3">
      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-surface-container">
        {/* Left: Language & Lab selector + File tab */}
        <div className="flex items-center gap-2 relative">
          <button
            type="button"
            onClick={() => setLabMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container rounded-md text-[13px] text-on-surface font-semibold border border-outline-variant/50 transition-colors cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-primary" />
            <span>Python 3.11</span>
            <ChevronDown className="w-3.5 h-3.5 text-outline" />
          </button>

          {labMenuOpen && (
            <div className="absolute left-0 top-10 z-30 w-72 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg p-1.5">
              <div className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-outline">
                Switch Lab Environment
              </div>
              {allLabs.map((lab) => (
                <button
                  key={lab.id}
                  type="button"
                  onClick={() => {
                    onSelectLab(lab.id);
                    setLabMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-md text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    lab.id === activeLab.id
                      ? 'bg-primary-fixed/60 text-primary font-semibold'
                      : 'hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <div>
                    <div className="font-semibold">
                      {lab.labBadge}: {lab.title}
                    </div>
                    <div className="text-[11px] text-on-surface-variant font-mono">
                      {lab.fileName}
                    </div>
                  </div>
                  {lab.id === activeLab.id && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-md font-mono text-[11px] text-on-surface font-medium border border-outline-variant/40">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDirty ? 'bg-amber-500' : 'bg-secondary'
              }`}
            />
            <span>{activeLab.fileName}</span>
            {isDirty && (
              <button
                type="button"
                onClick={onReset}
                title="Discard edits & revert to starter script"
                className="ml-0.5 text-outline hover:text-on-surface cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Toolbar Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg text-[13px] font-medium border border-outline-variant/50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-on-surface-variant" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSaveClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg text-[13px] font-medium border border-outline-variant/50 transition-colors cursor-pointer"
          >
            {justSaved ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Save className="w-3.5 h-3.5 text-on-surface-variant" />
            )}
            <span>{justSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-container hover:bg-primary disabled:opacity-75 text-on-primary rounded-lg text-[13px] font-semibold transition-all active:scale-95 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-pulse' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editable Python Workspace */}
      <div
        className="w-full bg-[#0F172A] rounded-lg p-4 font-mono text-slate-100 overflow-hidden shadow-inner"
        style={{ fontSize: `${fontSizePx}px`, lineHeight: '20px' }}
      >
        <div className="flex gap-4">
          {/* Line Numbers Gutter */}
          <div
            aria-hidden="true"
            className="select-none flex flex-col text-slate-500 text-right pr-2 tabular-nums shrink-0"
          >
            {lines.map((_, idx) => (
              <span key={idx} className="leading-5">
                {String(idx + 1).padStart(2, '0')}
              </span>
            ))}
          </div>

          {/* Synchronized Syntax Highlight + Transparent Textarea */}
          <div className="relative flex-1 min-w-0">
            <div
              ref={highlightRef}
              aria-hidden="true"
              className="pointer-events-none whitespace-pre overflow-x-hidden leading-5"
            >
              {lines.map((line, idx) => (
                <div key={idx} className="leading-5">
                  {highlightPythonLine(line)}
                </div>
              ))}
            </div>

            <textarea
              ref={textareaRef}
              aria-label="Python Rover Controller Editor"
              value={code}
              onChange={(e) => onChangeCode(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={syncScroll}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              rows={Math.max(14, lines.length)}
              className="sandbox-scroll absolute inset-0 w-full h-full resize-none bg-transparent text-transparent caret-sky-300 selection:bg-blue-500/35 focus:outline-none whitespace-pre overflow-x-auto overflow-y-hidden font-mono leading-5"
              style={{ fontSize: `${fontSizePx}px`, lineHeight: '20px' }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-outline px-1">
        <span>Tip: Edit obstacles/target in code or click grid cells to toggle hazards.</span>
        <span>Ctrl+Enter to Run</span>
      </div>
    </div>
  );
};
