import { WorkflowCanvas, WorkflowNode, WorkflowEdge, ChainNodeData, WorkflowService as IWorkflowService } from '@/types/workflow';
import { createMockWorkflow, createEmptyWorkflow, getSampleWorkflows } from '@/data/mockWorkflows';
import { getChainConfig, getDefaultSubNodes } from '@/config/chainConfigs';

class WorkflowService implements IWorkflowService {
  private workflows: Map<string, WorkflowCanvas> = new Map();
  private currentWorkflowId: string | null = null;

  constructor() {
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    const sampleWorkflows = getSampleWorkflows();
    sampleWorkflows.forEach((workflow, index) => {
      const id = `workflow-${index + 1}`;
      this.workflows.set(id, workflow);
    });
    
    // Set first workflow as current
    if (sampleWorkflows.length > 0) {
      this.currentWorkflowId = 'workflow-1';
    }
  }

  async getWorkflows(): Promise<WorkflowCanvas[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return Array.from(this.workflows.values());
  }

  async getWorkflow(id: string): Promise<WorkflowCanvas> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new Error(`Workflow with id ${id} not found`);
    }
    return workflow;
  }

  async createWorkflow(workflow: Partial<WorkflowCanvas>): Promise<WorkflowCanvas> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newWorkflow: WorkflowCanvas = {
      nodes: workflow.nodes || [],
      edges: workflow.edges || [],
      metadata: {
        name: workflow.metadata?.name || 'New Workflow',
        description: workflow.metadata?.description || 'Start building your workflow',
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    const id = `workflow-${Date.now()}`;
    this.workflows.set(id, newWorkflow);
    this.currentWorkflowId = id;
    
    return newWorkflow;
  }

  async updateWorkflow(id: string, workflow: Partial<WorkflowCanvas>): Promise<WorkflowCanvas> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const existingWorkflow = this.workflows.get(id);
    if (!existingWorkflow) {
      throw new Error(`Workflow with id ${id} not found`);
    }

    const updatedWorkflow: WorkflowCanvas = {
      ...existingWorkflow,
      ...workflow,
      metadata: {
        ...existingWorkflow.metadata,
        ...workflow.metadata,
        updatedAt: new Date()
      }
    };

    this.workflows.set(id, updatedWorkflow);
    return updatedWorkflow;
  }

  async deleteWorkflow(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!this.workflows.has(id)) {
      throw new Error(`Workflow with id ${id} not found`);
    }

    this.workflows.delete(id);
    
    // If we deleted the current workflow, set a new one
    if (this.currentWorkflowId === id) {
      const remainingWorkflows = Array.from(this.workflows.keys());
      this.currentWorkflowId = remainingWorkflows[0] || null;
    }
  }

  async deployChain(chainData: ChainNodeData): Promise<WorkflowNode> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!this.currentWorkflowId) {
      throw new Error('No current workflow selected');
    }

    const workflow = this.workflows.get(this.currentWorkflowId);
    if (!workflow) {
      throw new Error('Current workflow not found');
    }

    // Create new node
    const newNode: WorkflowNode = {
      id: `${chainData.chainType}-${Date.now()}`,
      type: 'chain',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 150,
      },
      data: {
        ...chainData,
        status: chainData.status || 'idle',
        metrics: chainData.metrics || { 
          processed: 0, 
          queue: 0, 
          uptime: '0m',
          errorRate: 0,
          avgResponseTime: 0
        },
        subNodes: chainData.subNodes || getDefaultSubNodes(chainData.chainType),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    // Add to workflow
    workflow.nodes.push(newNode);
    workflow.metadata.updatedAt = new Date();

    return newNode;
  }

  // Additional helper methods
  async getCurrentWorkflow(): Promise<WorkflowCanvas | null> {
    if (!this.currentWorkflowId) {
      return null;
    }
    return this.getWorkflow(this.currentWorkflowId);
  }

  async setCurrentWorkflow(id: string): Promise<void> {
    if (!this.workflows.has(id)) {
      throw new Error(`Workflow with id ${id} not found`);
    }
    this.currentWorkflowId = id;
  }

  async addNodeToWorkflow(workflowId: string, node: WorkflowNode): Promise<WorkflowCanvas> {
    const workflow = await this.getWorkflow(workflowId);
    workflow.nodes.push(node);
    workflow.metadata.updatedAt = new Date();
    return this.updateWorkflow(workflowId, workflow);
  }

  async addEdgeToWorkflow(workflowId: string, edge: WorkflowEdge): Promise<WorkflowCanvas> {
    const workflow = await this.getWorkflow(workflowId);
    workflow.edges.push(edge);
    workflow.metadata.updatedAt = new Date();
    return this.updateWorkflow(workflowId, workflow);
  }

  async removeNodeFromWorkflow(workflowId: string, nodeId: string): Promise<WorkflowCanvas> {
    const workflow = await this.getWorkflow(workflowId);
    workflow.nodes = workflow.nodes.filter(node => node.id !== nodeId);
    workflow.edges = workflow.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
    workflow.metadata.updatedAt = new Date();
    return this.updateWorkflow(workflowId, workflow);
  }

  async removeEdgeFromWorkflow(workflowId: string, edgeId: string): Promise<WorkflowCanvas> {
    const workflow = await this.getWorkflow(workflowId);
    workflow.edges = workflow.edges.filter(edge => edge.id !== edgeId);
    workflow.metadata.updatedAt = new Date();
    return this.updateWorkflow(workflowId, workflow);
  }

  // Utility methods for chain management
  async createChainFromType(chainType: string, position?: { x: number; y: number }): Promise<WorkflowNode> {
    const config = getChainConfig(chainType);
    if (!config) {
      throw new Error(`Unknown chain type: ${chainType}`);
    }

    const chainData: ChainNodeData = {
      chainType: chainType as any,
      title: config.label,
      description: config.description,
      status: 'idle',
      subNodes: getDefaultSubNodes(chainType),
      metrics: {
        processed: 0,
        queue: 0,
        uptime: '0m',
        errorRate: 0,
        avgResponseTime: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return this.deployChain(chainData);
  }

  async updateChainStatus(workflowId: string, nodeId: string, status: string): Promise<WorkflowCanvas> {
    const workflow = await this.getWorkflow(workflowId);
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) {
      throw new Error(`Node with id ${nodeId} not found`);
    }

    node.data.status = status as any;
    node.data.updatedAt = new Date();
    workflow.metadata.updatedAt = new Date();

    return this.updateWorkflow(workflowId, workflow);
  }
}

// Export singleton instance
export const workflowService = new WorkflowService();

// Export for testing
export { WorkflowService }; 