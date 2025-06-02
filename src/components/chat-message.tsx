import {Card} from "@/components/ui/card";

interface ChatMessageProps {
  message: string;
  sender: string;
}

export function ChatMessage({ message, sender }: ChatMessageProps) {
  const isUser = sender.toLowerCase() === 'user';
  
  return (
    <div className={`flex w-full m-2 ${isUser ? 'justify-start' : 'justify-end'}`}>
      <Card
        className={`
          max-w-[95%] rounded-xl shadow-md mr-4
          ${isUser ? 'bg-blue-950 text-white' : 'bg-gray-300 text-black'}
        `}
      >
        <div className="p-3 pt-0 pb-0">
          <div className="text-sm break-words">{message}</div>
        </div>
      </Card>
    </div>
  );
}