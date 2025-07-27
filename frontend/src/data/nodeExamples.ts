import { NodeBlockData } from '@/components/NodeBlock';

// Enhanced node data that matches the iceOS marketing automation system structure
export const createSampleNodes = (): NodeBlockData[] => {
  return [
    // Agent Nodes
    {
      id: 'social-media-manager-agent',
      type: 'agent',
      title: 'SocialMediaManagerAgent',
      description: 'Orchestrates social media content generation, scheduling, and engagement across platforms',
      status: 'running',
      metrics: {
        processed: 847,
        queue: 23,
        uptime: '2h 15m',
        errorRate: 1.2,
        avgResponseTime: 850
      },
      config: {
        platforms: ['twitter', 'facebook', 'linkedin'],
        engagement_threshold: 0.7,
        auto_reply: true
      },
      subNodes: [
        {
          id: 'content-analyzer-llm',
          type: 'llm',
          title: 'ContentAnalyzerLLM',
          description: 'Analyzes trending topics and generates content strategies',
          status: 'running',
          config: { model: 'gpt-4', temperature: 0.7 }
        },
        {
          id: 'trend-analysis-llm',
          type: 'llm',
          title: 'TrendAnalysisLLM',
          description: 'Identifies and analyzes current social media trends',
          status: 'complete',
          config: { model: 'claude-3-sonnet', temperature: 0.3 }
        }
      ]
    },

    // Tool Nodes
    {
      id: 'reasoning-tool',
      type: 'tool',
      title: 'ReasoningTool',
      description: 'Advanced reasoning engine for complex decision making and problem solving',
      status: 'idle',
      metrics: {
        processed: 156,
        queue: 3,
        uptime: '4h 32m',
        errorRate: 0.5,
        avgResponseTime: 1200
      },
      config: {
        reasoning_type: 'chain_of_thought',
        max_depth: 5,
        confidence_threshold: 0.85
      }
    },

    {
      id: 'scheduler-tool',
      type: 'tool',
      title: 'SchedulerTool',
      description: 'Intelligent scheduling system for content publishing and campaign management',
      status: 'running',
      metrics: {
        processed: 234,
        queue: 8,
        uptime: '1h 45m',
        errorRate: 0.2,
        avgResponseTime: 450
      },
      config: {
        timezone: 'UTC',
        optimization: 'engagement_based',
        max_concurrent: 10
      }
    },

    // LLM Nodes
    {
      id: 'audience-profiler-llm',
      type: 'llm',
      title: 'AudienceProfilerLLM',
      description: 'Creates detailed audience profiles based on engagement patterns and demographics',
      status: 'complete',
      metrics: {
        processed: 89,
        queue: 0,
        uptime: '3h 20m',
        errorRate: 0.8,
        avgResponseTime: 2100
      },
      config: {
        model: 'claude-3-opus',
        temperature: 0.4,
        max_tokens: 2000,
        context_window: 100000
      }
    },

    {
      id: 'sentiment-analyzer-llm',
      type: 'llm',
      title: 'SentimentAnalysisLLM',
      description: 'Analyzes sentiment and emotional tone of social media interactions',
      status: 'error',
      metrics: {
        processed: 445,
        queue: 12,
        uptime: '45m',
        errorRate: 5.2,
        avgResponseTime: 650
      },
      config: {
        model: 'gpt-4-turbo',
        temperature: 0.2,
        specialized_prompt: 'social_sentiment'
      }
    },

    // Workflow Nodes
    {
      id: 'engagement-workflow',
      type: 'workflow',
      title: 'EngagementWorkflow',
      description: 'End-to-end workflow for monitoring, analyzing, and responding to social media engagement',
      status: 'running',
      metrics: {
        processed: 67,
        queue: 4,
        uptime: '6h 12m',
        errorRate: 1.8,
        avgResponseTime: 3200
      },
      config: {
        trigger: 'real_time',
        parallel_processing: true,
        max_concurrent_flows: 5
      },
      subNodes: [
        {
          id: 'mention-detector',
          type: 'tool',
          title: 'MentionDetector',
          description: 'Detects brand mentions across social platforms',
          status: 'running'
        },
        {
          id: 'response-generator',
          type: 'llm',
          title: 'ResponseGenerator',
          description: 'Generates contextual responses to mentions and comments',
          status: 'running'
        }
      ]
    },

    // HITL Nodes
    {
      id: 'content-approval',
      type: 'hitl',
      title: 'ContentApproval',
      description: 'Human review checkpoint for sensitive or high-impact content before publishing',
      status: 'idle',
      metrics: {
        processed: 23,
        queue: 2,
        uptime: '8h 45m',
        errorRate: 0.0,
        avgResponseTime: 45000
      },
      config: {
        approval_threshold: 'high_impact',
        timeout: '2h',
        escalation: 'manager'
      }
    },

    // System Nodes
    {
      id: 'analytics-db',
      type: 'system',
      title: 'AnalyticsDatabase',
      description: 'Centralized storage for social media metrics, engagement data, and performance analytics',
      status: 'running',
      metrics: {
        processed: 1247,
        queue: 0,
        uptime: '24h',
        errorRate: 0.1,
        avgResponseTime: 85
      },
      config: {
        database_type: 'time_series',
        retention_period: '1_year',
        backup_frequency: 'daily'
      }
    },

    {
      id: 'notification-system',
      type: 'system',
      title: 'NotificationSystem',
      description: 'Real-time alerting system for campaign performance, errors, and important events',
      status: 'running',
      metrics: {
        processed: 342,
        queue: 1,
        uptime: '12h 30m',
        errorRate: 0.3,
        avgResponseTime: 150
      },
      config: {
        channels: ['email', 'slack', 'dashboard'],
        priority_levels: 4,
        rate_limiting: true
      }
    }
  ];
};

// Create workflow-specific node collections
export const createWorkflowNodes = (workflowType: string): NodeBlockData[] => {
  switch (workflowType) {
    case 'content_generation':
      return [
        {
          id: 'content-strategy-llm',
          type: 'llm',
          title: 'ContentStrategyLLM',
          description: 'Develops comprehensive content strategies based on market analysis',
          status: 'idle',
          config: { model: 'claude-3-opus', expertise: 'marketing' }
        },
        {
          id: 'image-generator',
          type: 'tool',
          title: 'ImageGenerator',
          description: 'AI-powered image generation for social media content',
          status: 'running',
          config: { model: 'dall-e-3', style: 'professional' }
        },
        {
          id: 'content-review',
          type: 'hitl',
          title: 'ContentReview',
          description: 'Human review of generated content for brand alignment',
          status: 'idle',
          config: { review_type: 'brand_guidelines' }
        }
      ];
    
    case 'engagement_monitoring':
      return [
        {
          id: 'social-monitor',
          type: 'tool',
          title: 'SocialMonitor',
          description: 'Real-time monitoring across all social media platforms',
          status: 'running',
          config: { platforms: 'all', real_time: true }
        },
        {
          id: 'sentiment-processor',
          type: 'llm',
          title: 'SentimentProcessor',
          description: 'Advanced sentiment analysis with emotion detection',
          status: 'running',
          config: { model: 'gpt-4', sentiment_granularity: 'high' }
        },
        {
          id: 'alert-system',
          type: 'system',
          title: 'AlertSystem',
          description: 'Intelligent alerting for critical mentions or sentiment changes',
          status: 'running',
          config: { alert_threshold: 'medium', channels: ['email', 'slack'] }
        }
      ];
    
    default:
      return createSampleNodes().slice(0, 3);
  }
};

// Generate nodes based on chat context
export const generateContextualNodes = (context: string): NodeBlockData[] => {
  const contextLower = context.toLowerCase();
  
  if (contextLower.includes('inventory') || contextLower.includes('surplus')) {
    return [
      {
        id: 'inventory-reader',
        type: 'tool',
        title: 'InventoryCSVReader',
        description: 'Reads and validates surplus inventory from CSV files',
        status: 'idle',
        config: { file_types: ['csv', 'xlsx'], validation: 'strict' }
      },
      {
        id: 'deduplicator',
        type: 'tool',
        title: 'ItemDeduplicator',
        description: 'Removes duplicate or already-sold SKUs from inventory',
        status: 'idle',
        config: { matching_algorithm: 'fuzzy', threshold: 0.95 }
      },
      {
        id: 'enrichment-llm',
        type: 'llm',
        title: 'ProductEnrichmentLLM',
        description: 'Generates optimized titles and descriptions for marketplace listings',
        status: 'idle',
        config: { model: 'gpt-4', optimization: 'marketplace_seo' }
      }
    ];
  }
  
  if (contextLower.includes('marketing') || contextLower.includes('social')) {
    return createSampleNodes().filter(node => 
      node.type === 'agent' || 
      (node.type === 'llm' && node.title.toLowerCase().includes('content'))
    );
  }
  
  return createSampleNodes().slice(0, 4);
};

export default {
  createSampleNodes,
  createWorkflowNodes,
  generateContextualNodes
};