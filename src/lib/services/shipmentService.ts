import { supabase } from '@/integrations/supabase/client';

export interface Shipment {
  id: string;
  shipper_id: string;
  carrier_id?: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  pickup_date: string;
  delivery_date: string;
  weight: number;
  rate: number;
  equipment_type: string;
  commodity: string;
  special_requirements?: string;
  status: string;
  bid_count: number;
  tracking_status: string;
  payment_status: string;
  created_at: string;
  shipper?: {
    id: string;
    full_name: string;
  };
  carrier?: {
    id: string;
    full_name: string;
  };
}

export interface CreateShipmentData {
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  pickup_date: string;
  delivery_date: string;
  weight: string;
  rate: string;
  equipment_type: string;
  commodity: string;
  special_requirements?: string;
}

export class ShipmentService {
  // Get available shipments for carriers
  static async getAvailableShipments(): Promise<Shipment[]> {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select(`
          *,
          shipper:profiles!shipments_shipper_id_fkey(
            id,
            full_name
          )
        `)
        .eq('status', 'posted')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching available shipments:', error);
      throw error;
    }
  }

  // Get shipper's shipments
  static async getShipperShipments(shipperId: string): Promise<Shipment[]> {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select(`
          *,
          shipper:profiles!shipments_shipper_id_fkey(
            id,
            full_name
          ),
          carrier:profiles!shipments_carrier_id_fkey(
            id,
            full_name
          )
        `)
        .eq('shipper_id', shipperId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching shipper shipments:', error);
      throw error;
    }
  }

  // Get carrier's shipments
  static async getCarrierShipments(carrierId: string): Promise<Shipment[]> {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select(`
          *,
          shipper:profiles!shipments_shipper_id_fkey(
            id,
            full_name
          )
        `)
        .eq('carrier_id', carrierId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching carrier shipments:', error);
      throw error;
    }
  }

  // Create new shipment
  static async createShipment(shipmentData: CreateShipmentData, shipperId: string): Promise<Shipment> {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .insert({
          ...shipmentData,
          weight: parseInt(shipmentData.weight),
          rate: parseFloat(shipmentData.rate),
          shipper_id: shipperId,
          status: 'posted',
          bid_count: 0
        })
        .select(`
          *,
          shipper:profiles!shipments_shipper_id_fkey(
            id,
            full_name
          )
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw error;
    }
  }

  // Get shipment by ID
  static async getShipmentById(shipmentId: string): Promise<Shipment | null> {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select(`
          *,
          shipper:profiles!shipments_shipper_id_fkey(
            id,
            full_name
          ),
          carrier:profiles!shipments_carrier_id_fkey(
            id,
            full_name
          )
        `)
        .eq('id', shipmentId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching shipment:', error);
      throw error;
    }
  }

  // Update shipment status
  static async updateShipmentStatus(shipmentId: string, status: string, carrierId?: string): Promise<void> {
    try {
      const updateData: any = { status };
      if (carrierId) {
        updateData.carrier_id = carrierId;
      }

      const { error } = await supabase
        .from('shipments')
        .update(updateData)
        .eq('id', shipmentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating shipment status:', error);
      throw error;
    }
  }

  // Get shipments by status
  static async getShipmentsByStatus(status: string): Promise<Shipment[]> {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select(`
          *,
          shipper:profiles!shipments_shipper_id_fkey(
            id,
            full_name
          ),
          carrier:profiles!shipments_carrier_id_fkey(
            id,
            full_name
          )
        `)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching shipments by status:', error);
      throw error;
    }
  }

  // Search shipments
  static async searchShipments(query: string): Promise<Shipment[]> {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select(`
          *,
          shipper:profiles!shipments_shipper_id_fkey(
            id,
            full_name
          )
        `)
        .or(`origin_city.ilike.%${query}%,destination_city.ilike.%${query}%,commodity.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching shipments:', error);
      throw error;
    }
  }

  // Get shipment statistics
  static async getShipmentStats(userId: string, role: string): Promise<any> {
    try {
      let query = supabase
        .from('shipments')
        .select('status');

      if (role === 'shipper') {
        query = query.eq('shipper_id', userId);
      } else if (role === 'carrier') {
        query = query.eq('carrier_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        posted: data?.filter(s => s.status === 'posted').length || 0,
        assigned: data?.filter(s => s.status === 'assigned').length || 0,
        in_transit: data?.filter(s => s.status === 'in_transit').length || 0,
        delivered: data?.filter(s => s.status === 'delivered').length || 0,
        cancelled: data?.filter(s => s.status === 'cancelled').length || 0
      };

      return stats;
    } catch (error) {
      console.error('Error fetching shipment stats:', error);
      throw error;
    }
  }
} 