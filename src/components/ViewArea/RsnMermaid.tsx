'use client';

import { memo, useEffect, useRef, type ReactNode } from 'react';
import mermaid from 'mermaid';

import { useSettingStore } from "@store/store";

// eslint-disable-next-line react/display-name
const RsnMermaid = memo(({ children }: { children: ReactNode }) => {
  const settings = useSettingStore((state) => state.settings);
  const ref = useRef<HTMLDivElement>(null);

  mermaid.initialize({
    startOnLoad: false,
    theme: settings.color_mode === 'dark' ? 'dark' : 'default',
  });

  useEffect(() => {
    if (ref.current) {
      mermaid.run({ nodes: [ref.current] });
    }
  }, [settings.color_mode]);

  return (
    <div className="mermaid" ref={ref}>
      {children}
    </div>
  );
});

export default RsnMermaid;