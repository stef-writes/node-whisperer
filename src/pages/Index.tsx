import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import WorkflowCanvas from '@/components/WorkflowCanvas';
import ChatInterface from '@/components/ChatInterface';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChatSidebar } from '@/components/ChatSidebar';

const Index = () => {
  const [nodeCount, setNodeCount] = useState(1);
  const [currentScope, setCurrentScope] = useState<any>(null);

  const handleNodeAdd = () => {
    setNodeCount(prev => prev + 1);
  };

  const handleSelectionCreate = (selection: any) => {
    setCurrentScope(selection);
    console.log('Canvas selection created:', selection);
  };

  const handleNodeRequest = (nodeData: any) => {
    console.log('Node requested from chat:', nodeData);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="h-screen flex bg-background overflow-hidden w-full">
        {/* Header with Chat Toggle */}
        <header className="absolute top-4 right-4 z-50">
          <SidebarTrigger className="bg-card border border-border shadow-lg hover:bg-muted">
            <MessageCircle size={16} />
          </SidebarTrigger>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <ErrorBoundary>
            <WorkflowCanvas 
              onNodeAdd={handleNodeAdd}
              onSelectionCreate={handleSelectionCreate}
            />
          </ErrorBoundary>
        </div>
        
        {/* Collapsible Chat Sidebar */}
        <ChatSidebar 
          onNodeRequest={handleNodeRequest}
          currentScope={currentScope}
        />
        
        {/* Global shortcuts hint */}
        <div className="absolute bottom-4 left-4 z-50 opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-card border border-border rounded-lg p-2 shadow-lg text-xs text-muted-foreground">
            <div className="font-medium mb-1">Shortcuts:</div>
            <div>Shift + Drag: Select region</div>
            <div>Escape: Clear selections</div>
            <div>Space + Drag: Pan canvas</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
