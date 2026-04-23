import { NeonQueryFunction, neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function createAdmin() {
  console.log('Creating admin user...');
  
  const result = await sql`
    INSERT INTO users (id, name, email, password, role, created_at, updated_at) 
    VALUES (
      gen_random_uuid(), 
      'Andres Nader', 
      'andres@ameizin.ec', 
      '${process.env.ADMIN_HASH || '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYfQ3Z7aOdy'}', 
      'admin', 
      NOW(), 
      NOW()
    )
    RETURNING id, email, role
  `;
  
  console.log('Admin created:', result);
}

createAdmin().catch(console.error);