'use client';
import { Suspense } from 'react';
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ChatBox from '@/components/pages/Chat/ChatBox';
import { io, Socket } from 'socket.io-client';
import { useUserStore } from '@/store/users';
import { getChatsByUser } from '@/services/chat/chatServices';

interface Notification {
  type: 'newMessage';
  message: string;
  chatId: string;
}

const UserDashboardContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socket, setSocket] = useState<Socket | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeChats, setActiveChats] = useState<string[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(
    searchParams.get('chatId')
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user } = useUserStore();

  // Initialize state from localStorage after component mounts
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

  // Fetch active chats for the user
const fetchActiveChats = useCallback(async () => {
  try {
    console.log('Fetching active chats...');
    const response = await getChatsByUser();
    console.log('Response from backend:', response); // Log the response

    if (response.status === 'success') {
      // Ensure response.data is an array
      if (Array.isArray(response.data)) {
        console.log('Response data is an array:', response.data);
        const chatIds = response.data.map((chat) => chat.data._id);
        console.log(`Found ${chatIds.length} active chats`);
        setActiveChats(chatIds);
        localStorage.setItem('activeChats', JSON.stringify(chatIds));
      } else {
        console.error('Unexpected response format:', response.data);
      }
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

  // Log active chats when updated
  useEffect(() => {
    console.log('Active chats updated:', activeChats);
  }, [activeChats]);

  // Initialize socket connection
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
          console.log('New message notification received:', data);
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

  // Handle notification click
  const handleNotificationClick = (chatId: string) => {
    setSelectedChat(chatId);
    setIsMobileSidebarOpen(false);
    router.push(`/dashboard?chatId=${chatId}`);
  };

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  // Handle notifications
  const handleNotification = (message: string) => {
    toast(message, {
      position: 'top-right',
      duration: 3000,
    });
  };

  return (
    <div className='flex flex-col md:flex-row h-screen bg-gray-100'>
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-[24rem] bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className='h-full flex flex-col'>
          <div className='p-4 bg-primary_main text-primary-foreground flex justify-between items-center'>
            <h1 className='text-xl font-bold'>My Chats</h1>
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden'
              onClick={toggleMobileSidebar}
            >
              <X className='h-6 w-6' />
            </Button>
          </div>
          <div className='flex-1 overflow-hidden'>
            <div className='p-4 space-y-4'>
              <h2 className='text-lg font-semibold mb-2 flex items-center'>
                <MessageSquare className='h-5 w-5 mr-2 text-primary' />
                Active Chats
                {activeChats.length > 0 && (
                  <Badge variant='secondary' className='ml-2'>
                    {activeChats.length}
                  </Badge>
                )}
              </h2>
              <ScrollArea className='h-[calc(100vh-200px)] pr-2'>
                {activeChats.map((chatId) => (
                  <Button
                    key={chatId}
                    onClick={() => handleNotificationClick(chatId)}
                    className={`w-full justify-start text-left p-2 mb-2 rounded-lg transition-colors ${
                      selectedChat === chatId
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-gray-100'
                    }`}
                    variant='ghost'
                  >
                    <Avatar className='h-5 w-5 mr-3'>
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${chatId}`}
                      />
                      <AvatarFallback>
                        {chatId.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col items-start'>
                      <span className='font-medium'>Chat {chatId}</span>
                      <span className='text-xs text-muted-foreground'>
                        Last message...
                      </span>
                    </div>
                  </Button>
                ))}
                {activeChats.length === 0 && (
                  <p className='text-muted-foreground text-center py-4'>
                    No active chats
                  </p>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        <div className='p-4 bg-white shadow-sm flex justify-between items-center md:hidden'>
          <h1 className='text-xl font-bold'>My Chats</h1>
          <Button variant='outline' size='icon' onClick={toggleMobileSidebar}>
            <MessageSquare className='h-6 w-6' />
          </Button>
        </div>
        <div className='flex-1 p-4 overflow-auto'>
          {selectedChat ? (
            <ChatBox
              initialChatId={selectedChat}
              onNotify={handleNotification}
            />
          ) : (
            <div className='h-full flex items-center justify-center text-muted-foreground'>
              <MessageSquare className='h-8 w-8 mr-2 text-primary opacity-50' />
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function UserDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserDashboardContent />
    </Suspense>
  );
}
