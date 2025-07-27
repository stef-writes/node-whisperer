import { WorkflowCanvas, WorkflowNode, WorkflowEdge, ChainNodeData } from '@/types/workflow';
import { getChainConfig, getDefaultSubNodes } from '@/config/chainConfigs';

// Helper function to create realistic metrics
const createMetrics = (baseProcessed: number, baseQueue: number, baseUptime: number) => ({
  processed: baseProcessed + Math.floor(Math.random() * 200),
  queue: baseQueue + Math.floor(Math.random() * 5),
  uptime: `${baseUptime + Math.floor(Math.random() * 2)}h ${Math.floor(Math.random() * 60)}m`,
  errorRate: Math.random() * 0.05, // 0-5% error rate
  avgResponseTime: 100 + Math.floor(Math.random() * 200)
});

// Create initial workflow nodes
export const createInitialNodes = (): WorkflowNode[] => {
  const chainTypes = ['intake', 'enrichment', 'generator', 'publisher', 'router', 'tracker', 'feedback'];
  const positions = [
    { x: 100, y: 100 },
    { x: 500, y: 100 },
    { x: 900, y: 100 },
    { x: 100, y: 400 },
    { x: 500, y: 400 },
    { x: 900, y: 400 },
    { x: 500, y: 700 }
  ];

  return chainTypes.map((chainType, index) => {
    const config = getChainConfig(chainType);
    if (!config) {
      throw new Error(`Unknown chain type: ${chainType}`);
    }

    const baseMetrics = {
      intake: { processed: 1200, queue: 3, uptime: 2 },
      enrichment: { processed: 800, queue: 12, uptime: 1 },
      generator: { processed: 400, queue: 7, uptime: 3 },
      publisher: { processed: 200, queue: 2, uptime: 4 },
      router: { processed: 150, queue: 8, uptime: 2 },
      tracker: { processed: 80, queue: 0, uptime: 5 },
      feedback: { processed: 60, queue: 1, uptime: 6 }
    };

    const baseMetric = baseMetrics[chainType as keyof typeof baseMetrics];
    const statuses: Array<'active' | 'processing' | 'idle' | 'error'> = ['active', 'processing', 'idle'];
    const status = statuses[index % statuses.length];

    const chainData: ChainNodeData = {
      chainType: chainType as any,
      title: config.label,
      description: config.description,
      status,
      subNodes: getDefaultSubNodes(chainType),
      metrics: createMetrics(baseMetric.processed, baseMetric.queue, baseMetric.uptime),
      createdAt: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
      updatedAt: new Date()
    };

    return {
      id: `${chainType}-chain`,
      type: 'chain',
      position: positions[index],
      data: chainData
    };
  });
};

// Create initial workflow edges
export const createInitialEdges = (): WorkflowEdge[] => {
  const chainTypes = ['intake', 'enrichment', 'generator', 'publisher', 'router', 'tracker', 'feedback'];
  const edges: WorkflowEdge[] = [];

  for (let i = 0; i < chainTypes.length - 1; i++) {
    const source = `${chainTypes[i]}-chain`;
    const target = `${chainTypes[i + 1]}-chain`;
    const targetConfig = getChainConfig(chainTypes[i + 1]);

    edges.push({
      id: `e${i + 1}`,
      source,
      target,
      type: 'smoothstep',
      animated: true,
      style: { 
        stroke: `hsl(var(--${targetConfig?.colorClass || 'primary'}))`, 
        strokeWidth: 3 
      },
      markerEnd: { 
        type: 'arrowclosed', 
        color: `hsl(var(--${targetConfig?.colorClass || 'primary'}))` 
      }
    });
  }

  return edges;
};

// Create complete mock workflow
export const createMockWorkflow = (): WorkflowCanvas => {
  return {
    nodes: createInitialNodes(),
    edges: createInitialEdges(),
    metadata: {
      name: 'Surplus Inventory Workflow',
      description: 'Complete workflow for processing and selling surplus inventory across multiple platforms',
      version: '1.0.0',
      createdAt: new Date(Date.now() - 86400000), // 24 hours ago
      updatedAt: new Date()
    }
  };
};

// Create empty workflow for new projects
export const createEmptyWorkflow = (): WorkflowCanvas => {
  return {
    nodes: [],
    edges: [],
    metadata: {
      name: 'New Workflow',
      description: 'Start building your workflow',
      version: '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };
};

// Sample workflows for different use cases
export const getSampleWorkflows = (): WorkflowCanvas[] => {
  return [
    createMockWorkflow(),
    {
      ...createEmptyWorkflow(),
      metadata: {
        name: 'Customer Support Workflow',
        description: 'AI-powered customer support automation',
        version: '1.0.0',
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date()
      }
    },
    {
      ...createEmptyWorkflow(),
      metadata: {
        name: 'Data Processing Pipeline',
        description: 'ETL and data transformation workflow',
        version: '1.0.0',
        createdAt: new Date(Date.now() - 259200000), // 3 days ago
        updatedAt: new Date()
      }
    }
  ];
}; 