// Core workflow types
export interface SubNode {
  id: string;
  name: string;
  type: 'Tool' | 'Logic' | 'System' | 'LLM' | 'API' | 'HITL' | 'Notify' | 'UI' | 'Finance Node';
  description: string;
  status?: 'active' | 'processing' | 'idle' | 'error';
  config?: Record<string, any>;
}

export interface ChainMetrics {
  processed: number;
  queue: number;
  uptime: string;
  errorRate?: number;
  avgResponseTime?: number;
}

export interface ChainNodeData {
  chainType: 'intake' | 'enrichment' | 'generator' | 'publisher' | 'router' | 'tracker' | 'feedback';
  title: string;
  description: string;
  status: 'active' | 'processing' | 'idle' | 'error';
  subNodes: SubNode[];
  metrics?: ChainMetrics;
  config?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkflowNode {
  id: string;
  type: 'chain';
  position: { x: number; y: number };
  data: ChainNodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type: 'smoothstep';
  animated?: boolean;
  style?: Record<string, any>;
  markerEnd?: {
    type: string;
    color: string;
  };
}

export interface WorkflowCanvas {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata?: {
    name: string;
    description: string;
    version: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Chat and messaging types
export interface ChatArtifact {
  id: string;
  type: 'code' | 'config' | 'diagram' | 'spec' | 'error' | 'suggestion' | 'mermaid';
  language?: string;
  title: string;
  content: string;
  action: 'ADD_TO_CANVAS' | 'CREATE_MISSING_TOOLS' | 'APPLY_FIX' | 'OPEN_SUBDAG' | 'CONFIGURE_NODES' | 'DEPLOY_WORKFLOW';
  metadata?: Record<string, any>;
}

export interface ChatSuggestion {
  label: string;
  action: () => void;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary';
  icon?: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  intent?: 'brainstorm' | 'blueprint' | 'build' | 'debug' | 'deploy' | 'monitor';
  scope?: ScopeObject;
  artifacts?: ChatArtifact[];
  suggestions?: ChatSuggestion[];
  metadata?: {
    processingTime?: number;
    tokensUsed?: number;
    model?: string;
  };
}

export interface ScopeObject {
  id: string;
  type: 'selection' | 'region' | 'tag' | 'chain' | 'node';
  targets: {
    nodes?: string[];
    chains?: string[];
    regions?: string[];
  };
  bbox?: string;
  labels?: string[];
  notes?: string;
  metrics?: Record<string, any>;
  contextText?: string;
}

// System and status types
export interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  totalProcessed: number;
  avgResponseTime: number;
  errorRate?: number;
  uptime?: string;
}

export interface ChainConfig {
  icon: any; // Lucide icon component
  label: string;
  colorClass: string;
  gradient: string;
  description: string;
  defaultSubNodes: SubNode[];
}

export interface StatusConfig {
  icon: any; // Lucide icon component
  color: string;
  label: string;
  description?: string;
}

// API and service types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: Date;
  requestId?: string;
}

export interface WorkflowService {
  getWorkflows(): Promise<WorkflowCanvas[]>;
  getWorkflow(id: string): Promise<WorkflowCanvas>;
  createWorkflow(workflow: Partial<WorkflowCanvas>): Promise<WorkflowCanvas>;
  updateWorkflow(id: string, workflow: Partial<WorkflowCanvas>): Promise<WorkflowCanvas>;
  deleteWorkflow(id: string): Promise<void>;
  deployChain(chainData: ChainNodeData): Promise<WorkflowNode>;
}

export interface ChatService {
  sendMessage(message: string, context?: any): Promise<ChatMessage>;
  getMessageHistory(limit?: number): Promise<ChatMessage[]>;
  clearHistory(): Promise<void>;
}

// UI and component types
export interface ButtonVariant {
  variant: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  border: string;
  muted: string;
  mutedForeground: string;
}

// Error and validation types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface AppError {
  id: string;
  message: string;
  code: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  context?: Record<string, any>;
  stack?: string;
}

// Configuration types
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  ui: {
    theme: 'light' | 'dark' | 'system';
    sidebarDefaultOpen: boolean;
    animationsEnabled: boolean;
  };
  features: {
    chatEnabled: boolean;
    realTimeUpdates: boolean;
    analytics: boolean;
  };
} 