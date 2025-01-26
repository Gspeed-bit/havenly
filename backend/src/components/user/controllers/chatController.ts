// Chat Controller (chatController.ts)
import { Request, Response } from 'express';
import Chat, { IMessage } from '../models/chatModel';
import Property, { IProperty } from '@components/property/models/propertyModel';
import { Server } from 'socket.io';
import { sendChatSummaryEmail } from 'utils/email/emailUtils';

export const startChat = async (req: Request, res: Response, io: Server) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const property = await Property.findById(propertyId);
    if (!property)
      return res.status(404).json({ message: 'Property not found.' });

    let chat = await Chat.findOne({
      propertyId,
      users: userId,
      isClosed: false,
    });

    if (!chat) {
      chat = await Chat.create({
        propertyId,
        users: [userId],
        adminId: property.adminId, // Assign the specific admin to the chat
        messages: [],
      });
    }

    // Notify the specific admin
    io.to(`admin-${property.adminId}`).emit('newChatNotification', {
      message: `A new chat has been started for property "${property.title}".`,
      chatId: chat._id,
    });

    // Notify the user
    io.to(userId).emit('chatStartedNotification', {
      message: 'Your chat with the admin has started.',
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

    io.to(chatId).emit('receiveMessage', newMessage);

    if (sender !== chat.adminId.toString()) {
      io.to(`admin-${chat.adminId}`).emit('newMessageNotification', {
        message: `New message from ${senderName} in chat ${chatId}.`,
        chatId: chat._id,
      });
    }

    res.status(200).json({ status: 'success', data: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
      .populate({
        path: 'propertyId',
        select: 'title agent company',
        populate: {
          path: 'company',
          select: 'name',
        },
      })
      .exec();

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Check if the user is the admin of the property or a participant in the chat
    const property = chat.propertyId as unknown as IProperty;
    const isAdmin = chat.adminId._id.toString() === userId.toString();
    const isUserInChat = chat.users.some(
      (u) => u._id.toString() === userId.toString()
    );

    if (!isUserInChat && !isAdmin) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const propertyDetails = {
      title: property.title,
      agentName: property.agent?.name,
      companyName: property.company?.name,
    };

    res.status(200).json({
      status: 'success',
      data: {
        chat,
        propertyDetails,
      },
      messages: chat.messages,
      isClosed: chat.isClosed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

export const closeChat = async (req: Request, res: Response, io: Server) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const chat = await Chat.findById(chatId)
      .populate('users', 'email firstName lastName')
      .populate('adminId', 'email ')
      .populate({
        path: 'propertyId',
        select: 'agent',
      });
    if (!chat) return res.status(404).json({ message: 'Chat not found.' });

    const isAdmin = chat.adminId._id.toString() === userId.toString();
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    if (chat.isClosed)
      return res.status(400).json({ message: 'Chat already closed.' });

    chat.isClosed = true;
    await chat.save();

    io.to(chatId).emit('chatClosed', { message: 'This chat has been closed.' });

    await sendChatSummaryEmail(chat);
    const property = chat.propertyId as unknown as IProperty;
    const agent = property.agent;

    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({
      status: 'success',
      message: 'Chat closed successfully and summary sent.',
      agentName: agent?.name || 'No agent assigned',
      agentContact: agent?.contact || 'No contact available',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

export const getChatsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fetch all chats where the user is a participant
    const chats = await Chat.find({ users: userId, isClosed: false })
      .populate('users', 'firstName lastName')
      .populate('adminId', 'firstName lastName')
      .populate({
        path: 'propertyId',
        select: 'title agent company',
        populate: [
          {
            path: 'agent',
            select: 'name contact',
          },
          {
            path: 'company',
            select: 'name',
          },
        ],
      })
      .exec();

    // Map the response to match the frontend's expected structure
    const formattedChats = chats.map((chat) => {
      const property = chat.propertyId as unknown as IProperty;

      return {
        _id: chat._id, // Move _id to the top level
        propertyDetails: {
          title: property.title,
          agentName: property.agent?.name || 'Unknown Agent',
          companyName: property.company?.name || 'Unknown Company',
        },
        messages: chat.messages,
        isClosed: chat.isClosed,
      };
    });

    console.log('Formatted chats:', formattedChats); // Log the formatted chats

    // Return the response with data as an array direct
    res.status(200).json(formattedChats); // Remove the `status` and `data` wrapper
  } catch (error) {
    console.error('Error fetching chats by user:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
