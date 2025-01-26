'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import {
  type ChatResponse,
  getChat,
  sendMessage,
} from '@/services/chat/chatServices';
import { useUserStore } from '@/store/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, AlertTriangle, MoreVertical } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Message {
  sender: string;
  content: string;
  timestamp: string;
  senderName: string;
}

interface ChatBoxProps {
  initialChatId: string;
  onClose?: (chatId: string) => void;
  onNotify?: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  initialChatId,
  onClose,
  onNotify,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUserStore();
  const [propertyData, setPropertyData] = useState<ChatResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isChatClosed, setIsChatClosed] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);

  const params = useParams();
  const router = useRouter();

  const chatId =
    initialChatId ||
    (Array.isArray(params.chatsId) ? params.chatsId[0] : params.chatsId);

  useEffect(() => {
    if (!chatId || !user) return;

    const newSocket = io('https://havenly-chdr.onrender.com', {
      query: { userId: user._id, isAdmin: user.isAdmin ? 'true' : 'false' },
    });
    setSocket(newSocket);

    newSocket.emit('joinChat', chatId);

    return () => {
      newSocket.disconnect();
    };
  }, [chatId, user]);

  useEffect(() => {
    if (socket && chatId) {
      const fetchChat = async () => {
        const response = await getChat(chatId);
        if (response.status === 'success') {
          setMessages(response.data.messages);
          setPropertyData({
            ...response.data,
          });
        } else {
          console.error(response.message);
          router.push('/');
        }
      };

      fetchChat();

      socket.on('receiveMessage', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        if (onNotify) {
          onNotify(`New message from ${message.senderName}`);
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      socket.on('chatClosed', (data: { message: string }) => {
        setIsChatClosed(true);
        setIsNotificationVisible(true);
        if (onNotify) {
          onNotify('Chat has been closed');
        }
        toast.message('Chat Closed', {
          description: 'This chat has been closed by the admin.',
          duration: 5000,
          onAutoClose: () => setIsNotificationVisible(false),
        });
        setTimeout(() => {
          router.push('/');
        }, 5000);
      });

      return () => {
        socket.off('receiveMessage');
        socket.off('chatClosed');
      };
    }
  }, [socket, chatId, onNotify, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && chatId && user) {
      let senderName = '';
      senderName =
        propertyData?.propertyDetails.agentName || 'Unknown Agent';
      if (!user.isAdmin) {
        senderName = user.firstName + ' ' + user.lastName;
      }

      const messageData = {
        chatId,
        content: newMessage,
        sender: user.isAdmin ? 'Admin' : 'User',
        senderName,
      };
      try {
        const response = await sendMessage(messageData);
        if (response.status === 'success') {
          setNewMessage('');
        } else {
          console.error('Failed to send message:', response.message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const closeChat = () => {
    if (socket && chatId) {
      socket.emit('closeChat', chatId);
      if (onClose) {
        onClose(chatId);
      }
    }
  };

  const shortenName = (name: string, maxLength = 15) => {
    if (name.length <= maxLength) return name;
    return `${name.substring(0, maxLength)}...`;
  };

  return (
    <div className='flex flex-col h-full w-full max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden'>
      <div className='bg-primary_main text-primary-foreground p-4 flex justify-between items-center'>
        <div>
          <h2 className='text-xl font-semibold'>
            {propertyData?.propertyDetails.title || 'Chat'}
          </h2>
          <p className='text-sm opacity-80'>
            {propertyData?.propertyDetails.agentName} -{' '}
            {propertyData?.propertyDetails.companyName}
          </p>
        </div>
        {user?.isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <MoreVertical className='h-5 w-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Close Chat
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className='text-destructive'>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently close
                      the chat and notify all participants.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={closeChat}
                      className='bg-destructive'
                    >
                      Close Chat
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {isChatClosed && isNotificationVisible && (
        <div className='p-4 text-center text-destructive bg-destructive/10 flex items-center justify-between'>
          <div className='flex items-center'>
            <AlertTriangle className='mr-2 h-4 w-4' />
            <span>
              This chat has been closed. You will be redirected to the homepage
              shortly.
            </span>
          </div>
          <button
            onClick={() => setIsNotificationVisible(false)}
            className='text-sm font-semibold underline'
          >
            Dismiss
          </button>
        </div>
      )}
      <ScrollArea className='flex-grow p-4 space-y-4'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`flex items-end space-x-2 max-w-[80%] ${
                message.sender === 'User'
                  ? 'flex-row-reverse space-x-reverse'
                  : 'flex-row'
              }`}
            >
              <Avatar className='w-8 h-8 flex-shrink-0'>
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.senderName}`}
                />
                <AvatarFallback>
                  {message.senderName
                    ? message.senderName[0].toUpperCase()
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <div
                className={`p-3 rounded-2xl shadow-sm ${
                  message.sender === 'User'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                }`}
              >
                <p className='text-xs font-medium mb-1 opacity-75'>
                  {shortenName(message.senderName)}
                </p>
                <p className='text-sm break-words leading-snug'>
                  {message.content}
                </p>
                <p className='text-[10px] opacity-50 mt-1 text-right'>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className='p-4 bg-background border-t'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className='flex space-x-2'
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='Type your message'
            className='flex-grow'
            disabled={isChatClosed}
          />
          <Button
            type='submit'
            size='icon'
            className='bg-primary_main text-primary-foreground hover:bg-primary/90'
            disabled={isChatClosed}
          >
            <Send className='h-4 w-4' />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
