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
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import AgentNode from './AgentNode';

const nodeTypes: NodeTypes = {
  agent: AgentNode,
};

const initialNodes: Node[] = [
  {
    id: 'orchestrator-1',
    type: 'agent',
    position: { x: 400, y: 100 },
    data: {
      agentType: 'orchestrator',
      role: 'Command Center Primary',
      description: 'Coordinates multi-agent strategic operations and resource allocation',
      status: 'active',
      metrics: { processed: 1247, queue: 3, uptime: '2h 14m' }
    },
  },
  {
    id: 'nexus-1',
    type: 'agent',
    position: { x: 100, y: 300 },
    data: {
      agentType: 'nexus',
      role: 'Data Receiver',
      description: 'Receives and validates incoming data streams from external sources',
      status: 'processing',
      metrics: { processed: 2891, queue: 12, uptime: '4h 32m' }
    },
  },
  {
    id: 'quest-1',
    type: 'agent',
    position: { x: 700, y: 300 },
    data: {
      agentType: 'quest',
      role: 'Assembly Coordinator',
      description: 'Autonomous data assembly and transformation pipeline management',
      status: 'active',
      metrics: { processed: 1456, queue: 7, uptime: '3h 45m' }
    },
  },
  {
    id: 'scout-1',
    type: 'agent',
    position: { x: 400, y: 500 },
    data: {
      agentType: 'scout',
      role: 'Intelligence Analyst',
      description: 'Strategic content analysis and threat assessment protocols',
      status: 'idle',
      metrics: { processed: 892, queue: 0, uptime: '1h 28m' }
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1',
    source: 'orchestrator-1',
    target: 'nexus-1',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--agent-nexus))', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--agent-nexus))' },
  },
  {
    id: 'e2',
    source: 'orchestrator-1',
    target: 'quest-1',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--agent-quest))', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--agent-quest))' },
  },
  {
    id: 'e3',
    source: 'nexus-1',
    target: 'scout-1',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--agent-scout))', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--agent-scout))' },
  },
  {
    id: 'e4',
    source: 'quest-1',
    target: 'scout-1',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--agent-scout))', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--agent-scout))' },
  },
];

import SystemStatus from './SystemStatus';

interface WorkflowCanvasProps {
  onNodeAdd?: (node: Node) => void;
}

export default function WorkflowCanvas({ onNodeAdd }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Calculate system metrics with proper typing
  const systemMetrics = {
    totalAgents: nodes.length,
    activeAgents: nodes.filter(n => (n.data as any)?.status === 'active').length,
    totalProcessed: nodes.reduce((sum, n) => sum + ((n.data as any)?.metrics?.processed || 0), 0),
    avgResponseTime: 145
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addAgent = useCallback((agentData: any) => {
    const newAgent: Node = {
      id: `${agentData.agentType}-${Date.now()}`,
      type: 'agent',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 150,
      },
      data: {
        ...agentData,
        status: agentData.status || 'idle',
        metrics: agentData.metrics || { processed: 0, queue: 0, uptime: '0m' }
      },
    };
    
    setNodes((nds) => [...nds, newAgent]);
    onNodeAdd?.(newAgent);
  }, [setNodes, onNodeAdd]);

  // Expose addAgent function globally for chat integration
  (window as any).addAgent = addAgent;

  return (
    <div ref={canvasRef} className="w-full h-full bg-canvas relative">
      <SystemStatus metrics={systemMetrics} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="agent-canvas"
        style={{ background: 'hsl(var(--canvas))' }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background 
          color="hsl(var(--border))" 
          gap={24} 
          size={1.5}
          style={{ opacity: 0.15 }}
        />
        <Controls 
          className="controls-dark"
        />
        <MiniMap 
          className="minimap-dark"
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            const agentType = (node.data as any)?.agentType;
            switch (agentType) {
              case 'nexus': return 'hsl(var(--agent-nexus))';
              case 'quest': return 'hsl(var(--agent-quest))';
              case 'scout': return 'hsl(var(--agent-scout))';
              case 'orchestrator': return 'hsl(var(--agent-orchestrator))';
              default: return 'hsl(var(--primary))';
            }
          }}
          style={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
          }}
        />
      </ReactFlow>
    </div>
  );
}