import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, MessageCircle, Code, AlertTriangle, Tag } from 'lucide-react';

interface SelectionArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  nodes: string[];
  label?: string;
}

interface CanvasSelectorProps {
  onSelectionCreate: (selection: any) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export function CanvasSelector({ onSelectionCreate, canvasRef }: CanvasSelectorProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [currentSelection, setCurrentSelection] = useState<SelectionArea | null>(null);
  const [activeSelections, setActiveSelections] = useState<SelectionArea[]>([]);
  const selectionRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsSelecting(true);
    setSelectionStart({ x, y });
    setCurrentSelection({
      id: `selection-${Date.now()}`,
      x,
      y,
      width: 0,
      height: 0,
      nodes: []
    });
  }, [canvasRef]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isSelecting || !selectionStart || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const width = Math.abs(currentX - selectionStart.x);
    const height = Math.abs(currentY - selectionStart.y);
    const x = Math.min(currentX, selectionStart.x);
    const y = Math.min(currentY, selectionStart.y);
    
    setCurrentSelection(prev => prev ? {
      ...prev,
      x,
      y,
      width,
      height
    } : null);
  }, [isSelecting, selectionStart, canvasRef]);

  const handleMouseUp = useCallback(() => {
    if (!currentSelection || currentSelection.width < 20 || currentSelection.height < 20) {
      setIsSelecting(false);
      setSelectionStart(null);
      setCurrentSelection(null);
      return;
    }

    // Create scope object
    const scopeObject = {
      id: currentSelection.id,
      type: 'region' as const,
      targets: {
        nodes: currentSelection.nodes,
        chains: []
      },
      bbox: `${currentSelection.x},${currentSelection.y},${currentSelection.x + currentSelection.width},${currentSelection.y + currentSelection.height}`,
      labels: [],
      notes: '',
      contextText: `Canvas region: ${Math.round(currentSelection.width)}x${Math.round(currentSelection.height)} pixels`
    };

    setActiveSelections(prev => [...prev, currentSelection]);
    onSelectionCreate(scopeObject);
    
    setIsSelecting(false);
    setSelectionStart(null);
    setCurrentSelection(null);
  }, [currentSelection, onSelectionCreate]);

  const handleContextMenu = useCallback((selection: SelectionArea, e: React.MouseEvent) => {
    e.preventDefault();
    // Context menu actions would go here
    console.log('Context menu for selection:', selection.id);
  }, []);

  const removeSelection = useCallback((selectionId: string) => {
    setActiveSelections(prev => prev.filter(s => s.id !== selectionId));
  }, []);

  return (
    <>
      {/* Selection overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ 
          pointerEvents: 'all',
          cursor: isSelecting ? 'crosshair' : 'default'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Current selection being drawn */}
        {currentSelection && (
          <div
            className="absolute border-2 border-dashed border-blue-500 bg-blue-500/10 pointer-events-none"
            style={{
              left: currentSelection.x,
              top: currentSelection.y,
              width: currentSelection.width,
              height: currentSelection.height,
            }}
          />
        )}
        
        {/* Active selections */}
        {activeSelections.map((selection) => (
          <div
            key={selection.id}
            className="absolute border-2 border-dashed border-purple-500 bg-purple-500/5 group cursor-pointer"
            style={{
              left: selection.x,
              top: selection.y,
              width: selection.width,
              height: selection.height,
            }}
            onContextMenu={(e) => handleContextMenu(selection, e)}
          >
            {/* Selection controls */}
            <div className="absolute -top-8 left-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge variant="secondary" className="text-xs">
                <Target size={10} className="mr-1" />
                Scope {selection.id.split('-')[1]?.slice(-4)}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => removeSelection(selection.id)}
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Selection toolbar */}
      {activeSelections.length > 0 && (
        <div className="absolute top-4 left-4 z-20 bg-card border border-border rounded-lg p-2 shadow-lg">
          <div className="flex items-center gap-2 text-xs">
            <Target size={12} className="text-purple-500" />
            <span className="text-muted-foreground">
              {activeSelections.length} region{activeSelections.length > 1 ? 's' : ''} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-xs"
              onClick={() => setActiveSelections([])}
            >
              Clear All
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {activeSelections.map((selection) => (
              <Button
                key={selection.id}
                size="sm"
                variant="ghost"
                className="h-6 text-xs p-1"
                onClick={() => removeSelection(selection.id)}
              >
                <Badge variant="outline" className="text-xs">
                  {selection.id.split('-')[1]?.slice(-4)}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}