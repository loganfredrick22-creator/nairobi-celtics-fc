const User = require('../models/User');

const seedAdmin = async () => {
  const existing = await User.findOne({ email: 'admin@nairoliceltics.co.ke' });
  if (!existing) {
    await User.create({
      firstName: 'Admin',
      lastName: 'NCFC',
      email: 'admin@nairoliceltics.co.ke',
      password: 'Admin@123',
      phone: '+254700000000',
      role: 'admin',
    });
    console.log('Admin seeded: admin@nairoliceltics.co.ke / Admin@123');
  } else {
    console.log('Admin already exists');
  }
};

module.exports = seedAdmin;
