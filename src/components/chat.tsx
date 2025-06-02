"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat-message";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, FormEvent } from "react";

// --- BEGIN EDITED BLOCK ---
interface Message {
  id: string | number;
  message: string;
  sender: string;
  send_time?: string;
}
// --- END EDITED BLOCK ---

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      // Try to find the Radix UI viewport specifically, common in ShadCN UI components
      let scrollableViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      } else {
        // Fallback to your original more generic selectors if the Radix attribute isn't found
        scrollableViewport = scrollAreaRef.current.querySelector('div[style*="overflow: scroll"]');
        if (scrollableViewport) {
          scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
        } else {
          // Fallback to the direct first child if it's scrollable
          const directChild = scrollAreaRef.current.firstElementChild;
          if (directChild && typeof (directChild as HTMLElement).scrollTop === 'number') {
            directChild.scrollTop = directChild.scrollHeight;
          }
        }
      }
    }
  };
  
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "http://localhost:8000/chat", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Message[] = await response.json();
        setMessages(data);
      } catch (e: any) {
        setError(e.message || "Failed to fetch messages.");
        console.error("Failed to fetch messages:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  
  const handleSendMessage = async (e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      message: newMessageText,
      sender: "User",
      send_time: new Date().toISOString(),
    };
    
    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);
    setNewMessageText("");
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ message: optimisticMessage.message }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const backendResponseMessages: Message[] = await response.json();
      
      setMessages(backendResponseMessages);
      
    } catch (e: any) {
      setError(e.message || "Failed to send message.");
      console.error("Failed to send message:", e);
      setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== optimisticMessage.id));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col flex-grow overflow-hidden p-4">
      <ScrollArea ref={scrollAreaRef} className="w-full flex-grow rounded-md border min-h-0 mb-4">
        <div className="p-4">
          {isLoading && messages.length === 0 && <p>Loading messages...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg.message} sender={msg.sender} />
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="grid grid-cols-[1fr_auto] items-end gap-2 mt-4 w-full">
        <Textarea
          className={'w-full resize-none'}
          placeholder="Type your message..."
          rows={1}
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e as any);
            }
          }}
        />
        <Button className={'h-full'} type="submit" disabled={isLoading || !newMessageText.trim()}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}