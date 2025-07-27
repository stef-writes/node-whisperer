import React, { useState } from 'react';
import { 
  Bot, 
  Wrench, 
  GitBranch, 
  Brain, 
  User, 
  Database, 
  ChevronDown, 
  ChevronRight,
  Play,
  Square,
  RotateCcw,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export interface NodeBlockData {
  id: string;
  type: 'agent' | 'tool' | 'llm' | 'workflow' | 'hitl' | 'system';
  title: string;
  description?: string;
  status?: 'idle' | 'running' | 'complete' | 'error';
  config?: Record<string, any>;
  metrics?: {
    processed?: number;
    queue?: number;
    uptime?: string;
    errorRate?: number;
    avgResponseTime?: number;
  };
  subNodes?: NodeBlockData[];
}

interface NodeBlockProps {
  node: NodeBlockData;
  onDeploy?: (node: NodeBlockData) => void;
  onConfigure?: (node: NodeBlockData) => void;
  onViewDetails?: (node: NodeBlockData) => void;
  className?: string;
  compact?: boolean;
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'agent': return <Bot size={14} />;
    case 'tool': return <Wrench size={14} />;
    case 'llm': return <Brain size={14} />;
    case 'workflow': return <GitBranch size={14} />;
    case 'hitl': return <User size={14} />;
    case 'system': return <Database size={14} />;
    default: return <Activity size={14} />;
  }
};

const getNodeColors = (type: string) => {
  switch (type) {
    case 'agent': return {
      bg: 'bg-cyan-50 dark:bg-cyan-950/50',
      border: 'border-cyan-200 dark:border-cyan-800',
      text: 'text-cyan-700 dark:text-cyan-300',
      icon: 'text-cyan-600 dark:text-cyan-400'
    };
    case 'tool': return {
      bg: 'bg-green-50 dark:bg-green-950/50',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      icon: 'text-green-600 dark:text-green-400'
    };
    case 'llm': return {
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-300',
      icon: 'text-amber-600 dark:text-amber-400'
    };
    case 'workflow': return {
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400'
    };
    case 'hitl': return {
      bg: 'bg-pink-50 dark:bg-pink-950/50',
      border: 'border-pink-200 dark:border-pink-800 border-dashed',
      text: 'text-pink-700 dark:text-pink-300',
      icon: 'text-pink-600 dark:text-pink-400'
    };
    case 'system': return {
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-300',
      icon: 'text-purple-600 dark:text-purple-400'
    };
    default: return {
      bg: 'bg-gray-50 dark:bg-gray-950/50',
      border: 'border-gray-200 dark:border-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      icon: 'text-gray-600 dark:text-gray-400'
    };
  }
};

const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'running': return <Play size={10} className="text-green-500" />;
    case 'complete': return <CheckCircle size={10} className="text-green-500" />;
    case 'error': return <AlertCircle size={10} className="text-red-500" />;
    case 'idle': return <Square size={10} className="text-gray-400" />;
    default: return <Clock size={10} className="text-gray-400" />;
  }
};

export const NodeBlock: React.FC<NodeBlockProps> = ({
  node,
  onDeploy,
  onConfigure,
  onViewDetails,
  className = '',
  compact = false
}) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = getNodeColors(node.type);

  const handleDeploy = () => {
    onDeploy?.(node);
    toast({
      title: "Node Deployed",
      description: `${node.title} has been added to the canvas`,
      duration: 2000,
    });
  };

  const handleConfigure = () => {
    onConfigure?.(node);
  };

  const handleViewDetails = () => {
    onViewDetails?.(node);
  };

  if (compact) {
    return (
      <div className={`
        inline-flex items-center gap-2 px-2 py-1 rounded 
        ${colors.bg} ${colors.border} border text-xs
        ${className}
      `}>
        <div className={colors.icon}>
          {getNodeIcon(node.type)}
        </div>
        <span className={`font-medium ${colors.text}`}>
          {node.title}
        </span>
        {node.status && (
          <div className="flex items-center gap-1">
            {getStatusIcon(node.status)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`
      ${colors.bg} ${colors.border} border rounded-lg overflow-hidden
      hover:shadow-sm transition-all duration-200
      ${className}
    `}>
      {/* Header */}
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`
              p-2 rounded ${colors.bg} ${colors.border} border flex-shrink-0
            `}>
              <div className={colors.icon}>
                {getNodeIcon(node.type)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-medium text-sm ${colors.text} truncate`}>
                  {node.title}
                </h4>
                {node.status && (
                  <div className="flex items-center gap-1">
                    {getStatusIcon(node.status)}
                    <Badge variant="secondary" className="text-xs h-4 px-1.5">
                      {node.status}
                    </Badge>
                  </div>
                )}
              </div>
              
              {node.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {node.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {node.subNodes && node.subNodes.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
              </Button>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={handleConfigure}
            >
              <Settings size={10} />
            </Button>
            
            <Button
              size="sm"
              variant="default"
              className="h-6 px-2 text-xs"
              onClick={handleDeploy}
            >
              Deploy
            </Button>
          </div>
        </div>

        {/* Metrics */}
        {node.metrics && (
          <div className="mt-3 pt-2 border-t border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {node.metrics.processed !== undefined && (
                <div className="text-muted-foreground">
                  Processed: <span className="font-mono font-medium">{node.metrics.processed}</span>
                </div>
              )}
              {node.metrics.queue !== undefined && (
                <div className="text-muted-foreground">
                  Queue: <span className="font-mono font-medium">{node.metrics.queue}</span>
                </div>
              )}
              {node.metrics.uptime && (
                <div className="text-muted-foreground">
                  Uptime: <span className="font-mono font-medium">{node.metrics.uptime}</span>
                </div>
              )}
              {node.metrics.errorRate !== undefined && (
                <div className="text-muted-foreground">
                  Error Rate: <span className="font-mono font-medium">{node.metrics.errorRate}%</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Expanded Sub-nodes */}
      {isExpanded && node.subNodes && node.subNodes.length > 0 && (
        <div className="border-t border-border/50 bg-card/30 p-3">
          <div className="space-y-2">
            {node.subNodes.map((subNode) => (
              <NodeBlock
                key={subNode.id}
                node={subNode}
                onDeploy={onDeploy}
                onConfigure={onConfigure}
                onViewDetails={onViewDetails}
                compact={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Component for rendering multiple node blocks in a grid
interface NodeBlockGridProps {
  nodes: NodeBlockData[];
  onDeploy?: (node: NodeBlockData) => void;
  onConfigure?: (node: NodeBlockData) => void;
  onViewDetails?: (node: NodeBlockData) => void;
  className?: string;
}

export const NodeBlockGrid: React.FC<NodeBlockGridProps> = ({
  nodes,
  onDeploy,
  onConfigure,
  onViewDetails,
  className = ''
}) => {
  return (
    <div className={`grid gap-3 ${className}`}>
      {nodes.map((node) => (
        <NodeBlock
          key={node.id}
          node={node}
          onDeploy={onDeploy}
          onConfigure={onConfigure}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default NodeBlock;