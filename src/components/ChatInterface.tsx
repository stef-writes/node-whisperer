import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Plus, Play, Code, FileText, Zap, AlertCircle, Target, CheckCircle, Loader2, GitBranch, FileCode, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage, ChatArtifact, ChatSuggestion, ScopeObject } from '@/types/workflow';
import { chatService } from '@/services/chatService';

interface ChatInterfaceProps {
  onNodeRequest?: (nodeData: any) => void;
  currentScope?: any;
}

export default function ChatInterface({ onNodeRequest, currentScope }: ChatInterfaceProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load message history on component mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const history = await chatService.getMessageHistory();
        setMessages(history);
      } catch (error) {
        console.error('Failed to load message history:', error);
        toast({
          title: 'Error',
          description: 'Failed to load chat history',
          variant: 'destructive',
        });
      }
    };

    loadMessages();
  }, [toast]);

  const handleAddToCanvas = (chainType: string) => {
    // This function is now handled by the chat service
    // The chain deployment is managed through the service layer
    console.log(`Adding ${chainType} chain to canvas`);
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



  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    try {
    setIsLoading(true);

      // Send message through chat service
      const response = await chatService.sendMessage(input, { currentScope });
      
      // Update messages with the response
      setMessages(prev => [...prev, response]);
      
      // Handle any chain deployment requests
      if (response.intent === 'deploy' && response.artifacts) {
        const chainArtifact = response.artifacts.find(artifact => artifact.action === 'ADD_TO_CANVAS');
        if (chainArtifact) {
          onNodeRequest?.(chainArtifact);
        }
      }
      
      setInput('');
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
    <div className="flex flex-col h-full bg-background">
      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="space-y-1">
          {messages.map((message, index) => (
            <div key={message.id}>
              {message.sender === 'user' ? (
                // User Message - Minimal style
                <div className="px-4 py-3 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-foreground">You</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-sm text-foreground/90 mt-1">{message.content}</div>
                    </div>
                  </div>
                </div>
              ) : (
                // AI Message - IDE-like style
                <div className="group">
                  <div className="px-4 py-3 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles size={14} className="text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium text-foreground">Frosty</span>
                          {message.intent && (
                            <Badge variant="outline" className="text-xs h-4 px-1.5 py-0">
                              {message.intent}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-sm text-foreground/90 mt-1 whitespace-pre-wrap">{message.content}</div>
                
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant={suggestion.variant || 'outline'}
                                size="sm"
                                onClick={suggestion.action}
                                className="h-7 text-xs"
                              >
                                {suggestion.label}
                              </Button>
                            ))}
                          </div>
                        )}

                        {/* Artifacts - Mermaid, Code Diffs, etc */}
                        {message.artifacts && message.artifacts.length > 0 && (
                          <div className="mt-3 space-y-3">
                            {message.artifacts.map((artifact) => (
                              <div key={artifact.id}>
                                {/* Mermaid Diagram */}
                                {(artifact.type === 'diagram' || artifact.type === 'mermaid') && (
                                  <div className="bg-card/50 border border-border rounded-lg overflow-hidden">
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/80">
                                      <div className="flex items-center gap-2">
                                        <GitBranch size={12} className="text-muted-foreground" />
                                        <span className="text-xs font-medium">{artifact.title}</span>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-2 text-xs"
                                        onClick={() => {
                                          handleAddToCanvas('workflow');
                                          toast({
                                            title: "Added to Canvas",
                                            description: "Workflow blueprint deployed",
                                            duration: 2000,
                                          });
                                        }}
                                      >
                                        <Plus size={10} className="mr-1" />
                                        Add to Canvas
                                      </Button>
                                    </div>
                                    <div className="p-4 bg-muted/20">
                                      <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
                                        {artifact.content}
                                      </pre>
                                      {artifact.metadata && (
                                        <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>Chains: {artifact.metadata.chains}</div>
                                            <div>Nodes: {artifact.metadata.nodes}</div>
                                            <div>Tools: {artifact.metadata.tools}</div>
                                            <div>LLM Nodes: {artifact.metadata.llmNodes}</div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Code/Diff Display */}
                                {artifact.type === 'code' && (
                                  <div className="bg-card/50 border border-border rounded-lg overflow-hidden">
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/80">
                                      <div className="flex items-center gap-2">
                                        <FileCode size={12} className="text-muted-foreground" />
                                        <span className="text-xs font-medium">{artifact.title}</span>
                                        <Badge variant="outline" className="text-xs h-4 px-1.5">
                                          {artifact.language || 'code'}
                                        </Badge>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-2 text-xs"
                                        onClick={() => {
                                          toast({
                                            title: "Applied",
                                            description: "Changes have been applied",
                                            duration: 2000,
                                          });
                                        }}
                                      >
                                        <CheckCircle size={10} className="mr-1" />
                                        Apply
                                      </Button>
                                    </div>
                                    <div className="font-mono text-xs">
                                      {artifact.content.split('\n').map((line, i) => (
                                        <div
                                          key={i}
                                          className={`px-3 py-0.5 ${
                                            line.startsWith('+') ? 'bg-green-500/10 text-green-600' :
                                            line.startsWith('-') ? 'bg-red-500/10 text-red-600' :
                                            line.startsWith('@') ? 'bg-blue-500/10 text-blue-600' :
                                            'text-muted-foreground'
                                          }`}
                                        >
                                          {line}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Other artifact types */}
                                {artifact.type !== 'diagram' && artifact.type !== 'mermaid' && artifact.type !== 'code' && (
                                  <div className="bg-card/50 border border-border rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <FileText size={12} className="text-muted-foreground" />
                                      <span className="text-xs font-medium">{artifact.title}</span>
                                    </div>
                                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
                                      {artifact.content}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
        
        {/* Scope Context Indicator */}
        {currentScope && (
          <div className="px-4 py-2 border-t border-chat-border bg-muted/30">
            <div className="flex items-center gap-2 text-xs">
              <Target size={12} className="text-purple-500" />
              <span className="text-muted-foreground">Context:</span>
              <Badge variant="outline" className="text-xs">
                {currentScope.type} • {currentScope.contextText}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 ml-auto"
                onClick={() => {/* Clear scope */}}
              >
                ×
              </Button>
            </div>
          </div>
        )}
        
        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={currentScope ? "Ask about selected region..." : "Plan, search, build anything"}
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