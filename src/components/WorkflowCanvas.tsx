import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import WorkflowNode from './WorkflowNode';

const nodeTypes: NodeTypes = {
  workflow: WorkflowNode,
};

const initialNodes: Node[] = [
  {
    id: 'welcome',
    type: 'workflow',
    position: { x: 250, y: 100 },
    data: {
      type: 'trigger',
      label: 'Welcome',
      description: 'Start building your workflow by chatting with the AI',
    },
  },
];

const initialEdges: Edge[] = [];

interface WorkflowCanvasProps {
  onNodeAdd?: (node: Node) => void;
}

export default function WorkflowCanvas({ onNodeAdd }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const canvasRef = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = useCallback((nodeData: any) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'workflow',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 150,
      },
      data: nodeData,
    };
    
    setNodes((nds) => [...nds, newNode]);
    onNodeAdd?.(newNode);
  }, [setNodes, onNodeAdd]);

  // Expose addNode function globally for chat integration
  (window as any).addWorkflowNode = addNode;

  return (
    <div ref={canvasRef} className="w-full h-full bg-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="workflow-canvas"
        style={{ background: 'hsl(var(--canvas))' }}
      >
        <Background 
          color="hsl(var(--border))" 
          gap={20} 
          size={1}
          style={{ opacity: 0.3 }}
        />
        <Controls 
          className="controls-minimal"
        />
        <MiniMap 
          className="minimap-minimal"
          style={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
          }}
          nodeStrokeWidth={2}
          nodeColor={(node) => {
            switch (node.data?.type) {
              case 'trigger': return 'hsl(var(--node-trigger))';
              case 'action': return 'hsl(var(--node-action))';
              case 'condition': return 'hsl(var(--node-condition))';
              case 'output': return 'hsl(var(--node-output))';
              default: return 'hsl(var(--primary))';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}