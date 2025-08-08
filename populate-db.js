const { createClient } = require('@supabase/supabase-js');

// Supabase configuration from client.ts
const SUPABASE_URL = 'https://zrsziainjlzii6indzqaglncnftahgdvb3pjaqhvcmnjjwicm94zsi6imfub24ilcjpyxqiojezm0qxnzq2njqsimv4y2k2mjawnzuxmdyynhaucuxy5mxavt-corxzaj4ujmesiicy0mnkvrmoov4zmox4zs';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyc3ppYWluamx6aWk2aW5kenFhZ2xuY25mdGFoZ2R2YjNwamFxaHZjbW5qandpY205NFpzaTZpbUZ1YjI0aUxDSnBZWFFpT2pFek0wUXhOelEyTmpRc0ltVjRZMms2TWpBd09UYzFNRFkyTkgwLnFMWTVNWGF2dC1Db3J4emFqNHVKbWVzaUlDWTBNbmt2Uk1vdjRaTW94NFpTIiwiaWF0IjoxNzM0MTc0NjY0LCJleHAiOjIwNDk3NTA2NjR9.qLY5MXavt-Corxzaj4uJmesiICY0MnkvRMov4ZMox4ZS';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function populateDatabase() {
  try {
    console.log('Starting database population...');
    
    // Sample shipments data
    const shipments = [
      {
        title: 'Electronics Shipment',
        company_name: 'TechCorp Ltd',
        origin_city: 'Lagos',
        destination_city: 'Hamburg',
        country: 'Nigeria',
        weight: 15,
        cargo_type: 'Refrigerated 40ft',
        price: 2500,
        status: 'posted',
        priority: 'urgent',
        special_requirements: ['Temperature Controlled', 'Fast Transit']
      },
      {
        title: 'Food Products',
        company_name: 'Atlas Foods Export',
        origin_city: 'Rabat',
        destination_city: 'Morocco',
        country: 'Morocco',
        weight: 25,
        cargo_type: 'Refrigerated 40ft',
        price: 3500,
        status: 'posted',
        priority: 'urgent',
        special_requirements: ['Temperature Controlled', 'Fast Transit']
      },
      {
        title: 'Textile Goods',
        company_name: 'African Textiles Co',
        origin_city: 'Cairo',
        destination_city: 'Rotterdam',
        country: 'Egypt',
        weight: 18,
        cargo_type: 'Standard 20ft',
        price: 1800,
        status: 'posted',
        priority: 'normal',
        special_requirements: ['Dry Storage']
      }
    ];

    // Insert shipments
    const { data, error } = await supabase
      .from('shipments')
      .insert(shipments)
      .select();

    if (error) {
      console.error('Error inserting shipments:', error);
      return;
    }

    console.log('Successfully inserted shipments:', data.length);
    console.log('Database population completed!');
    
  } catch (error) {
    console.error('Error populating database:', error);
  }
}

populateDatabase();
