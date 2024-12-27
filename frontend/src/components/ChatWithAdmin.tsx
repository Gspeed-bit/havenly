import {
  ChatResponse,
  getChat,
  MessageResponse,
  sendMessage,
} from '@/services/chat/chatServices';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

const ChatPage = () => {
  const router = useRouter();
  const { chatId } = router.query;
  const [messages, setMessages] = useState<ChatResponse['messages']>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [alertState, setAlertState] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Fetch chat messages and initialize socket
  useEffect(() => {
    if (!chatId) return;

    // Initialize socket connection
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      query: { chatId },
    });

    socket.emit('joinChat', { chatId });

    socket.on('receiveMessage', (message: MessageResponse) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup socket on unmount
    return () => {
      socket.disconnect();
    };
  }, [chatId]);

  // Fetch chat messages from API
  useEffect(() => {
    if (chatId) {
      const fetchMessages = async () => {
        try {
          const response = await getChat(chatId as string);
          if (response.status === 'success' && response.data) {
            setMessages(response.data.messages);
            setAlertState({ type: 'success', message: '' });
          } else {
            setAlertState({ type: 'error', message: response.message });
            console.error('Error fetching messages:', response.message);
          }
        } catch (error) {
          setAlertState({ type: 'error', message: 'Failed to fetch chat messages.' });
          console.error('Error fetching chat:', error);
        }
      };

      fetchMessages();
    }
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    const messagePayload = {
      chatId: chatId as string,
      content: newMessage,
    };

    try {
      // Send message using the API function
      const response = await sendMessage(messagePayload);
      if (response.status === 'success' && response.data) {
        socket.emit('sendMessage', response.data); // Emit the new message via socket
        setMessages((prev) => [...prev, response.data]); // Optimistically update UI
        setNewMessage('');
      } else {
        console.error('Error sending message:', response.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      {alertState.message && (
        <div
          className={`alert ${alertState.type === 'success' ? 'alert-success' : 'alert-error'}`}
        >
          {alertState.message}
        </div>
      )}
      <div className='messages'>
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'user' : 'admin'}>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <div className='sendMessage'>
        <input
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
