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

import ChainNode from './ChainNode';
import SystemStatus from './SystemStatus';
import { CanvasSelector } from './CanvasSelector';

const nodeTypes: NodeTypes = {
  chain: ChainNode,
};

const initialNodes: Node[] = [
  {
    id: 'intake-chain',
    type: 'chain',
    position: { x: 100, y: 100 },
    data: {
      chainType: 'intake',
      title: 'Inventory Intake',
      description: 'Ingests and validates surplus inventory from CSV uploads with deduplication',
      status: 'active',
      metrics: { processed: 1247, queue: 3, uptime: '2h 14m' },
      subNodes: [
        { id: 'read_csv', name: 'read_inventory_csv', type: 'Tool', description: 'Ingests uploaded CSV of surplus products' },
        { id: 'dedupe', name: 'dedupe_items', type: 'Logic', description: 'Removes duplicate or already-sold SKUs' },
        { id: 'log_import', name: 'log_import', type: 'System', description: 'Adds audit entry to data log + dashboard' }
      ]
    },
  },
  {
    id: 'enrichment-chain',
    type: 'chain',
    position: { x: 500, y: 100 },
    data: {
      chainType: 'enrichment',
      title: 'Product Enrichment',
      description: 'AI-powered product optimization with titles, images, pricing, and taxonomy mapping',
      status: 'processing',
      metrics: { processed: 891, queue: 12, uptime: '1h 45m' },
      subNodes: [
        { id: 'gen_title', name: 'generate_title_description', type: 'LLM', description: 'Generates optimized titles + SEO-rich blurbs' },
        { id: 'find_img', name: 'find_image', type: 'Tool', description: 'Looks up product image or selects from upload folder' },
        { id: 'price_suggest', name: 'price_suggestion', type: 'LLM', description: 'Checks historical pricing data and suggests floor/ceiling range' },
        { id: 'taxonomy', name: 'taxonomy_mapper', type: 'LLM', description: 'Maps item to eBay/Amazon category trees' },
        { id: 'human_review', name: 'human_review', type: 'HITL', description: 'Optional: approve/edit enriched listing data' }
      ]
    },
  },
  {
    id: 'generator-chain',
    type: 'chain',
    position: { x: 900, y: 100 },
    data: {
      chainType: 'generator',
      title: 'Listing Generator',
      description: 'Creates platform-specific listings for Facebook, eBay, and Amazon marketplaces',
      status: 'active',
      metrics: { processed: 456, queue: 7, uptime: '3h 12m' },
      subNodes: [
        { id: 'platform_map', name: 'platform_mapper', type: 'Logic', description: 'Splits into platform-specific schema (Facebook, eBay, Amazon)' },
        { id: 'fb_listing', name: 'generate_facebook_listing', type: 'Tool', description: 'Fills Facebook Marketplace listing template' },
        { id: 'ebay_listing', name: 'generate_ebay_listing', type: 'API', description: 'Prepares listing in eBay API format' },
        { id: 'amazon_listing', name: 'generate_amazon_listing', type: 'API', description: 'Formats listing for Amazon Seller Central' },
        { id: 'summary_card', name: 'compose_summary_card', type: 'UI', description: 'Shows listings for quick visual confirmation' }
      ]
    },
  },
  {
    id: 'publisher-chain',
    type: 'chain',
    position: { x: 100, y: 400 },
    data: {
      chainType: 'publisher',
      title: 'Platform Publisher',
      description: 'Publishes listings across multiple platforms with tracking and alerts',
      status: 'active',
      metrics: { processed: 234, queue: 2, uptime: '4h 32m' },
      subNodes: [
        { id: 'fb_publish', name: 'facebook_publish', type: 'API', description: 'Posts listing via Facebook Graph API / browser automation' },
        { id: 'ebay_publish', name: 'ebay_publish', type: 'API', description: 'Uses eBay Sell API' },
        { id: 'amazon_publish', name: 'amazon_publish', type: 'API', description: 'Posts to Amazon seller account' },
        { id: 'publish_log', name: 'publish_log', type: 'System', description: 'Logs success/failure, includes platform IDs for traceability' },
        { id: 'alert_user', name: 'alert_user', type: 'Notify', description: 'Alerts if listing fails or needs approval' }
      ]
    },
  },
  {
    id: 'router-chain',
    type: 'chain',
    position: { x: 500, y: 400 },
    data: {
      chainType: 'router',
      title: 'Inquiry Router',
      description: 'Handles customer inquiries with AI classification and auto-responses',
      status: 'processing',
      metrics: { processed: 156, queue: 8, uptime: '2h 18m' },
      subNodes: [
        { id: 'monitor_inbox', name: 'monitor_inbox', type: 'API', description: 'Pulls buyer inquiries across platforms' },
        { id: 'intent_classify', name: 'intent_classifier', type: 'LLM', description: 'Classifies inquiry (price haggle, shipping, availability)' },
        { id: 'reply_gen', name: 'reply_generator', type: 'LLM', description: 'Suggests friendly auto-responses' },
        { id: 'hitl_reply', name: 'human_in_the_loop_reply', type: 'HITL', description: 'Optional override/edit before reply is sent' },
        { id: 'crm_sync', name: 'crm_sync', type: 'API', description: 'Syncs interested buyers into CRM or Notion' }
      ]
    },
  },
  {
    id: 'tracker-chain',
    type: 'chain',
    position: { x: 900, y: 400 },
    data: {
      chainType: 'tracker',
      title: 'Order Tracker',
      description: 'Manages order fulfillment from purchase to delivery with automated workflows',
      status: 'idle',
      metrics: { processed: 89, queue: 0, uptime: '5h 42m' },
      subNodes: [
        { id: 'order_webhook', name: 'order_received_webhook', type: 'Tool', description: 'Detects purchase / inquiry-to-sale' },
        { id: 'fulfillment_path', name: 'choose_fulfillment_path', type: 'Logic', description: 'Internal or drop-shipping?' },
        { id: 'notify_shipping', name: 'notify_shipping_team', type: 'Notify', description: 'Internal Slack + shipping label generator' },
        { id: 'sync_status', name: 'sync_order_status', type: 'API', description: 'Updates platform with tracking info' },
        { id: 'gen_invoice', name: 'generate_invoice', type: 'Finance Node', description: 'Optional: connects to Xero or Stripe' }
      ]
    },
  },
  {
    id: 'feedback-chain',
    type: 'chain',
    position: { x: 500, y: 700 },
    data: {
      chainType: 'feedback',
      title: 'Feedback & Sync',
      description: 'Post-sale operations including inventory updates, fee tracking, and reviews',
      status: 'active',
      metrics: { processed: 67, queue: 1, uptime: '6h 15m' },
      subNodes: [
        { id: 'mark_sold', name: 'mark_inventory_sold', type: 'Tool', description: 'Updates stock levels in internal DB' },
        { id: 'deactivate_listings', name: 'deactivate_other_listings', type: 'Logic', description: 'Removes item from other platforms once sold' },
        { id: 'track_fees', name: 'track_fees', type: 'Finance Node', description: 'Captures transaction fees, tax for accounting' },
        { id: 'review_flow', name: 'run_post_sale_review_flow', type: 'Tool', description: 'Requests reviews or automates post-sale sequence' }
      ]
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1',
    source: 'intake-chain',
    target: 'enrichment-chain',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--chain-enrichment))', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--chain-enrichment))' },
  },
  {
    id: 'e2',
    source: 'enrichment-chain',
    target: 'generator-chain',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--chain-generator))', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--chain-generator))' },
  },
  {
    id: 'e3',
    source: 'generator-chain',
    target: 'publisher-chain',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--chain-publisher))', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--chain-publisher))' },
  },
  {
    id: 'e4',
    source: 'publisher-chain',
    target: 'router-chain',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--chain-router))', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--chain-router))' },
  },
  {
    id: 'e5',
    source: 'router-chain',
    target: 'tracker-chain',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--chain-tracker))', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--chain-tracker))' },
  },
  {
    id: 'e6',
    source: 'tracker-chain',
    target: 'feedback-chain',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--chain-feedback))', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--chain-feedback))' },
  },
];

interface WorkflowCanvasProps {
  onNodeAdd?: (node: Node) => void;
  onSelectionCreate?: (selection: any) => void;
}

export default function WorkflowCanvas({ onNodeAdd, onSelectionCreate }: WorkflowCanvasProps) {
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

  const addChain = useCallback((chainData: any) => {
    const newChain: Node = {
      id: `${chainData.chainType}-${Date.now()}`,
      type: 'chain',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 150,
      },
      data: {
        ...chainData,
        status: chainData.status || 'idle',
        metrics: chainData.metrics || { processed: 0, queue: 0, uptime: '0m' },
        subNodes: chainData.subNodes || []
      },
    };
    
    setNodes((nds) => [...nds, newChain]);
    onNodeAdd?.(newChain);
  }, [setNodes, onNodeAdd]);

  // Expose addChain function globally for chat integration
  (window as any).addChain = addChain;

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