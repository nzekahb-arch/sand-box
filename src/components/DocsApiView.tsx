import React, { useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { API_REFERENCE_ITEMS } from '../data/labs';

export const DocsApiView: React.FC = () => {
  const [query, setQuery] = useState('');

  const filtered = API_REFERENCE_ITEMS.filter(
    (item) =>
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.summary.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="p-5 md:p-8 bg-surface w-full max-w-[1440px] mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] text-outline uppercase tracking-wider">
            stem_robotics v2.4 SDK
          </span>
          <h1 className="text-[24px] leading-8 font-semibold text-on-surface tracking-tight mt-0.5">
            Docs &amp; API Reference
          </h1>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter API symbols..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.symbol}
            className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-5 space-y-2.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <code className="font-mono text-sm font-semibold text-primary bg-primary-fixed/40 px-2.5 py-1 rounded">
                {item.symbol}
              </code>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant border border-outline-variant/40">
                {item.category}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">{item.summary}</p>
            <ul className="space-y-1 text-xs font-mono text-on-surface-variant bg-surface-container-low rounded-md p-3">
              {item.params.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-8 text-center text-sm text-on-surface-variant">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-outline" />
            No API symbols matched "{query}".
          </div>
        )}
      </div>
    </div>
  );
};
