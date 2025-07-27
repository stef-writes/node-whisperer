import { useState } from 'react';
import { Activity, Users, Zap, TrendingUp } from 'lucide-react';

interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  totalProcessed: number;
  avgResponseTime: number;
}

interface SystemStatusProps {
  metrics: SystemMetrics;
}

export default function SystemStatus({ metrics }: SystemStatusProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusItems = [
    {
      label: 'Active Agents',
      value: `${metrics.activeAgents}/${metrics.totalAgents}`,
      icon: Users,
      color: 'agent-nexus',
      trend: '+2'
    },
    {
      label: 'Processing',
      value: metrics.totalProcessed.toLocaleString(),
      icon: Activity,
      color: 'status-processing',
      trend: '+15%'
    },
    {
      label: 'Response Time',
      value: `${metrics.avgResponseTime}ms`,
      icon: Zap,
      color: 'status-active',
      trend: '-5ms'
    },
    {
      label: 'System Load',
      value: '67%',
      icon: TrendingUp,
      color: 'agent-quest',
      trend: '+3%'
    }
  ];

  return (
    <div className="absolute top-4 left-4 z-10">
      <div 
        className={`bg-card/90 backdrop-blur-sm border border-border rounded-xl shadow-lg transition-all duration-300 ${
          isExpanded ? 'w-80' : 'w-12'
        }`}
      >
        <div className="p-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 w-full text-left"
          >
            <div className="p-1.5 bg-primary/15 rounded-lg">
              <Activity size={16} className="text-primary" />
            </div>
            {isExpanded && (
              <div>
                <h3 className="font-medium text-sm text-foreground">System Status</h3>
                <p className="text-xs text-muted-foreground">Multi-agent network</p>
              </div>
            )}
          </button>
          
          {isExpanded && (
            <div className="mt-4 space-y-3 animate-fade-in">
              {statusItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="p-1 rounded"
                        style={{ backgroundColor: `hsl(var(--${item.color}) / 0.15)` }}
                      >
                        <Icon 
                          size={12} 
                          style={{ color: `hsl(var(--${item.color}))` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-foreground">{item.value}</span>
                      <span 
                        className="text-xs"
                        style={{ color: `hsl(var(--status-active))` }}
                      >
                        {item.trend}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {/* Network status indicator */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Network</span>
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-status-active animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}