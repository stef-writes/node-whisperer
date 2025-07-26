import { useState } from 'react';
import WorkflowCanvas from '@/components/WorkflowCanvas';
import ChatInterface from '@/components/ChatInterface';

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
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Canvas Area */}
      <div className="flex-1 relative">
        <WorkflowCanvas 
          onNodeAdd={handleNodeAdd}
          onSelectionCreate={handleSelectionCreate}
        />
      </div>
      
      {/* Chat Interface */}
      <div className="w-80 flex-shrink-0">
        <ChatInterface 
          onNodeRequest={handleNodeRequest}
          currentScope={currentScope}
        />
      </div>
    </div>
  );
};

export default Index;
