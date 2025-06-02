import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Card } from "@/components/ui/card";

interface ChatMessageProps {
  message: string;
  sender: string;
}

export function ChatMessage({ message, sender }: ChatMessageProps) {
  const isUser = sender.toLowerCase() === 'user';
  
  let typographyClasses = "prose prose-sm max-w-none";
  
  if (isUser) {
    typographyClasses += " prose-invert prose-a:text-sky-400 hover:prose-a:text-sky-300";
  } else {
    typographyClasses += " prose-a:text-blue-600 hover:prose-a:text-blue-500";
  }
  
  return (
    <div className={`flex w-full mt-2 ${isUser ? 'justify-start' : 'justify-end'}`}>
      <Card
        className={`
          max-w-[90%] md:max-w-[80%] rounded-xl shadow-md pt-0 pb-0
          ${isUser ? 'bg-blue-950 text-white' : 'bg-gray-300 text-black'}
        `}
      >
        <div className={`p-3 break-words ${typographyClasses}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message}
          </ReactMarkdown>
        </div>
      </Card>
    </div>
  );
}