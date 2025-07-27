import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap, Play, GitBranch, Target } from 'lucide-react';

interface WorkflowNodeData {
  type: 'trigger' | 'action' | 'condition' | 'output';
  label: string;
  description?: string;
}

const nodeIcons = {
  trigger: Zap,
  action: Play,
  condition: GitBranch,
  output: Target,
};

const nodeColors = {
  trigger: 'node-trigger',
  action: 'node-action',
  condition: 'node-condition',
  output: 'node-output',
};

function WorkflowNode({ data }: NodeProps) {
  const nodeData = data as unknown as WorkflowNodeData;
  const { type, label, description } = nodeData;
  const Icon = nodeIcons[type];
  const colorClass = nodeColors[type];

  return (
    <div className={`workflow-node bg-card border border-border rounded-xl p-4 shadow-sm min-w-[200px] max-w-[280px]`}>
      <Handle
        type="target"
        position={Position.Top}
        className="handle-minimal"
        style={{
          background: `hsl(var(--${colorClass}))`,
          border: 'none',
          width: 8,
          height: 8,
        }}
      />
      
      <div className="flex items-start gap-3">
        <div 
          className={`p-2 rounded-lg shrink-0`}
          style={{ backgroundColor: `hsl(var(--${colorClass}) / 0.1)` }}
        >
          <Icon 
            size={16} 
            style={{ color: `hsl(var(--${colorClass}))` }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground leading-tight">
            {label}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="handle-minimal"
        style={{
          background: `hsl(var(--${colorClass}))`,
          border: 'none',
          width: 8,
          height: 8,
        }}
      />
    </div>
  );
}

export default memo(WorkflowNode);