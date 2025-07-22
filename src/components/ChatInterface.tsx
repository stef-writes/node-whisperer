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
      content: "Strategic Intelligence Network initialized. I'm your AI command interface for multi-agent deployment and coordination. Deploy agents like 'Create a Nexus data processor' or 'Initialize Scout intelligence gathering'.",
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

  const parseAgentCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Enhanced agent detection with realistic configurations
    if (lowerText.includes('nexus') || lowerText.includes('data receiver')) {
      return {
        agentType: 'nexus',
        role: 'Data Stream Processor',
        description: 'Handles incoming data validation and preliminary processing',
        status: 'processing',
        metrics: { processed: Math.floor(Math.random() * 1000), queue: Math.floor(Math.random() * 20), uptime: '1h 23m' }
      };
    } else if (lowerText.includes('quest') || lowerText.includes('assembler') || lowerText.includes('assembly')) {
      return {
        agentType: 'quest',
        role: 'Mission Coordinator',
        description: 'Orchestrates complex multi-step data assembly operations',
        status: 'active',
        metrics: { processed: Math.floor(Math.random() * 800), queue: Math.floor(Math.random() * 15), uptime: '2h 45m' }
      };
    } else if (lowerText.includes('scout') || lowerText.includes('intelligence') || lowerText.includes('analysis')) {
      return {
        agentType: 'scout',
        role: 'Tactical Analyst',
        description: 'Performs deep intelligence gathering and strategic assessment',
        status: 'idle',
        metrics: { processed: Math.floor(Math.random() * 600), queue: 0, uptime: '45m' }
      };
    } else if (lowerText.includes('orchestrator') || lowerText.includes('command') || lowerText.includes('coordinate')) {
      return {
        agentType: 'orchestrator',
        role: 'System Commander',
        description: 'Manages overall system strategy and agent coordination',
        status: 'active',
        metrics: { processed: Math.floor(Math.random() * 2000), queue: Math.floor(Math.random() * 5), uptime: '5h 12m' }
      };
    }
    
    // Auto-suggest based on keywords
    if (lowerText.includes('agent') || lowerText.includes('add') || lowerText.includes('create')) {
      const agentTypes = ['nexus', 'quest', 'scout', 'orchestrator'];
      const randomType = agentTypes[Math.floor(Math.random() * agentTypes.length)];
      return {
        agentType: randomType,
        role: `Auto-generated ${randomType}`,
        description: `Automatically created ${randomType} agent based on your request`,
        status: 'idle',
        metrics: { processed: 0, queue: 0, uptime: '0m' }
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

    // Check if the message is requesting an agent
    const agentData = parseAgentCommand(input);
    
    // Simulate AI response with agent context
    setTimeout(() => {
      let aiResponse = "";
      
      if (agentData) {
        aiResponse = `Agent deployment initiated. ${agentData.agentType.toUpperCase()} agent "${agentData.role}" has been instantiated with ${agentData.status} status. Current metrics: ${agentData.metrics?.processed || 0} items processed.`;
        onNodeRequest?.(agentData);
        
        // Add agent to canvas using the global function
        if ((window as any).addAgent) {
          (window as any).addAgent(agentData);
        }
      } else {
        const suggestions = [
          "Deploy a Nexus agent for data processing",
          "Create a Quest agent for mission coordination", 
          "Add a Scout agent for intelligence analysis",
          "Initialize an Orchestrator for system command"
        ];
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        aiResponse = `I can help you deploy agents to the operational grid. Try: "${randomSuggestion}"`;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1200);

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
          <div className="p-2 bg-primary/15 rounded-lg">
            <Sparkles size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="font-medium text-sm text-foreground">Strategic Command</h2>
            <p className="text-xs text-muted-foreground">Multi-agent deployment interface</p>
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
            placeholder="Deploy Nexus agent, initialize Scout intelligence..."
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