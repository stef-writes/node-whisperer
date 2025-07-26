import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChainNodeData, SubNode } from '@/types/workflow';
import { getChainConfig } from '@/config/chainConfigs';
import { getStatusConfig } from '@/config/statusConfigs';

const getNodeTypeColor = (type: string) => {
  switch (type) {
    case 'Tool': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Logic': return 'bg-green-100 text-green-800 border-green-200';
    case 'System': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'LLM': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'API': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'HITL': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Notify': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'UI': return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'Finance Node': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

function ChainNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as ChainNodeData;
  const { chainType, title, description, status, subNodes, metrics } = nodeData;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const config = getChainConfig(chainType);
  const statusConfig = getStatusConfig(status);
  const Icon = config.icon;
  const StatusIcon = statusConfig.icon;

  const handleSubDAGClick = () => {
    setIsPopoverOpen(false);
    // In a real app, this would navigate to the sub-DAG canvas
    console.log(`Navigate to ${title} SubDAG Canvas`);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div 
          className={`chain-node bg-card border-2 rounded-xl p-4 shadow-lg min-w-[300px] max-w-[340px] transition-all duration-300 cursor-pointer hover:shadow-xl ${
            selected ? 'border-primary scale-105' : 'border-border'
          }`}
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        >
          <Handle
            type="target"
            position={Position.Top}
            className="handle-chain"
            style={{
              background: `hsl(var(--${config.colorClass}))`,
              border: 'none',
              width: 12,
              height: 12,
            }}
          />
          
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div 
                className="p-3 rounded-lg shrink-0"
                style={{ backgroundColor: `hsl(var(--${config.colorClass}) / 0.15)` }}
              >
                <Icon 
                  size={24} 
                  style={{ color: `hsl(var(--${config.colorClass}))` }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm text-foreground">
                    {config.label}
                  </h3>
                  <div 
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                    style={{ 
                      backgroundColor: `hsl(var(--${statusConfig.color}) / 0.15)`,
                      color: `hsl(var(--${statusConfig.color}))`
                    }}
                  >
                    <StatusIcon size={10} />
                    {statusConfig.label}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {subNodes.length} nodes
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {description}
          </p>

          {/* Metrics */}
          {metrics && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {metrics.processed !== undefined && (
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="text-xs text-muted-foreground">Processed</div>
                  <div className="text-sm font-medium">{metrics.processed}</div>
                </div>
              )}
              {metrics.queue !== undefined && (
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="text-xs text-muted-foreground">Queue</div>
                  <div className="text-sm font-medium">{metrics.queue}</div>
                </div>
              )}
              {metrics.uptime && (
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="text-xs text-muted-foreground">Uptime</div>
                  <div className="text-sm font-medium">{metrics.uptime}</div>
                </div>
              )}
            </div>
          )}

          {/* Connection indicator */}
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    status === 'active' ? 'bg-status-active animate-pulse' :
                    status === 'processing' ? 'bg-status-processing' :
                    status === 'error' ? 'bg-status-error' :
                    'bg-status-idle'
                  }`}
                  style={{ 
                    animationDelay: `${i * 0.2}s`,
                    opacity: status === 'active' ? 1 : 0.6 
                  }}
                />
              ))}
            </div>
            
            <div className="text-xs text-muted-foreground">
              Chain {chainType === 'intake' ? '1' : chainType === 'enrichment' ? '2' : chainType === 'generator' ? '3' : chainType === 'publisher' ? '4' : chainType === 'router' ? '5' : chainType === 'tracker' ? '6' : '7'}
            </div>
          </div>

          <Handle
            type="source"
            position={Position.Bottom}
            className="handle-chain"
            style={{
              background: `hsl(var(--${config.colorClass}))`,
              border: 'none',
              width: 12,
              height: 12,
            }}
          />
        </div>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-96 p-0" 
        side="right" 
        align="center"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">Sub-DAG: {config.label}</h4>
            <Button 
              size="sm" 
              onClick={handleSubDAGClick}
              className="text-xs"
            >
              Go to SubDAG Canvas
            </Button>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {subNodes.map((node, index) => (
              <div key={node.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">{node.name}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getNodeTypeColor(node.type)}`}
                    >
                      {node.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{node.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default memo(ChainNode);