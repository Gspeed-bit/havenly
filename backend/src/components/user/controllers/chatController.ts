// Chat Controller (chatController.ts)
import { Request, Response } from 'express';
import Chat, { IMessage } from '../models/chatModel';
import Property, { IProperty } from '@components/property/models/propertyModel';
import { Server } from 'socket.io';
import { sendChatSummaryEmail } from 'utils/emailUtils';

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
    // Notify user that the chat was started
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

    // Emit the message to the chat participants
    io.to(chatId).emit('receiveMessage', newMessage);

    // If the sender is not an admin, notify all admins
    if (sender !== 'Admin') {
      io.to('adminRoom').emit('newMessageNotification', {
        message: `New message from ${senderName} in chat ${chatId}`,
        chatId: chat._id,
      });
    }

    // Notify the user that a new message has been received
    if (sender !== 'Admin') {
      io.to(chat.users.filter((user) => user !== sender).join(',')).emit(
        'newMessageNotification',
        {
          message: `New message from ${senderName} in your chat.`,
          chatId: chat._id,
        }
      );
    }

    return res.status(200).json({ status: 'success', data: newMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
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
        path: 'propertyId', // Populate the property details
        select: 'title agent company', // Select the fields you want from the property
        populate: {
          path: 'company', // Populate the company details
          select: 'name', // Only select the company name
        },
      })
      .exec();

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Check if property is populated and cast it to IProperty type
    const property = chat.propertyId as unknown as IProperty;

    if (!property)
      return res.status(404).json({ message: 'Property not found' });

    // Extract the relevant property details
    const propertyDetails = {
      title: property.title,
      agentName: property.agent?.name,
      companyName: property.company?.name,
    };

    res.status(200).json({
      status: 'success',
      data: {
        chat,
        propertyDetails, // Include property details in the response
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
      .populate('adminId', 'email firstName lastName');

    if (!chat) return res.status(404).json({ message: 'Chat not found.' });

    if (
      !chat.users.some((u) => u._id.toString() === userId.toString()) &&
      chat.adminId._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    if (chat.isClosed)
      return res.status(400).json({ message: 'Chat already closed.' });

    // Mark the chat as closed
    chat.isClosed = true;
    await chat.save();

    // Notify clients
    io.to(chatId).emit('chatClosed', { message: 'This chat has been closed.' });

    // Send email summary to participants
    await sendChatSummaryEmail(chat);

    res.status(200).json({
      status: 'success',
      message: 'Chat closed successfully and summary sent.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};