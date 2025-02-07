'use client';
import { useChat, type UseChatOptions } from 'ai/react';
import { Chat } from '@/components/reactcomp/ui/chat';
import { useState } from 'react';

type ChatDemoProps = {
  initialMessages?: UseChatOptions['initialMessages'];
};
export default function AIChat(props: ChatDemoProps) {
  const { messages, input, handleInputChange, handleSubmit, append, stop, isLoading } = useChat({
    api: '/api/chat',
    onResponse: (response) => {
      if (response.headers.get('X-ERR') === 'true') {
        const err = true;
      } else {
        const err = false;
      }
    },
    ...props,
  });
  return (
    <div className="mx-auto flex h-[85vh] max-w-2xl rounded-md border p-4 md:h-[95vh]">
      <Chat
        messages={messages}
        handleSubmit={handleSubmit}
        input={input}
        handleInputChange={handleInputChange}
        isGenerating={isLoading}
        stop={stop}
        append={append}
        suggestions={[
          'Generate a tasty vegan lasagna recipe for 3 people.',
          'Generate a list of 5 questions for a job interview for a software engineer.',
          'Who won the 2022 FIFA World Cup?',
        ]}
      />
    </div>
  );
}
