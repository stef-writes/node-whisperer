import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Plus, Play, Code, FileText, Zap, AlertCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Artifact {
  id: string;
  type: 'code' | 'config' | 'diagram' | 'spec';
  language?: string;
  title: string;
  content: string;
  action: string;
}

interface ScopeObject {
  id: string;
  type: 'selection' | 'region' | 'tag';
  targets: {
    nodes?: string[];
    chains?: string[];
  };
  bbox?: string;
  labels?: string[];
  notes?: string;
  metrics?: any;
  contextText?: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  intent?: 'brainstorm' | 'blueprint' | 'build' | 'debug';
  scope?: ScopeObject;
  artifacts?: Artifact[];
  suggestions?: Array<{
    label: string;
    action: () => void;
    variant?: 'default' | 'outline';
  }>;
}

interface ChatInterfaceProps {
  onNodeRequest?: (nodeData: any) => void;
  currentScope?: any;
}

export default function ChatInterface({ onNodeRequest, currentScope }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Help me think through the surplus inventory workflow - what are the key decision points?',
      sender: 'user',
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: '2',
      content: 'Let me sketch the decision flow: Inventory arrives → Quality check → Pricing strategy → Platform selection → Listing optimization. Key decisions: Which platforms for each item type? How to handle bulk vs individual items?',
      sender: 'ai',
      timestamp: new Date(Date.now() - 220000),
      intent: 'brainstorm',
      artifacts: [
        {
          id: 'decision-flow',
          type: 'diagram',
          title: 'Surplus Inventory Decision Flow',
          content: `graph TD
    A[Inventory Arrives] --> B{Quality Check}
    B -->|Good| C[Pricing Strategy]
    B -->|Poor| D[Liquidation Path]
    C --> E{Item Type?}
    E -->|Electronics| F[eBay + Amazon]
    E -->|Furniture| G[Facebook Marketplace]`,
          action: 'ADD_TO_CANVAS'
        }
      ]
    },
    {
      id: '3',
      content: 'Refine this into specific chains and identify what tools we need for the CSV reader component.',
      sender: 'user',
      timestamp: new Date(Date.now() - 180000),
    },
    {
      id: '4',
      content: 'Here\'s the structured spec with missing components identified:',
      sender: 'ai',
      timestamp: new Date(Date.now() - 160000),
      intent: 'blueprint',
      artifacts: [
        {
          id: 'csv-reader-spec',
          type: 'spec',
          title: 'CSV Reader Tool Specification',
          content: `Tool: read_inventory_csv
Required inputs: file_path, validation_schema
Missing dependencies:
- pandas library (install)
- schema validator (create)
- error logging system (configure)`,
          action: 'CREATE_MISSING_TOOLS'
        }
      ],
      suggestions: [
        { label: 'Create Missing Tools', action: () => console.log('Creating tools'), variant: 'default' },
        { label: 'Add to Canvas', action: () => handleAddToCanvas('intake'), variant: 'outline' }
      ]
    },
    {
      id: '5',
      content: 'Why is the enrichment chain failing? Show me the error trace.',
      sender: 'user',
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: '6',
      content: 'Error analysis shows pricing API timeout. Cost impact: $127 in failed requests over 2h.',
      sender: 'ai',
      timestamp: new Date(Date.now() - 100000),
      intent: 'debug',
      artifacts: [
        {
          id: 'error-trace',
          type: 'code',
          language: 'python',
          title: 'Error Trace Analysis',
          content: `ERROR: PricingAPI timeout after 30s
Failed requests: 45/67 (67%)
Cost impact: $127 USD
Suggested fix: Add retry logic + cache`,
          action: 'APPLY_FIX'
        }
      ],
      suggestions: [
        { label: 'Apply Fix', action: () => console.log('Applying fix'), variant: 'default' },
        { label: 'Open SubDAG', action: () => console.log('Opening SubDAG'), variant: 'outline' }
      ]
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleAddToCanvas = (chainType: string) => {
    const chainData = parseChainCommand(chainType);
    if (chainData) {
      onNodeRequest?.(chainData);
      
      // Add chain to canvas using the global function
      if ((window as any).addChain) {
        (window as any).addChain(chainData);
      }
      
      // Add a follow-up message
      const followUpMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        content: `Great! I've added the ${chainData.title} chain to your canvas. Would you like to configure its sub-nodes or move on to the next chain?`,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: [
          {
            label: 'Configure Sub-nodes',
            action: () => console.log('Configure sub-nodes'),
            variant: 'outline'
          },
          {
            label: 'Next Chain',
            action: () => handleAddToCanvas('enrichment'),
            variant: 'default'
          }
        ]
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, followUpMessage]);
      }, 500);
    }
  };

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

  const parseChainCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Chain detection for surplus inventory workflow
    if (lowerText.includes('intake') || lowerText.includes('inventory') || lowerText.includes('csv')) {
      return {
        chainType: 'intake',
        title: 'Inventory Intake',
        description: 'Ingests and validates surplus inventory from CSV uploads with deduplication',
        status: 'active',
        metrics: { processed: Math.floor(Math.random() * 1000), queue: Math.floor(Math.random() * 10), uptime: `${Math.floor(Math.random() * 5)}h ${Math.floor(Math.random() * 60)}m` },
        subNodes: [
          { id: 'read_csv', name: 'read_inventory_csv', type: 'Tool', description: 'Ingests uploaded CSV of surplus products' },
          { id: 'dedupe', name: 'dedupe_items', type: 'Logic', description: 'Removes duplicate or already-sold SKUs' },
          { id: 'log_import', name: 'log_import', type: 'System', description: 'Adds audit entry to data log + dashboard' }
        ]
      };
    } else if (lowerText.includes('enrichment') || lowerText.includes('product') || lowerText.includes('optimize')) {
      return {
        chainType: 'enrichment',
        title: 'Product Enrichment',
        description: 'AI-powered product optimization with titles, images, pricing, and taxonomy mapping',
        status: 'processing',
        metrics: { processed: Math.floor(Math.random() * 800), queue: Math.floor(Math.random() * 15), uptime: `${Math.floor(Math.random() * 3)}h ${Math.floor(Math.random() * 60)}m` },
        subNodes: [
          { id: 'gen_title', name: 'generate_title_description', type: 'LLM', description: 'Generates optimized titles + SEO-rich blurbs' },
          { id: 'find_img', name: 'find_image', type: 'Tool', description: 'Looks up product image or selects from upload folder' },
          { id: 'price_suggest', name: 'price_suggestion', type: 'LLM', description: 'Checks historical pricing data and suggests floor/ceiling range' }
        ]
      };
    } else if (lowerText.includes('generator') || lowerText.includes('listing') || lowerText.includes('platform')) {
      return {
        chainType: 'generator',
        title: 'Listing Generator',
        description: 'Creates platform-specific listings for Facebook, eBay, and Amazon marketplaces',
        status: 'active',
        metrics: { processed: Math.floor(Math.random() * 600), queue: Math.floor(Math.random() * 5), uptime: `${Math.floor(Math.random() * 2)}h ${Math.floor(Math.random() * 60)}m` },
        subNodes: [
          { id: 'platform_map', name: 'platform_mapper', type: 'Logic', description: 'Splits into platform-specific schema' },
          { id: 'fb_listing', name: 'generate_facebook_listing', type: 'Tool', description: 'Fills Facebook Marketplace listing template' },
          { id: 'ebay_listing', name: 'generate_ebay_listing', type: 'API', description: 'Prepares listing in eBay API format' }
        ]
      };
    } else if (lowerText.includes('publisher') || lowerText.includes('publish') || lowerText.includes('upload')) {
      return {
        chainType: 'publisher',
        title: 'Platform Publisher',
        description: 'Publishes listings across multiple platforms with tracking and alerts',
        status: 'active',
        metrics: { processed: Math.floor(Math.random() * 400), queue: Math.floor(Math.random() * 8), uptime: `${Math.floor(Math.random() * 4)}h ${Math.floor(Math.random() * 60)}m` },
        subNodes: [
          { id: 'fb_publish', name: 'facebook_publish', type: 'API', description: 'Posts listing via Facebook Graph API' },
          { id: 'ebay_publish', name: 'ebay_publish', type: 'API', description: 'Uses eBay Sell API' },
          { id: 'amazon_publish', name: 'amazon_publish', type: 'API', description: 'Posts to Amazon seller account' }
        ]
      };
    } else if (lowerText.includes('router') || lowerText.includes('inquiry') || lowerText.includes('customer')) {
      return {
        chainType: 'router',
        title: 'Inquiry Router',
        description: 'Handles customer inquiries with AI classification and auto-responses',
        status: 'processing',
        metrics: { processed: Math.floor(Math.random() * 300), queue: Math.floor(Math.random() * 12), uptime: `${Math.floor(Math.random() * 2)}h ${Math.floor(Math.random() * 60)}m` },
        subNodes: [
          { id: 'monitor_inbox', name: 'monitor_inbox', type: 'API', description: 'Pulls buyer inquiries across platforms' },
          { id: 'intent_classify', name: 'intent_classifier', type: 'LLM', description: 'Classifies inquiry type and intent' },
          { id: 'reply_gen', name: 'reply_generator', type: 'LLM', description: 'Generates contextual responses' }
        ]
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

    // Check if the message is requesting a chain
    const chainData = parseChainCommand(input);
    
    // Simulate AI response with chain context
    setTimeout(() => {
      let aiResponse = "";
      
      if (chainData) {
        aiResponse = `Workflow chain deployed. ${chainData.title} has been instantiated with ${chainData.status} status. Processing pipeline: ${chainData.subNodes.length} sub-nodes active. Current metrics: ${chainData.metrics?.processed || 0} items processed.`;
        onNodeRequest?.(chainData);
        
        // Add chain to canvas using the global function
        if ((window as any).addChain) {
          (window as any).addChain(chainData);
        }
      } else {
        const suggestions = [
          "Deploy intake chain for inventory processing",
          "Create enrichment chain for product optimization", 
          "Add publisher chain for multi-platform listing",
          "Initialize router chain for customer inquiries"
        ];
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        aiResponse = `I can help you deploy workflow chains for surplus inventory management. Try: "${randomSuggestion}"`;
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

  const getIntentColor = (intent?: string) => {
    switch (intent) {
      case 'brainstorm': return 'border-green-500';
      case 'blueprint': return 'border-cyan-500';
      case 'build': return 'border-orange-500';
      case 'debug': return 'border-purple-500';
      default: return 'border-border';
    }
  };

  const getIntentIcon = (intent?: string) => {
    switch (intent) {
      case 'brainstorm': return <Target size={12} className="text-green-500" />;
      case 'blueprint': return <FileText size={12} className="text-cyan-500" />;
      case 'build': return <Code size={12} className="text-orange-500" />;
      case 'debug': return <AlertCircle size={12} className="text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-chat-background border-l border-chat-border">
      {/* Header */}
      <div className="p-4 border-b border-chat-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/15 rounded-lg">
              <Bot size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-sm text-foreground">Sales Agent</h2>
              <p className="text-xs text-muted-foreground">Plan, search, build anything</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Plus size={12} />
            <span>Auto</span>
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
              
              <div className={`max-w-[85%] ${
                message.sender === 'user' ? 'text-right' : ''
              }`}>
                <div className={`inline-block p-3 rounded-xl text-sm leading-relaxed border-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : `bg-message-ai text-foreground ${getIntentColor(message.intent)}`
                }`}>
                  {message.sender === 'ai' && message.intent && (
                    <div className="flex items-center gap-1 mb-2 text-xs opacity-80">
                      {getIntentIcon(message.intent)}
                      <span className="capitalize">{message.intent}</span>
                    </div>
                  )}
                  {message.content}
                </div>
                
                {message.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant={suggestion.variant || 'outline'}
                        size="sm"
                        onClick={suggestion.action}
                        className="text-xs h-7 hover-scale"
                      >
                        {suggestion.label}
                      </Button>
                    ))}
                  </div>
                )}

                {message.artifacts && (
                  <div className="space-y-2 mt-3">
                    {message.artifacts.map((artifact) => (
                      <div key={artifact.id} className="bg-card border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {artifact.type === 'code' && <Code size={14} className="text-muted-foreground" />}
                            {artifact.type === 'spec' && <FileText size={14} className="text-muted-foreground" />}
                            {artifact.type === 'config' && <Zap size={14} className="text-muted-foreground" />}
                            <span className="text-xs font-medium text-foreground">{artifact.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {artifact.type}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="default"
                            className="text-xs h-6 px-2"
                            onClick={() => {
                              if (artifact.action === 'ADD_TO_CANVAS') {
                                handleAddToCanvas('intake');
                              }
                            }}
                          >
                            <Play size={12} className="mr-1" />
                            Apply
                          </Button>
                        </div>
                        <pre className="text-xs bg-muted p-2 rounded text-muted-foreground font-mono overflow-x-auto">
                          {artifact.content}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-2">
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

      {/* Quick Actions */}
      <div className="p-4 border-t border-chat-border">
        <div className="flex flex-wrap gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddToCanvas('intake')}
            className="text-xs h-7 hover-scale"
          >
            Inventory Intake
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddToCanvas('enrichment')}
            className="text-xs h-7 hover-scale"
          >
            Product Enrichment
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddToCanvas('publisher')}
            className="text-xs h-7 hover-scale"
          >
            Platform Publisher
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput('Deploy complete workflow with all chains')}
            className="text-xs h-7 hover-scale"
          >
            Complete Workflow
          </Button>
        </div>
        
        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Plan, search, build anything"
            className="flex-1 bg-background border-border text-sm"
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