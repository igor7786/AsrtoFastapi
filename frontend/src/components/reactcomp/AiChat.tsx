'use client';
import { useChat, type UseChatOptions } from 'ai/react';

import { Chat } from '@/components/reactcomp/ui/chat';

type ChatDemoProps = {
  initialMessages?: UseChatOptions['initialMessages'];
};

export default function AIChat(props: ChatDemoProps) {
  const { error, messages, input, handleInputChange, handleSubmit, append, stop, isLoading } =
    useChat(props);

  return (
    <div className="flex h-[85vh] w-full px-2.5 md:h-[95vh] md:px-2">
      <Chat
        className="grow"
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
