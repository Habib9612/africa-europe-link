import { NextApiRequest, NextApiResponse } from 'next';

// In-memory storage for accepted loads (replace with actual database)
let acceptedLoads: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { loadId, carrierId, carrierName, acceptedAt } = req.body;

      if (!loadId || !carrierId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Load ID and Carrier ID are required' 
        });
      }

      // Create accepted load record
      const acceptedLoad = {
        id: Date.now().toString(),
        loadId,
        carrierId,
        carrierName: carrierName || 'Unknown Carrier',
        acceptedAt: acceptedAt || new Date().toISOString(),
        status: 'accepted',
        createdAt: new Date().toISOString()
      };

      acceptedLoads.push(acceptedLoad);

      console.log('Load accepted:', acceptedLoad);

      return res.status(200).json({
        success: true,
        message: 'Load accepted successfully!',
        data: acceptedLoad
      });

    } catch (error) {
      console.error('Error accepting load:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to accept load'
      });
    }
  } else if (req.method === 'GET') {
    // Get all accepted loads
    return res.status(200).json({
      success: true,
      data: acceptedLoads
    });
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} not allowed` 
    });
  }
}