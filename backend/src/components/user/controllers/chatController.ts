// Chat Controller (chatController.ts)
import { Request, Response } from 'express';
import Chat, { IMessage } from '../models/chatModel';
import Property from '@components/property/models/propertyModel';
import { Server } from 'socket.io';

export const startChat = async (req: Request, res: Response, io: Server) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const property = await Property.findById(propertyId);
    if (!property)
      return res.status(404).json({ message: 'Property not found.' });

    let chat = await Chat.findOneAndUpdate(
      { propertyId, users: userId, isClosed: false },
      { $setOnInsert: { adminId: property.adminId, messages: [] } },
      { upsert: true, new: true }
    );

    if (!chat) {
      chat = await Chat.create({
        propertyId,
        users: [userId],
        adminId: property.adminId,
        messages: [],
      });
    }

    // Emit to all admin sockets
    io.to('adminRoom').emit('newChatNotification', {
      message: 'A new chat has been started with a user.',
      chatId: chat._id,
    });

    res.status(201).json({ status: 'success', data: chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

export const sendMessage = async (req: Request, res: Response, io: Server) => {
  try {
    const { chatId, content, sender, senderName } = req.body;

    if (!chatId || !content || !sender || !senderName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (chat.isClosed) {
      return res.status(400).json({ message: 'Chat is closed' });
    }

    const newMessage: IMessage = {
      sender,
      content,
      timestamp: new Date(),
      senderName,
    };
    chat.messages.push(newMessage);
    await chat.save();

    // Emit the message to the chat participants
    io.to(chatId).emit('receiveMessage', newMessage);

    // If the sender is not an admin, notify all admins
    if (sender !== 'Admin') {
      io.to('adminRoom').emit('newMessageNotification', {
        message: `New message from ${senderName} in chat ${chatId}`,
        chatId: chat._id,
      });
    }

    return res.status(200).json({ status: 'success', data: newMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const closeChat = async (req: Request, res: Response, io: Server) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found.' });
    if (chat.adminId.toString() !== userId.toString())
      return res.status(403).json({ message: 'Access denied.' });

    chat.isClosed = true;
    await chat.save();

    io.to(chatId).emit('chatClosed', { message: 'This chat has been closed.' });

    io.to(chat.adminId.toString()).emit('chatClosedNotification', {
      message: 'The chat has been closed.',
      chatId,
    });

    res
      .status(200)
      .json({ status: 'success', message: 'Chat closed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

export const getChat = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const chat = await Chat.findById(chatId)
      .populate('users')
      .populate('adminId')
      .exec();

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    res.status(200).json({
      status: 'success',
      data: chat,
      messages: chat.messages,
      isClosed: chat.isClosed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Function to store a message
export const storeMessage = async (
  chatId: string,
  content: string,
  sender: string,
): Promise<IMessage> => {
  // Create the new message
  const newMessage: IMessage = {
    sender,
    content,
    timestamp: new Date(),
    senderName: '',
  };

  // Find the chat and push the new message to the messages array
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error('Chat not found');
  }

  // Add the new message to the messages array
  chat.messages.push(newMessage);
  await chat.save();

  return newMessage;
};
