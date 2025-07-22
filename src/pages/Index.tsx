import { useState } from 'react';
import WorkflowCanvas from '@/components/WorkflowCanvas';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  const [nodeCount, setNodeCount] = useState(1);

  const handleNodeAdd = () => {
    setNodeCount(prev => prev + 1);
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Canvas Area */}
      <div className="flex-1 relative">
        <WorkflowCanvas onNodeAdd={handleNodeAdd} />
      </div>
      
      {/* Chat Interface */}
      <div className="w-80 flex-shrink-0">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
