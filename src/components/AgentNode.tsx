import { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Database, Zap, Search, Command, Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface AgentNodeData {
  agentType: 'nexus' | 'quest' | 'scout' | 'orchestrator';
  role: string;
  description: string;
  status: 'active' | 'processing' | 'idle' | 'error';
  metrics?: {
    processed?: number;
    queue?: number;
    uptime?: string;
  };
}

const agentConfigs = {
  nexus: {
    icon: Database,
    label: 'Nexus',
    colorClass: 'agent-nexus',
    defaultRole: 'Data Receiver',
    description: 'Receives and assembles data packets from peers',
  },
  quest: {
    icon: Zap,
    label: 'Quest',
    colorClass: 'agent-quest',
    defaultRole: 'Data Assembler',
    description: 'Autonomous assembly mission initiated',
  },
  scout: {
    icon: Search,
    label: 'Scout',
    colorClass: 'agent-scout',
    defaultRole: 'Intelligence Gatherer',
    description: 'Strategic content analysis and reconnaissance',
  },
  orchestrator: {
    icon: Command,
    label: 'Orchestrator',
    colorClass: 'agent-orchestrator',
    defaultRole: 'Command Center',
    description: 'Coordinates multi-agent operations',
  },
};

const statusConfigs = {
  active: { icon: CheckCircle, color: 'status-active', label: 'Active' },
  processing: { icon: Activity, color: 'status-processing', label: 'Processing' },
  idle: { icon: Clock, color: 'status-idle', label: 'Idle' },
  error: { icon: AlertCircle, color: 'status-error', label: 'Error' },
};

function AgentNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as AgentNodeData;
  const { agentType, role, description, status, metrics } = nodeData;
  
  const [isAnimating, setIsAnimating] = useState(false);
  
  const config = agentConfigs[agentType];
  const statusConfig = statusConfigs[status];
  const Icon = config.icon;
  const StatusIcon = statusConfig.icon;

  // Pulse animation for processing status
  useEffect(() => {
    if (status === 'processing') {
      setIsAnimating(true);
      const interval = setInterval(() => {
        setIsAnimating(prev => !prev);
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setIsAnimating(false);
    }
  }, [status]);

  return (
    <div 
      className={`agent-node bg-card border-2 rounded-xl p-4 shadow-lg min-w-[280px] max-w-[320px] transition-all duration-300 ${
        selected ? 'border-primary scale-105' : 'border-border'
      } ${isAnimating ? 'animate-pulse' : ''}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="handle-agent"
        style={{
          background: `hsl(var(--${config.colorClass}))`,
          border: 'none',
          width: 10,
          height: 10,
        }}
      />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="p-2.5 rounded-lg shrink-0"
            style={{ backgroundColor: `hsl(var(--${config.colorClass}) / 0.15)` }}
          >
            <Icon 
              size={20} 
              style={{ color: `hsl(var(--${config.colorClass}))` }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
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
              {role || config.defaultRole}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
        {description || config.description}
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
          {agentType === 'orchestrator' ? 'Primary' : 'Secondary'}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="handle-agent"
        style={{
          background: `hsl(var(--${config.colorClass}))`,
          border: 'none',
          width: 10,
          height: 10,
        }}
      />
    </div>
  );
}

export default memo(AgentNode);