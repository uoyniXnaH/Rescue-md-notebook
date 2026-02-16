'use client';

import { memo, useEffect, useRef, useMemo, type ReactNode } from 'react';
import mermaid from 'mermaid';

import { useSettingStore } from "@store/store";

function RsnMermaidInner({ children }: { children: ReactNode }) {
  const settings = useSettingStore((state) => state.settings);
  const ref = useRef<HTMLDivElement>(null);

  const diagram = useMemo(() => String(children), [children]);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: settings.color_mode === 'dark' ? 'dark' : 'default',
    });
  }, [settings.color_mode]);

  useEffect(() => {
    if (ref.current) {
      mermaid.run({ nodes: [ref.current] }).catch(() => {});
    }
  }, [diagram, settings.color_mode]);

  return (
    <div className="mermaid" ref={ref}>
      {children}
    </div>
  );
}

// Only re-render when diagram text actually changes.
export default memo(RsnMermaidInner, (prev, next) => String(prev.children) === String(next.children));