import { 
  Database, 
  Sparkles, 
  FileText, 
  Upload, 
  MessageCircle, 
  Package, 
  BarChart3 
} from 'lucide-react';
import { ChainConfig, SubNode } from '@/types/workflow';

export const CHAIN_CONFIGS: Record<string, ChainConfig> = {
  intake: {
    icon: Database,
    label: 'Inventory Intake',
    colorClass: 'chain-intake',
    gradient: 'from-blue-500 to-blue-600',
    description: 'Ingests and validates surplus inventory from CSV uploads with deduplication',
    defaultSubNodes: [
      { 
        id: 'read_csv', 
        name: 'read_inventory_csv', 
        type: 'Tool', 
        description: 'Ingests uploaded CSV of surplus products',
        status: 'active'
      },
      { 
        id: 'dedupe', 
        name: 'dedupe_items', 
        type: 'Logic', 
        description: 'Removes duplicate or already-sold SKUs',
        status: 'active'
      },
      { 
        id: 'log_import', 
        name: 'log_import', 
        type: 'System', 
        description: 'Adds audit entry to data log + dashboard',
        status: 'active'
      }
    ]
  },
  enrichment: {
    icon: Sparkles,
    label: 'Product Enrichment',
    colorClass: 'chain-enrichment',
    gradient: 'from-purple-500 to-purple-600',
    description: 'AI-powered product optimization with titles, images, pricing, and taxonomy mapping',
    defaultSubNodes: [
      { 
        id: 'gen_title', 
        name: 'generate_title_description', 
        type: 'LLM', 
        description: 'Generates optimized titles + SEO-rich blurbs',
        status: 'active'
      },
      { 
        id: 'find_img', 
        name: 'find_image', 
        type: 'Tool', 
        description: 'Looks up product image or selects from upload folder',
        status: 'active'
      },
      { 
        id: 'price_suggest', 
        name: 'price_suggestion', 
        type: 'LLM', 
        description: 'Checks historical pricing data and suggests floor/ceiling range',
        status: 'active'
      },
      { 
        id: 'taxonomy', 
        name: 'taxonomy_mapper', 
        type: 'LLM', 
        description: 'Maps item to eBay/Amazon category trees',
        status: 'active'
      },
      { 
        id: 'human_review', 
        name: 'human_review', 
        type: 'HITL', 
        description: 'Optional: approve/edit enriched listing data',
        status: 'idle'
      }
    ]
  },
  generator: {
    icon: FileText,
    label: 'Listing Generator',
    colorClass: 'chain-generator',
    gradient: 'from-green-500 to-green-600',
    description: 'Creates platform-specific listings for Facebook, eBay, and Amazon marketplaces',
    defaultSubNodes: [
      { 
        id: 'platform_map', 
        name: 'platform_mapper', 
        type: 'Logic', 
        description: 'Splits into platform-specific schema (Facebook, eBay, Amazon)',
        status: 'active'
      },
      { 
        id: 'fb_listing', 
        name: 'generate_facebook_listing', 
        type: 'Tool', 
        description: 'Fills Facebook Marketplace listing template',
        status: 'active'
      },
      { 
        id: 'ebay_listing', 
        name: 'generate_ebay_listing', 
        type: 'API', 
        description: 'Prepares listing in eBay API format',
        status: 'active'
      },
      { 
        id: 'amazon_listing', 
        name: 'generate_amazon_listing', 
        type: 'API', 
        description: 'Formats listing for Amazon Seller Central',
        status: 'active'
      },
      { 
        id: 'summary_card', 
        name: 'compose_summary_card', 
        type: 'UI', 
        description: 'Shows listings for quick visual confirmation',
        status: 'active'
      }
    ]
  },
  publisher: {
    icon: Upload,
    label: 'Platform Publisher',
    colorClass: 'chain-publisher',
    gradient: 'from-orange-500 to-orange-600',
    description: 'Publishes listings across multiple platforms with tracking and alerts',
    defaultSubNodes: [
      { 
        id: 'fb_publish', 
        name: 'facebook_publish', 
        type: 'API', 
        description: 'Posts listing via Facebook Graph API / browser automation',
        status: 'active'
      },
      { 
        id: 'ebay_publish', 
        name: 'ebay_publish', 
        type: 'API', 
        description: 'Uses eBay Sell API',
        status: 'active'
      },
      { 
        id: 'amazon_publish', 
        name: 'amazon_publish', 
        type: 'API', 
        description: 'Posts to Amazon seller account',
        status: 'active'
      },
      { 
        id: 'publish_log', 
        name: 'publish_log', 
        type: 'System', 
        description: 'Logs success/failure, includes platform IDs for traceability',
        status: 'active'
      },
      { 
        id: 'alert_user', 
        name: 'alert_user', 
        type: 'Notify', 
        description: 'Alerts if listing fails or needs approval',
        status: 'active'
      }
    ]
  },
  router: {
    icon: MessageCircle,
    label: 'Inquiry Router',
    colorClass: 'chain-router',
    gradient: 'from-cyan-500 to-cyan-600',
    description: 'Handles customer inquiries with AI classification and auto-responses',
    defaultSubNodes: [
      { 
        id: 'monitor_inbox', 
        name: 'monitor_inbox', 
        type: 'API', 
        description: 'Pulls buyer inquiries across platforms',
        status: 'active'
      },
      { 
        id: 'intent_classify', 
        name: 'intent_classifier', 
        type: 'LLM', 
        description: 'Classifies inquiry (price haggle, shipping, availability)',
        status: 'active'
      },
      { 
        id: 'reply_gen', 
        name: 'reply_generator', 
        type: 'LLM', 
        description: 'Suggests friendly auto-responses',
        status: 'active'
      },
      { 
        id: 'hitl_reply', 
        name: 'human_in_the_loop_reply', 
        type: 'HITL', 
        description: 'Optional override/edit before reply is sent',
        status: 'idle'
      },
      { 
        id: 'crm_sync', 
        name: 'crm_sync', 
        type: 'API', 
        description: 'Syncs interested buyers into CRM or Notion',
        status: 'active'
      }
    ]
  },
  tracker: {
    icon: Package,
    label: 'Order Tracker',
    colorClass: 'chain-tracker',
    gradient: 'from-pink-500 to-pink-600',
    description: 'Manages order fulfillment from purchase to delivery with automated workflows',
    defaultSubNodes: [
      { 
        id: 'order_webhook', 
        name: 'order_received_webhook', 
        type: 'Tool', 
        description: 'Detects purchase / inquiry-to-sale',
        status: 'active'
      },
      { 
        id: 'fulfillment_path', 
        name: 'choose_fulfillment_path', 
        type: 'Logic', 
        description: 'Internal or drop-shipping?',
        status: 'active'
      },
      { 
        id: 'notify_shipping', 
        name: 'notify_shipping_team', 
        type: 'Notify', 
        description: 'Internal Slack + shipping label generator',
        status: 'active'
      },
      { 
        id: 'sync_status', 
        name: 'sync_order_status', 
        type: 'API', 
        description: 'Updates platform with tracking info',
        status: 'active'
      },
      { 
        id: 'gen_invoice', 
        name: 'generate_invoice', 
        type: 'Finance Node', 
        description: 'Optional: connects to Xero or Stripe',
        status: 'idle'
      }
    ]
  },
  feedback: {
    icon: BarChart3,
    label: 'Feedback & Sync',
    colorClass: 'chain-feedback',
    gradient: 'from-indigo-500 to-indigo-600',
    description: 'Post-sale operations including inventory updates, fee tracking, and reviews',
    defaultSubNodes: [
      { 
        id: 'mark_sold', 
        name: 'mark_inventory_sold', 
        type: 'Tool', 
        description: 'Updates stock levels in internal DB',
        status: 'active'
      },
      { 
        id: 'deactivate_listings', 
        name: 'deactivate_other_listings', 
        type: 'Logic', 
        description: 'Removes item from other platforms once sold',
        status: 'active'
      },
      { 
        id: 'track_fees', 
        name: 'track_fees', 
        type: 'Finance Node', 
        description: 'Captures transaction fees, tax for accounting',
        status: 'active'
      },
      { 
        id: 'review_flow', 
        name: 'run_post_sale_review_flow', 
        type: 'Tool', 
        description: 'Requests reviews or automates post-sale sequence',
        status: 'active'
      }
    ]
  }
};

export const getChainConfig = (chainType: string): ChainConfig | null => {
  return CHAIN_CONFIGS[chainType] || null;
};

export const getAllChainTypes = (): string[] => {
  return Object.keys(CHAIN_CONFIGS);
};

export const getChainDescription = (chainType: string): string => {
  return CHAIN_CONFIGS[chainType]?.description || 'Unknown chain type';
};

export const getDefaultSubNodes = (chainType: string): SubNode[] => {
  return CHAIN_CONFIGS[chainType]?.defaultSubNodes || [];
}; 