import React from 'react';
import { FolderCode, Play, Trash2 } from 'lucide-react';
import { SavedProject } from '../types/sandbox';

interface MyProjectsViewProps {
  projects: SavedProject[];
  onLoadProject: (proj: SavedProject) => void;
  onDeleteProject: (id: string) => void;
}

export const MyProjectsView: React.FC<MyProjectsViewProps> = ({
  projects,
  onLoadProject,
  onDeleteProject,
}) => {
  return (
    <div className="p-5 md:p-8 bg-surface w-full max-w-[1440px] mx-auto space-y-6">
      <div>
        <span className="font-mono text-[11px] text-outline uppercase tracking-wider">
          Local Workspace Storage
        </span>
        <h1 className="text-[24px] leading-8 font-semibold text-on-surface tracking-tight mt-0.5">
          My Projects
        </h1>
        <p className="text-[14px] text-on-surface-variant mt-1">
          Scripts saved via the Code Playground toolbar are stored locally in your browser.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-10 text-center space-y-2">
          <FolderCode className="w-8 h-8 text-outline mx-auto" />
          <div className="text-sm font-semibold text-on-surface">No saved scripts yet</div>
          <p className="text-xs text-on-surface-variant">
            Edit any script in Code Playground and click <strong>Save</strong> to archive a snapshot here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-outline mb-1.5">
                  <span>{proj.fileName}</span>
                  <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                </div>
                <h2 className="text-base font-semibold text-on-surface">{proj.name}</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">{proj.labTitle}</p>
                <pre className="mt-3 bg-[#0F172A] text-slate-300 font-mono text-[11px] p-2.5 rounded-md overflow-hidden max-h-24">
                  {proj.code.split('\n').slice(0, 4).join('\n')}
                </pre>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => onDeleteProject(proj.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  type="button"
                  onClick={() => onLoadProject(proj)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-white text-xs font-semibold cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Open in Playground</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
