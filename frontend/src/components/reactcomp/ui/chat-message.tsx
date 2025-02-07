import React, { useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Code2, Loader2, Terminal } from 'lucide-react';

import { cn } from '@/components/reactcomp/reactlib/utils';
import { FilePreview } from '@/components/reactcomp/ui/file-preview';
import { MarkdownRenderer } from '@/components/reactcomp/ui/markdown-renderer';
// import { err } from '@/pages/api/utils/stores.ts';
// import { useStore } from '@nanostores/react';

const chatBubbleVariants = cva(
  'group/message relative break-words rounded-lg p-3 text-sm sm:max-w-[70%]',
  {
    variants: {
      isUser: {
        true: 'bg-primary text-primary-foreground',
        false: 'bg-muted text-foreground',
      },
      animation: {
        none: '',
        slide: 'duration-300 animate-in fade-in-0',
        scale: 'duration-300 animate-in fade-in-0 zoom-in-75',
        fade: 'duration-500 animate-in fade-in-0',
      },
      // !
      err: {
        true: 'bg-red-500 text-white', // Error styling
        false: '',
      },
    },
    compoundVariants: [
      {
        isUser: true,
        animation: 'slide',
        class: 'slide-in-from-right',
      },
      {
        isUser: false,
        animation: 'slide',
        class: 'slide-in-from-left',
      },
      {
        isUser: true,
        animation: 'scale',
        class: 'origin-bottom-right',
      },
      {
        isUser: false,
        animation: 'scale',
        class: 'origin-bottom-left',
      },
    ],
  }
);

type Animation = VariantProps<typeof chatBubbleVariants>['animation'];

interface Attachment {
  name?: string;
  contentType?: string;
  url: string;
}

interface PartialToolCall {
  state: 'partial-call';
  toolName: string;
}

interface ToolCall {
  state: 'call';
  toolName: string;
}

interface ToolResult {
  state: 'result';
  toolName: string;
  result: any;
}

type ToolInvocation = PartialToolCall | ToolCall | ToolResult;

export interface Message {
  id: string;
  role: 'user' | 'assistant' | (string & {});
  content: string;
  createdAt?: Date;
  experimental_attachments?: Attachment[];
  toolInvocations?: ToolInvocation[];
}

export interface ChatMessageProps extends Message {
  showTimeStamp?: boolean;
  animation?: Animation;
  actions?: React.ReactNode;
  className?: string;
  // !
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  createdAt,
  showTimeStamp = false,
  animation = 'scale',
  actions,
  className,
  experimental_attachments,
  toolInvocations,
}) => {
  const files = useMemo(() => {
    return experimental_attachments?.map((attachment) => {
      const dataArray = dataUrlToUint8Array(attachment.url);
      return new File([dataArray], attachment.name ?? 'Unknown');
    });
  }, [experimental_attachments]);

  if (toolInvocations && toolInvocations.length > 0) {
    return <ToolCall toolInvocations={toolInvocations} />;
  }
  const isUser = role === 'user';
  const formattedTime = createdAt?.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  // !
  return (
    <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
      {files ? (
        <div className="mb-1 flex flex-wrap gap-2">
          {files.map((file, index) => {
            return <FilePreview file={file} key={index} />;
          })}
        </div>
      ) : null}
      {/*!*/}
      <div className={cn(chatBubbleVariants({ isUser, animation }), className)}>
        <div>
          <MarkdownRenderer>{content}</MarkdownRenderer>
        </div>
        {role === 'assistant' && actions ? (
          <div
            className="absolute -bottom-4 right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0
              transition-opacity group-hover/message:opacity-100"
          >
            {actions}
          </div>
        ) : null}
      </div>

      {showTimeStamp && createdAt ? (
        <time
          dateTime={createdAt.toISOString()}
          className={cn(
            'mt-1 block px-1 text-xs opacity-50',
            animation !== 'none' && 'duration-500 animate-in fade-in-0'
          )}
        >
          {formattedTime}
        </time>
      ) : null}
    </div>
  );
  // return (
  //   <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
  //     {files && (
  //       <div className="mb-1 flex flex-wrap gap-2">
  //         {files.map((file, index) => (
  //           <FilePreview file={file} key={index} />
  //         ))}
  //       </div>
  //     )}
  //
  //     {/* Chat bubble with error check */}
  //     <div
  //       className={cn(
  //         chatBubbleVariants({ isUser, animation }),
  //         className,
  //         role === 'assistant' && error ? 'bg-red-600 text-white' : ''
  //       )}
  //     >
  //       <div>
  //         <MarkdownRenderer>{content}</MarkdownRenderer>
  //       </div>
  //
  //       {/* Only show actions if there’s no error */}
  //       {role === 'assistant' && actions && !error && (
  //         <div
  //           className="absolute -bottom-4 right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0
  //             transition-opacity group-hover/message:opacity-100"
  //         >
  //           {actions}
  //         </div>
  //       )}
  //     </div>
  //
  //     {showTimeStamp && createdAt && (
  //       <time
  //         dateTime={createdAt.toISOString()}
  //         className={cn(
  //           'mt-1 block px-1 text-xs opacity-50',
  //           animation !== 'none' && 'duration-500 animate-in fade-in-0'
  //         )}
  //       >
  //         {formattedTime}
  //       </time>
  //     )}
  //   </div>
  // );
};

function dataUrlToUint8Array(data: string) {
  const base64 = data.split(',')[1]; // Get the base64 part of the data URL
  const binaryString = atob(base64); // Decode base64 to binary string

  // Convert the binary string to a Uint8Array
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i); // Convert each character to its char code
  }
  return uint8Array;
}

function ToolCall({ toolInvocations }: Pick<ChatMessageProps, 'toolInvocations'>) {
  if (!toolInvocations?.length) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      {toolInvocations.map((invocation, index) => {
        switch (invocation.state) {
          case 'partial-call':
          case 'call':
            return (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground"
              >
                <Terminal className="h-4 w-4" />
                <span>Calling {invocation.toolName}...</span>
                <Loader2 className="h-3 w-3 animate-spin" />
              </div>
            );
          case 'result':
            return (
              <div
                key={index}
                className="flex flex-col gap-1.5 rounded-lg border bg-muted px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Code2 className="h-4 w-4" />
                  <span>Result from {invocation.toolName}</span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap text-foreground">
                  {JSON.stringify(invocation.result, null, 2)}
                </pre>
              </div>
            );
        }
      })}
    </div>
  );
}
