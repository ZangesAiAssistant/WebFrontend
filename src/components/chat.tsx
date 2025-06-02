"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat-message";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, FormEvent } from "react";

interface Message {
  id: string | number; // Allow string or number for IDs from backend
  text: string;
  sender: string; // e.g., "User", "Bot"
  timestamp?: string; // Optional timestamp
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null); // For auto-scrolling
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[style*="overflow: scroll"]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      } else {
        const directChild = scrollAreaRef.current.firstElementChild;
        if (directChild) {
          directChild.scrollTop = directChild.scrollHeight;
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
    if (!newMessage.trim()) return;
    
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      text: newMessage,
      sender: "User",
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);
    setNewMessage("");
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ text: optimisticMessage.text }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const botResponse: Message | Message[] = await response.json();
      
      setMessages((prevMessages) => {
        const filteredMessages = prevMessages.filter(msg => msg.id !== optimisticMessage.id);
        if (Array.isArray(botResponse)) {
          return [...filteredMessages, ...botResponse];
        } else {
          const finalUserMessage = { ...optimisticMessage, id: botResponse.id || optimisticMessage.id };
          return [...filteredMessages, finalUserMessage, botResponse];
        }
      });
      
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
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message.text} sender={message.sender} />
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="grid grid-cols-[1fr_auto] items-end gap-2 mt-4 w-full">
        <Textarea
          className={'w-full resize-none'}
          placeholder="Type your message..."
          rows={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e as any);
            }
          }}
        />
        <Button className={'h-full'} type="submit" disabled={isLoading || !newMessage.trim()}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}