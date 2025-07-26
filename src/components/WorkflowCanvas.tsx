import { useCallback, useRef, useState, useEffect } from 'react';
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

import ChainNode from './ChainNode';
import SystemStatus from './SystemStatus';
import { CanvasSelector } from './CanvasSelector';
import { workflowService } from '@/services/workflowService';
import { WorkflowCanvas as WorkflowCanvasType, WorkflowNode, WorkflowEdge } from '@/types/workflow';
import { getChainConfig } from '@/config/chainConfigs';

const nodeTypes: NodeTypes = {
  chain: ChainNode,
};

interface WorkflowCanvasProps {
  onNodeAdd?: (node: Node) => void;
  onSelectionCreate?: (selection: any) => void;
}

export default function WorkflowCanvas({ onNodeAdd, onSelectionCreate }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load workflow data from service
  useEffect(() => {
    const loadWorkflow = async () => {
      try {
        setIsLoading(true);
        const workflow = await workflowService.getCurrentWorkflow();
        if (workflow) {
          setNodes(workflow.nodes as Node[]);
          setEdges(workflow.edges as Edge[]);
        }
      } catch (error) {
        console.error('Failed to load workflow:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkflow();
  }, []);

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

  const addChain = useCallback(async (chainData: any) => {
    try {
      const newChain = await workflowService.deployChain(chainData);
      setNodes((nds) => [...nds, newChain as Node]);
      onNodeAdd?.(newChain as Node);
    } catch (error) {
      console.error('Failed to add chain:', error);
    }
  }, [setNodes, onNodeAdd]);

  // Expose addChain function globally for chat integration
  (window as any).addChain = addChain;

  if (isLoading) {
    return (
      <div ref={canvasRef} className="w-full h-full bg-canvas relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading workflow...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={canvasRef} className="w-full h-full bg-canvas relative">
      <SystemStatus metrics={systemMetrics} />
      <CanvasSelector 
        onSelectionCreate={onSelectionCreate || (() => {})} 
        canvasRef={canvasRef} 
      />
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
            const chainType = (node.data as any)?.chainType;
            switch (chainType) {
              case 'intake': return 'hsl(var(--chain-intake))';
              case 'enrichment': return 'hsl(var(--chain-enrichment))';
              case 'generator': return 'hsl(var(--chain-generator))';
              case 'publisher': return 'hsl(var(--chain-publisher))';
              case 'router': return 'hsl(var(--chain-router))';
              case 'tracker': return 'hsl(var(--chain-tracker))';
              case 'feedback': return 'hsl(var(--chain-feedback))';
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