import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onNodeRequest?: (nodeData: any) => void;
}

export default function ChatInterface({ onNodeRequest }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI workflow assistant. Try saying something like 'Add a trigger node' or 'Create an action that sends an email'.",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseNodeCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Simple keyword detection for demo
    if (lowerText.includes('trigger')) {
      return {
        type: 'trigger',
        label: 'New Trigger',
        description: 'Starts the workflow when conditions are met'
      };
    } else if (lowerText.includes('action') || lowerText.includes('email') || lowerText.includes('send')) {
      return {
        type: 'action',
        label: 'Send Email',
        description: 'Sends an email to specified recipients'
      };
    } else if (lowerText.includes('condition') || lowerText.includes('if') || lowerText.includes('check')) {
      return {
        type: 'condition',
        label: 'Check Condition',
        description: 'Evaluates a condition and branches the workflow'
      };
    } else if (lowerText.includes('output') || lowerText.includes('result') || lowerText.includes('end')) {
      return {
        type: 'output',
        label: 'Output Result',
        description: 'Displays the final result of the workflow'
      };
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Check if the message is requesting a node
    const nodeData = parseNodeCommand(input);
    
    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "I understand you'd like to work with your workflow. ";
      
      if (nodeData) {
        aiResponse += `I've added a ${nodeData.type} node to your canvas. `;
        onNodeRequest?.(nodeData);
        
        // Add node to canvas using the global function
        if ((window as any).addWorkflowNode) {
          (window as any).addWorkflowNode(nodeData);
        }
      } else {
        aiResponse += "Try asking me to add specific nodes like 'add a trigger node' or 'create an email action'.";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-chat-background border-l border-chat-border">
      {/* Header */}
      <div className="p-4 border-b border-chat-border">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="font-medium text-sm text-foreground">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">Build workflows with natural language</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-primary/10' 
                  : 'bg-muted'
              }`}>
                {message.sender === 'user' ? (
                  <User size={14} className="text-primary" />
                ) : (
                  <Bot size={14} className="text-muted-foreground" />
                )}
              </div>
              
              <div className={`max-w-[80%] ${
                message.sender === 'user' ? 'text-right' : ''
              }`}>
                <div className={`inline-block p-3 rounded-xl text-sm ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-message-ai text-foreground'
                }`}>
                  {message.content}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="p-2 rounded-lg shrink-0 bg-muted">
                <Bot size={14} className="text-muted-foreground" />
              </div>
              <div className="bg-message-ai p-3 rounded-xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-chat-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a trigger node, create an email action..."
            className="flex-1 bg-background border-border"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}