import {Card} from "@/components/ui/card";

interface ChatMessageProps {
  message: string;
  sender: string;
}

export function ChatMessage({ message, sender }: ChatMessageProps) {
  const isUser = sender.toLowerCase() === 'user';
  
  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <Card
        className={`
          max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg  /* Responsive max width for the card */
          rounded-xl shadow-md                          /* Styling for the card */
          ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} /* Conditional colors */
        `}
      >
        <div className="p-3">
          <div className="text-sm break-words">{message}</div>
        </div>
      </Card>
    </div>
  );
}