import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Button } from '@/components/ui/button';
import { Copy, Download, Maximize2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MermaidDiagramProps {
  chart: string;
  title?: string;
  metadata?: {
    chains?: number;
    nodes?: number;
    tools?: number;
    llmNodes?: number;
    agents?: number;
  };
  onAddToCanvas?: () => void;
  className?: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chart,
  title,
  metadata,
  onAddToCanvas,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagramId] = useState(() => `mermaid-${Date.now()}-${Math.random().toString(36).substring(2)}`);

  useEffect(() => {
    if (!containerRef.current || !chart) return;

    const renderDiagram = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize mermaid with custom theme
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeCSS: `
            .nodeLabel { 
              color: #1f2937 !important; 
              font-family: ui-monospace, SFMono-Regular, monospace !important;
              font-size: 12px !important;
              font-weight: 500 !important;
            }
            .edgeLabel { 
              color: #6b7280 !important; 
              font-size: 10px !important;
              background-color: rgba(255, 255, 255, 0.9) !important;
              padding: 2px 4px !important;
              border-radius: 3px !important;
            }
            .flowchart-link { 
              stroke: #6b7280 !important; 
              stroke-width: 2px !important;
            }
            /* Node type styling based on classes */
            .chain { fill: #dbeafe !important; stroke: #3b82f6 !important; }
            .tool { fill: #dcfce7 !important; stroke: #16a34a !important; }
            .llm { fill: #fef3c7 !important; stroke: #d97706 !important; }
            .hitl { fill: #fce7f3 !important; stroke: #ec4899 !important; stroke-dasharray: 5,5 !important; }
            .system { fill: #ede9fe !important; stroke: #8b5cf6 !important; }
            .agent { fill: #e0f2fe !important; stroke: #0891b2 !important; }
          `,
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          fontSize: 12,
          sequence: { useMaxWidth: true },
          gantt: { useMaxWidth: true },
          er: { useMaxWidth: true },
          journey: { useMaxWidth: true },
          timeline: { useMaxWidth: true },
          gitgraph: { useMaxWidth: true },
          c4: { useMaxWidth: true },
          sankey: { useMaxWidth: true },
          block: { useMaxWidth: true },
          packet: { useMaxWidth: true }
        });

        // Clear the container
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Parse and render the diagram
        const { svg } = await mermaid.render(diagramId, chart);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          
          // Add click handlers for interactivity
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            
            // Add hover effects
            const nodes = svgElement.querySelectorAll('.node');
            nodes.forEach(node => {
              node.addEventListener('mouseenter', () => {
                node.setAttribute('opacity', '0.8');
              });
              node.addEventListener('mouseleave', () => {
                node.setAttribute('opacity', '1');
              });
            });
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError('Failed to render diagram. Please check the syntax.');
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(renderDiagram, 100);
    return () => clearTimeout(debounceTimer);
  }, [chart, diagramId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      toast({
        title: "Copied!",
        description: "Mermaid diagram code copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleDownload = () => {
    const svgElement = containerRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${title || 'diagram'}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    };

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    // Force re-render by updating key
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
  };

  return (
    <div className={`bg-card/50 border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs font-medium">{title || 'Workflow Diagram'}</span>
          {metadata && (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-muted-foreground">|</span>
              <span className="text-xs text-muted-foreground">
                {metadata.nodes} nodes • {metadata.chains} chains
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw size={10} className={isLoading ? 'animate-spin' : ''} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs"
            onClick={handleCopy}
          >
            <Copy size={10} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs"
            onClick={handleDownload}
          >
            <Download size={10} />
          </Button>
          {onAddToCanvas && (
            <Button
              size="sm"
              variant="default"
              className="h-6 px-2 text-xs ml-1"
              onClick={onAddToCanvas}
            >
              <Maximize2 size={10} className="mr-1" />
              Add to Canvas
            </Button>
          )}
        </div>
      </div>

      {/* Diagram Container */}
      <div className="relative bg-white/50 dark:bg-card/20">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw size={16} className="animate-spin" />
              Rendering diagram...
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm">
            <div className="text-center p-4">
              <div className="text-sm text-red-500 mb-2">{error}</div>
              <Button size="sm" variant="outline" onClick={handleRefresh}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          className="p-4 min-h-[200px] w-full overflow-auto"
          style={{ 
            display: isLoading || error ? 'none' : 'block'
          }}
        />
      </div>

      {/* Metadata Footer */}
      {metadata && (
        <div className="px-4 py-2 border-t border-border/50 bg-muted/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
            {metadata.chains && <div>Chains: <span className="font-mono">{metadata.chains}</span></div>}
            {metadata.nodes && <div>Nodes: <span className="font-mono">{metadata.nodes}</span></div>}
            {metadata.tools && <div>Tools: <span className="font-mono">{metadata.tools}</span></div>}
            {metadata.llmNodes && <div>LLM Nodes: <span className="font-mono">{metadata.llmNodes}</span></div>}
            {metadata.agents && <div>Agents: <span className="font-mono">{metadata.agents}</span></div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MermaidDiagram;