import { supabase } from '@/integrations/supabase/client';

export interface SampleUser {
  email: string;
  password: string;
  full_name: string;
  role: 'shipper' | 'carrier' | 'admin';
}

export const sampleUsers: SampleUser[] = [
  {
    email: 'shipper@demo.com',
    password: 'demo123',
    full_name: 'Demo Shipper',
    role: 'shipper'
  },
  {
    email: 'carrier@demo.com',
    password: 'demo123',
    full_name: 'Demo Carrier',
    role: 'carrier'
  },
  {
    email: 'admin@demo.com',
    password: 'demo123',
    full_name: 'Demo Admin',
    role: 'admin'
  }
];

export class SampleDataInitializer {
  static async initializeSampleData() {
    try {
      console.log('Initializing sample data...');
      
      // Create sample users
      for (const user of sampleUsers) {
        await this.createSampleUser(user);
      }
      
      console.log('Sample data initialization completed!');
    } catch (error) {
      console.error('Error initializing sample data:', error);
      throw error;
    }
  }

  private static async createSampleUser(userData: SampleUser) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      const userExists = existingUser.users.some(u => u.email === userData.email);
      
      if (userExists) {
        console.log(`User ${userData.email} already exists, skipping...`);
        return;
      }

      // Create user
      const { data: user, error: createError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
          role: userData.role
        }
      });

      if (createError) throw createError;

      // Update profile
      if (user.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: userData.full_name,
            role: userData.role
          })
          .eq('user_id', user.user.id);

        if (profileError) throw profileError;
      }

      console.log(`Created user: ${userData.email} (${userData.role})`);
    } catch (error) {
      console.error(`Error creating user ${userData.email}:`, error);
      throw error;
    }
  }

  static async createSampleShipment(shipperId: string) {
    try {
      const sampleShipment = {
        shipper_id: shipperId,
        origin_city: 'Casablanca',
        origin_state: 'Casablanca-Settat',
        destination_city: 'Madrid',
        destination_state: 'Madrid',
        pickup_date: '2025-01-20',
        delivery_date: '2025-01-22',
        weight: 15000,
        rate: 2800.00,
        equipment_type: 'refrigerated',
        commodity: 'Electronics',
        special_requirements: 'Handle with care, temperature controlled',
        status: 'posted',
        bid_count: 0
      };

      const { data, error } = await supabase
        .from('shipments')
        .insert(sampleShipment)
        .select()
        .single();

      if (error) throw error;
      console.log('Created sample shipment:', data.id);
      return data;
    } catch (error) {
      console.error('Error creating sample shipment:', error);
      throw error;
    }
  }

  static async createSampleBid(shipmentId: string, carrierId: string) {
    try {
      const sampleBid = {
        shipment_id: shipmentId,
        carrier_id: carrierId,
        amount: 2750.00,
        notes: 'Experienced in temperature-controlled transport',
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('bids')
        .insert(sampleBid)
        .select()
        .single();

      if (error) throw error;
      console.log('Created sample bid:', data.id);
      return data;
    } catch (error) {
      console.error('Error creating sample bid:', error);
      throw error;
    }
  }

  static async createSampleVehicle(carrierId: string) {
    try {
      const sampleVehicle = {
        owner_id: carrierId,
        make: 'Mercedes-Benz',
        model: 'Actros',
        year: 2022,
        vin: 'WDB9634031L123456',
        license_plate: 'ES-1234-AB',
        equipment_type: 'dry_van',
        status: 'available'
      };

      const { data, error } = await supabase
        .from('vehicles')
        .insert(sampleVehicle)
        .select()
        .single();

      if (error) throw error;
      console.log('Created sample vehicle:', data.id);
      return data;
    } catch (error) {
      console.error('Error creating sample vehicle:', error);
      throw error;
    }
  }

  static async getOrCreateSampleUsers() {
    try {
      const users = [];
      
      for (const userData of sampleUsers) {
        // Try to sign in to get user
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: userData.password
        });

        if (signInError) {
          console.log(`User ${userData.email} doesn't exist, creating...`);
          await this.createSampleUser(userData);
          
          // Try to sign in again
          const { data: newUser } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password
          });
          
          if (newUser.user) {
            users.push(newUser.user);
          }
        } else if (signInData.user) {
          users.push(signInData.user);
        }
      }

      return users;
    } catch (error) {
      console.error('Error getting or creating sample users:', error);
      throw error;
    }
  }
} 