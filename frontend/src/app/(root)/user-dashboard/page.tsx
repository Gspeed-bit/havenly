'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, X, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ChatBox from '@/components/pages/Chat/ChatBox';
import { io, type Socket } from 'socket.io-client';
import { useUserStore } from '@/store/users';
import { getChatsByUser } from '@/services/chat/chatServices';

interface Notification {
  type: 'newMessage';
  message: string;
  chatId: string;
  propertyDetails?: {
    agentName?: string;
    companyName?: string;
    title?: string;
  };
}

const UserDashboardContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socket, setSocket] = useState<Socket | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeChats, setActiveChats] = useState<any[]>([]); // Change to store full chat data
  const [selectedChat, setSelectedChat] = useState<string | null>(
    searchParams.get('chatId')
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    const storedNotifications = JSON.parse(
      localStorage.getItem('notifications') || '[]'
    );
    const storedActiveChats = JSON.parse(
      localStorage.getItem('activeChats') || '[]'
    );
    setNotifications(storedNotifications);
    setActiveChats(storedActiveChats);
  }, []);

  const fetchActiveChats = useCallback(async () => {
    try {
      const response = await getChatsByUser();
      if (response.status === 'success' && Array.isArray(response.data)) {
        setActiveChats(response.data); // Set the full chat data here
        localStorage.setItem('activeChats', JSON.stringify(response.data));
      } else {
        console.error('Failed to fetch active chats:', response.message);
      }
    } catch (error) {
      console.error('Error fetching active chats:', error);
    }
  }, []);

  useEffect(() => {
    fetchActiveChats();
  }, [fetchActiveChats]);

  useEffect(() => {
    if (user) {
      const newSocket = io('https://havenly-chdr.onrender.com', {
        query: { userId: user._id, isAdmin: false },
      });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('User connected to Socket.io server');
      });

      newSocket.on(
        'newMessageNotification',
        (data: { message: string; chatId: string }) => {
          setNotifications((prev) => {
            const updatedNotifications: Notification[] = [
              ...prev,
              { type: 'newMessage', ...data },
            ];
            localStorage.setItem(
              'notifications',
              JSON.stringify(updatedNotifications)
            );
            return updatedNotifications;
          });
        }
      );

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const handleNotificationClick = (chatId: string) => {
    setSelectedChat(chatId);
    setIsMobileSidebarOpen(false);
    router.push(`/user-dashboard?chatId=${chatId}`);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const handleNotification = (message: string) => {
    toast(message, {
      position: 'top-right',
      duration: 3000,
    });
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className='h-full flex flex-col'>
          <div className='p-4 bg-primary_main text-primary-foreground flex justify-between items-center'>
            <h1 className='text-xl font-bold'>My Chats</h1>
            <Button
              variant='ghost'
              size='icon'
              className='lg:hidden'
              onClick={toggleMobileSidebar}
            >
              <X className='h-6 w-6' />
            </Button>
          </div>
          <ScrollArea className='flex-1 p-4'>
            <div className='space-y-4'>
              <h2 className='text-lg font-semibold flex items-center'>
                <MessageSquare className='h-5 w-5 mr-2 text-primary' />
                Active Chats
                {activeChats.length > 0 && (
                  <Badge variant='secondary' className='ml-2'>
                    {activeChats.length}
                  </Badge>
                )}
              </h2>
              <div className='space-y-2'>
                {activeChats.length > 0 ? (
                  activeChats.map((chat) => {
                    const agentName =
                      chat.propertyDetails?.agentName || 'Unknown Agent';
                    const chatId = chat._id;

                    return (
                      <Button
                        key={chatId}
                        onClick={() => handleNotificationClick(chatId)}
                        className={`w-full justify-start text-left p-2 rounded-lg transition-colors ${
                          selectedChat === chatId
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-gray-100'
                        }`}
                        variant='ghost'
                      >
                        <Avatar className='h-6 w-6 mr-3'>
                          <AvatarImage
                            src={`https://api.dicebear.com/6.x/initials/svg?seed=${agentName}`}
                          />
                          <AvatarFallback>
                            {agentName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col items-start overflow-hidden'>
                          <span className='text-sm truncate w-full'>
                            {agentName}
                          </span>
                        </div>
                      </Button>
                    );
                  })
                ) : (
                  <p className='text-muted-foreground text-center py-4'>
                    No active chats
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 flex flex-col overflow-hidden'>
        <header className='p-4 bg-white shadow-sm flex justify-between items-center lg:hidden'>
          <h1 className='text-xl font-bold'>My Chats</h1>
          <Button variant='outline' size='icon' onClick={toggleMobileSidebar}>
            <Menu className='h-6 w-6' />
          </Button>
        </header>
        <div className='flex-1 p-6 overflow-auto'>
          {selectedChat ? (
            <ChatBox
              initialChatId={selectedChat}
              onNotify={handleNotification}
            />
          ) : (
            <div className='h-full flex flex-col items-center justify-center text-muted-foreground'>
              <MessageSquare className='h-16 w-16 mb-4 text-primary opacity-50' />
              <p className='text-lg font-medium'>
                Select a chat to start messaging
              </p>
              <p className='text-sm mt-2'>
                Choose from your active chats in the sidebar
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default function UserDashboard() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <UserDashboardContent />
    </React.Suspense>
  );
}
