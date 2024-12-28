import express from 'express';
import {
  startChat,
  sendMessage,
  closeChat,
  getChat,
 
} from '../controllers/chatController';
import {
  adminMiddleware,
  userMiddleware,
} from '@middleware/userAndAdminMiddleware/protect';
import { Server } from 'socket.io';

const router = express.Router();

export default (io: Server) => {
  // Start a chat
  router.post('/chats/start', userMiddleware, (req, res) =>
    startChat(req, res, io)
  );

  // Send a message
  router.post('/chats/message', userMiddleware, (req, res) =>
    sendMessage(req, res, io)
  );

  // Close a chat (admin-only)
  router.put(
    '/chats/:chatId/close',
    userMiddleware,
    adminMiddleware,
    (req, res) => closeChat(req, res, io)
  );

  router.get('/chats/:chatId', userMiddleware, getChat);

  return router;
};
