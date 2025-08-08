import { NextApiRequest, NextApiResponse } from 'next';

// Mock conversations data
let conversations = [
  {
    id: 'conv-1',
    participants: ['ahmed-mansouri', 'current-user'],
    lastMessage: {
      text: 'Shipment is on schedule, ETA 2 hours',
      timestamp: new Date().toISOString(),
      senderId: 'ahmed-mansouri'
    },
    unreadCount: 2,
    participantInfo: {
      'ahmed-mansouri': {
        name: 'Ahmed El Mansouri',
        role: 'Carrier',
        avatar: 'AM'
      }
    }
  },
  {
    id: 'conv-2',
    participants: ['sarah-johnson', 'current-user'],
    lastMessage: {
      text: 'Can we schedule pickup for tomorrow?',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      senderId: 'sarah-johnson'
    },
    unreadCount: 0,
    participantInfo: {
      'sarah-johnson': {
        name: 'Sarah Johnson',
        role: 'Shipper',
        avatar: 'SJ'
      }
    }
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    
    let userConversations = conversations;
    
    if (userId) {
      userConversations = conversations.filter(conv => 
        conv.participants.includes(userId as string)
      );
    }
    
    return res.status(200).json({
      success: true,
      data: userConversations.sort((a, b) => 
        new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
      )
    });
  } else if (req.method === 'POST') {
    try {
      const { participants, initialMessage } = req.body;
      
      const newConversation = {
        id: `conv-${Date.now()}`,
        participants,
        lastMessage: initialMessage || {
          text: 'Conversation started',
          timestamp: new Date().toISOString(),
          senderId: participants[0]
        },
        unreadCount: 0,
        participantInfo: {}
      };
      
      conversations.push(newConversation);
      
      return res.status(200).json({
        success: true,
        data: newConversation
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create conversation'
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} not allowed` 
    });
  }
}