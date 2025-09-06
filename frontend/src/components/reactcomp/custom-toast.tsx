'use client';

import { Toaster, ToastBar, toast, type Toast, type ToastPosition } from 'react-hot-toast';
import { useEffect, useRef } from 'react';

interface CustomToasterProps {
  position?: ToastPosition;
  isDark?: boolean | null;
}

export function CustomToaster({ position = 'bottom-right', isDark = false }: CustomToasterProps) {
  // Track toast DOM elements and metadata
  const toastRefs = useRef<Record<string, { element: HTMLDivElement | null; toast: Toast }>>({});

  // Click outside to dismiss (except loading)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.entries(toastRefs.current).forEach(([id, { element, toast: t }]) => {
        if (element && !element.contains(event.target as Node) && t.type !== 'loading') {
          toast.dismiss(id);
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const baseStyle = {
    background: isDark ? '#1e293b' : '#fff',
    color: isDark ? '#f1f5f9' : '#000',
  };

  return (
    <Toaster
      position={position}
      toastOptions={{
        success: { style: baseStyle },
        error: { style: baseStyle },
        loading: { style: baseStyle },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div
              ref={(el) => {
                toastRefs.current[t.id] = { element: el, toast: t };
              }}
              className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                t.type !== 'loading' ? 'hover:bg-muted/40 cursor-pointer' : ''
              }`}
              onClick={t.type !== 'loading' ? () => toast.dismiss(t.id) : undefined}
              role={t.type !== 'loading' ? 'button' : undefined}
              aria-label={t.type !== 'loading' ? 'Dismiss toast' : undefined}
            >
              {icon}
              <span className="flex-1">{message}</span>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
