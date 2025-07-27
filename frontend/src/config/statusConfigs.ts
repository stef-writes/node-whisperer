import { 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Pause,
  XCircle,
  Loader2
} from 'lucide-react';
import { StatusConfig } from '@/types/workflow';

export const STATUS_CONFIGS: Record<string, StatusConfig> = {
  active: { 
    icon: CheckCircle, 
    color: 'status-active', 
    label: 'Active',
    description: 'Chain is running and processing items'
  },
  processing: { 
    icon: Activity, 
    color: 'status-processing', 
    label: 'Processing',
    description: 'Chain is actively working on items'
  },
  idle: { 
    icon: Clock, 
    color: 'status-idle', 
    label: 'Idle',
    description: 'Chain is waiting for new items to process'
  },
  error: { 
    icon: AlertCircle, 
    color: 'status-error', 
    label: 'Error',
    description: 'Chain has encountered an error and stopped'
  },
  paused: { 
    icon: Pause, 
    color: 'status-idle', 
    label: 'Paused',
    description: 'Chain has been manually paused'
  },
  stopped: { 
    icon: XCircle, 
    color: 'status-error', 
    label: 'Stopped',
    description: 'Chain has been manually stopped'
  },
  starting: { 
    icon: Loader2, 
    color: 'status-processing', 
    label: 'Starting',
    description: 'Chain is initializing and starting up'
  }
};

export const getStatusConfig = (status: string): StatusConfig | null => {
  return STATUS_CONFIGS[status] || null;
};

export const getStatusIcon = (status: string) => {
  return STATUS_CONFIGS[status]?.icon || AlertCircle;
};

export const getStatusColor = (status: string): string => {
  return STATUS_CONFIGS[status]?.color || 'status-error';
};

export const getStatusLabel = (status: string): string => {
  return STATUS_CONFIGS[status]?.label || 'Unknown';
};

export const getStatusDescription = (status: string): string => {
  return STATUS_CONFIGS[status]?.description || 'Unknown status';
};

export const getAllStatuses = (): string[] => {
  return Object.keys(STATUS_CONFIGS);
}; 