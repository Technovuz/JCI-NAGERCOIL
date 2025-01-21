const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../../config/db');

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Function to generate refresh token
const generateRefreshToken = (admin) => {
  console.log(`Generating refresh token for admin ID: ${admin.id}`); // Debug log
  return jwt.sign({ id: admin.id, email: admin.email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

const loginAdmin = async (req, res) => {
  console.log('Admin login request received'); // Log when login route is hit

  const { email, password } = req.body;
  console.log('Received login attempt for email:', email); // Log email received

  // Validate input
  if (!email || !password) {
    console.log('Validation failed: Missing email or password');
    return res.status(400).send('Email and password are required.');
  }

  try {
    // Find admin by email
    console.log(`Checking for admin with email: ${email}`);
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      console.log('Admin not found for email:', email);
      return res.status(401).send('Invalid credentials.');
    }

    console.log('Admin found:', admin.email); // Log admin found

    // Compare entered password with the stored hashed password
    console.log('Comparing password for admin:', admin.email);
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      console.log('Password mismatch for admin:', admin.email);
      return res.status(401).send('Invalid credentials.');
    }

    console.log('Password matched for admin:', admin.email);

    // Generate access token (1 hour expiry)
    console.log('Generating access token...');
    const accessToken = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '1h' });

    // Generate refresh token (7 days expiry)
    console.log('Generating refresh token...');
    const refreshToken = generateRefreshToken(admin);

    console.log('Login successful for admin:', admin.email);
    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
    });

  } catch (error) {
    console.error('Error during login:', error); // Detailed error logging
    res.status(500).send('Server error.');
  }
};

module.exports = { loginAdmin };
