import { supabase } from '@/integrations/supabase/client';

export interface Location {
  lat: number;
  lng: number;
  city: string;
  state: string;
}

export interface MatchingCriteria {
  location: Location;
  equipmentType: string;
  weight: number;
  pickupDate: Date;
  deliveryDate: Date;
  budget: number;
  specialRequirements?: string;
}

export interface Carrier {
  id: string;
  full_name: string;
  rating: number;
  vehicles: Vehicle[];
  currentLocation: Location;
  availability: Date[];
  pricePerKm: number;
}

export interface Vehicle {
  id: string;
  equipment_type: string;
  capacity: number;
  status: 'available' | 'in_transit' | 'maintenance';
}

export interface Match {
  carrier: Carrier;
  vehicle: Vehicle;
  score: number;
  price: number;
  reasoning: string[];
  estimatedPickupTime: Date;
  estimatedDeliveryTime: Date;
}

export class MatchingEngine {
  private static readonly LOCATION_WEIGHT = 0.3;
  private static readonly EQUIPMENT_WEIGHT = 0.25;
  private static readonly PRICE_WEIGHT = 0.2;
  private static readonly RATING_WEIGHT = 0.15;
  private static readonly AVAILABILITY_WEIGHT = 0.1;

  async findMatches(shipmentId: string): Promise<Match[]> {
    try {
      // Get shipment details
      const { data: shipment, error: shipmentError } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', shipmentId)
        .single();

      if (shipmentError || !shipment) {
        throw new Error('Shipment not found');
      }

      // Get available carriers with vehicles
      const { data: carriers, error: carriersError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          vehicles (
            id,
            equipment_type,
            status,
            make,
            model,
            year
          )
        `)
        .eq('role', 'carrier');

      if (carriersError) {
        throw carriersError;
      }

      const matches: Match[] = [];

      for (const carrier of carriers || []) {
        const carrierMatches = await this.evaluateCarrier(carrier, shipment);
        matches.push(...carrierMatches);
      }

      // Sort by score (highest first) and return top matches
      return matches
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    } catch (error) {
      console.error('Error in matching algorithm:', error);
      throw error;
    }
  }

  private async evaluateCarrier(carrier: any, shipment: any): Promise<Match[]> {
    const matches: Match[] = [];

    // Filter vehicles by equipment type and availability
    const compatibleVehicles = carrier.vehicles?.filter((vehicle: Vehicle) => 
      vehicle.equipment_type === shipment.equipment_type &&
      vehicle.status === 'available'
    ) || [];

    for (const vehicle of compatibleVehicles) {
      const score = await this.calculateMatchScore(carrier, vehicle, shipment);
      
      if (score > 0.5) { // Only include matches with >50% score
        const price = this.calculatePrice(carrier, vehicle, shipment);
        const reasoning = this.generateReasoning(carrier, vehicle, shipment, score);
        
        matches.push({
          carrier: {
            id: carrier.id,
            full_name: carrier.full_name,
            rating: 4.5, // Mock rating - should come from database
            vehicles: carrier.vehicles,
            currentLocation: { lat: 0, lng: 0, city: 'Unknown', state: 'Unknown' }, // Mock
            availability: [], // Mock
            pricePerKm: 2.5 // Mock
          },
          vehicle,
          score,
          price,
          reasoning,
          estimatedPickupTime: new Date(shipment.pickup_date),
          estimatedDeliveryTime: new Date(shipment.delivery_date)
        });
      }
    }

    return matches;
  }

  private async calculateMatchScore(carrier: any, vehicle: Vehicle, shipment: any): Promise<number> {
    let totalScore = 0;

    // Location proximity score (mock - should use real geocoding)
    const locationScore = this.calculateLocationScore(carrier, shipment);
    totalScore += locationScore * MatchingEngine.LOCATION_WEIGHT;

    // Equipment compatibility score
    const equipmentScore = this.calculateEquipmentScore(vehicle, shipment);
    totalScore += equipmentScore * MatchingEngine.EQUIPMENT_WEIGHT;

    // Price competitiveness score
    const priceScore = this.calculatePriceScore(carrier, shipment);
    totalScore += priceScore * MatchingEngine.PRICE_WEIGHT;

    // Carrier rating score
    const ratingScore = this.calculateRatingScore(carrier);
    totalScore += ratingScore * MatchingEngine.RATING_WEIGHT;

    // Availability score
    const availabilityScore = this.calculateAvailabilityScore(carrier, shipment);
    totalScore += availabilityScore * MatchingEngine.AVAILABILITY_WEIGHT;

    return Math.min(totalScore, 1.0); // Cap at 1.0
  }

  private calculateLocationScore(carrier: any, shipment: any): number {
    // Mock location scoring - should use real geocoding and distance calculation
    // For now, return a random score between 0.6 and 1.0
    return 0.6 + Math.random() * 0.4;
  }

  private calculateEquipmentScore(vehicle: Vehicle, shipment: any): number {
    // Perfect match for equipment type
    if (vehicle.equipment_type === shipment.equipment_type) {
      return 1.0;
    }
    
    // Partial matches (e.g., refrigerated can handle dry van loads)
    const compatibleTypes: { [key: string]: string[] } = {
      'refrigerated': ['dry_van'],
      'flatbed': ['step_deck'],
      'step_deck': ['flatbed']
    };

    const compatible = compatibleTypes[vehicle.equipment_type] || [];
    if (compatible.includes(shipment.equipment_type)) {
      return 0.8;
    }

    return 0.0;
  }

  private calculatePriceScore(carrier: any, shipment: any): number {
    // Mock price scoring - should use real market data
    const marketRate = shipment.rate;
    const carrierRate = marketRate * (0.8 + Math.random() * 0.4); // ±20% variation
    
    // Score based on how competitive the price is
    if (carrierRate <= marketRate * 0.9) return 1.0; // Very competitive
    if (carrierRate <= marketRate) return 0.8; // Competitive
    if (carrierRate <= marketRate * 1.1) return 0.6; // Slightly above
    return 0.3; // Expensive
  }

  private calculateRatingScore(carrier: any): number {
    // Mock rating - should come from actual carrier ratings
    const rating = 4.0 + Math.random() * 1.0; // 4.0-5.0
    return rating / 5.0; // Normalize to 0-1
  }

  private calculateAvailabilityScore(carrier: any, shipment: any): number {
    // Mock availability - should check actual calendar
    return 0.7 + Math.random() * 0.3; // 0.7-1.0
  }

  private calculatePrice(carrier: any, vehicle: Vehicle, shipment: any): number {
    // Calculate price based on distance, weight, and market rates
    const baseRate = shipment.rate;
    const distance = this.calculateDistance(shipment.origin_city, shipment.destination_city);
    const weightMultiplier = shipment.weight / 1000; // Per ton
    
    return baseRate * distance * weightMultiplier * (0.9 + Math.random() * 0.2);
  }

  private calculateDistance(origin: string, destination: string): number {
    // Mock distance calculation - should use real geocoding
    return 500 + Math.random() * 1000; // 500-1500 km
  }

  private generateReasoning(carrier: any, vehicle: Vehicle, shipment: any, score: number): string[] {
    const reasons: string[] = [];

    if (score > 0.8) {
      reasons.push('Excellent match for your requirements');
    } else if (score > 0.6) {
      reasons.push('Good match with competitive pricing');
    } else {
      reasons.push('Suitable carrier for your shipment');
    }

    if (vehicle.equipment_type === shipment.equipment_type) {
      reasons.push('Perfect equipment type match');
    }

    if (score > 0.7) {
      reasons.push('Highly rated carrier with good track record');
    }

    if (Math.random() > 0.5) {
      reasons.push('Available for immediate pickup');
    }

    return reasons;
  }

  // Public method to get match recommendations for a shipment
  static async getRecommendations(shipmentId: string): Promise<Match[]> {
    const engine = new MatchingEngine();
    return await engine.findMatches(shipmentId);
  }
} 