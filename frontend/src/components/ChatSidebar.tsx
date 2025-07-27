import { MessageCircle, X, GripVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import { ErrorBoundary } from './ErrorBoundary';

interface ChatSidebarProps {
  onNodeRequest?: (nodeData: any) => void;
  currentScope?: any;
}

export function ChatSidebar({ onNodeRequest, currentScope }: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidth] = useState(480); // Default width
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 320 && newWidth <= 800) {
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-4 z-50 p-2 bg-card border border-border rounded-lg shadow-lg hover:bg-muted transition-colors"
      >
        <MessageCircle size={16} />
      </button>
    );
  }

  return (
    <div 
      ref={sidebarRef}
      className="fixed right-0 top-0 h-full bg-background border-l border-border shadow-xl z-40 flex"
      style={{ width: `${width}px` }}
    >
      {/* Resize Handle */}
      <div
        className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors flex items-center justify-center"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute left-0 w-4 h-full flex items-center justify-center">
          <GripVertical size={16} className="text-muted-foreground opacity-0 hover:opacity-100 transition-opacity" />
        </div>
      </div>
      
      {/* Sidebar Content */}
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-card/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium text-sm text-foreground">Frosty AI</span>
            <span className="text-xs text-muted-foreground">Ready</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        
        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ErrorBoundary>
            <ChatInterface 
              onNodeRequest={onNodeRequest}
              currentScope={currentScope}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}