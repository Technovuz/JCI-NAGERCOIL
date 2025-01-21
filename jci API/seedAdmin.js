const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const seedAdmin = async () => {
  try {
    // Use environment variables for better security
    const email = process.env.ADMIN_EMAIL || 'jciadmin@gmail.com';
    const password = process.env.ADMIN_PASSWORD || 'Edwin@123';

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin data into the database
    await prisma.admin.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    console.log('Admin account created successfully.');
    process.exit(0); // Exit script after success
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1); // Exit script with an error
  } finally {
    await prisma.$disconnect();
  }
};

// Run the function
seedAdmin();
