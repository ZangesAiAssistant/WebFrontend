import { ScrollArea } from "@/components/ui/scroll-area"
import {ChatMessage} from "@/components/chat-message";

export function Chat() {
  // mock message dict
  const messages = [
    { id: 1, text: "Hello, how are you?", sender: "User" },
    { id: 2, text: "I'm fine, thank you!", sender: "Bot" },
    { id: 4, text: "I have a question about your services.", sender: "User" },
    { id: 5, text: "Sure, what would you like to know?", sender: "Bot" },
    { id: 6, text: "Can you tell me more about your pricing?", sender: "User" },
    { id: 7, text: "Of course! Our pricing starts at $10 per month.", sender: "Bot" },
    { id: 9, text: "Is there a free trial available?", sender: "User" },
    { id: 10, text: "Yes, we offer a 14-day free trial.", sender: "Bot" }
  ];
  
  return (
    <div className="flex flex-col items-center justify-center">
      <ScrollArea className="w-full h-full rounded-md border p-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message.text} sender={message.sender}/>
          ))}
      </ScrollArea>
    </div>
  );
}