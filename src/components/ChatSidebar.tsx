import { MessageCircle, X } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import ChatInterface from './ChatInterface';
import { ErrorBoundary } from './ErrorBoundary';

interface ChatSidebarProps {
  onNodeRequest?: (nodeData: any) => void;
  currentScope?: any;
}

export function ChatSidebar({ onNodeRequest, currentScope }: ChatSidebarProps) {
  const { open, setOpen } = useSidebar();

  return (
    <Sidebar 
      side="right" 
      className={`border-l border-border ${open ? 'w-80' : 'w-0'}`}
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-primary" />
            {open && <span className="font-medium text-sm">AI Assistant</span>}
          </div>
          {open && (
            <SidebarTrigger asChild>
              <button className="p-1 rounded hover:bg-muted">
                <X size={14} />
              </button>
            </SidebarTrigger>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-0">
        {open && (
          <ErrorBoundary>
            <ChatInterface 
              onNodeRequest={onNodeRequest}
              currentScope={currentScope}
            />
          </ErrorBoundary>
        )}
      </SidebarContent>
    </Sidebar>
  );
}