import { NextApiRequest, NextApiResponse } from 'next';

// In-memory storage for messages (replace with actual database)
let messages: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { senderId, receiverId, message, senderName, receiverName, conversationId } = req.body;

      if (!senderId || !receiverId || !message) {
        return res.status(400).json({ 
          success: false, 
          message: 'Sender ID, Receiver ID, and message are required' 
        });
      }

      // Create message record
      const newMessage = {
        id: Date.now().toString(),
        senderId,
        receiverId,
        message,
        senderName: senderName || 'Unknown Sender',
        receiverName: receiverName || 'Unknown Receiver',
        conversationId: conversationId || `${senderId}-${receiverId}`,
        timestamp: new Date().toISOString(),
        read: false,
        createdAt: new Date().toISOString()
      };

      messages.push(newMessage);

      console.log('Message sent:', newMessage);

      return res.status(200).json({
        success: true,
        message: 'Message sent successfully!',
        data: newMessage
      });

    } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send message'
      });
    }
  } else if (req.method === 'GET') {
    const { conversationId, userId } = req.query;
    
    let filteredMessages = messages;
    
    if (conversationId) {
      filteredMessages = messages.filter(msg => msg.conversationId === conversationId);
    } else if (userId) {
      filteredMessages = messages.filter(msg => 
        msg.senderId === userId || msg.receiverId === userId
      );
    }
    
    return res.status(200).json({
      success: true,
      data: filteredMessages.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
    });
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} not allowed` 
    });
  }
}