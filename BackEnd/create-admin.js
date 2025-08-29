const { User } = require('./db/Database.js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function createAdmin() {
    try {
        console.log('Connecting to database...');

        // Wait a moment for database connection
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Admin credentials
        const adminData = {
            name: 'Admin User',
            id: uuidv4(),
            gender: 'Male',
            email: 'admin@elearning.com',
            username: 'admin',
            password: 'Admin@123',
            role: 'Admin'
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: adminData.username });
        if (existingAdmin) {
            console.log('❌ Admin user already exists with username:', adminData.username);
            console.log('✅ You can use these credentials:');
            console.log('Username:', adminData.username);
            console.log('Try password: Admin@123 (if this was the original password)');
            process.exit(0);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(adminData.password, 10);

        // Create new admin user
        const newAdmin = new User({
            name: adminData.name,
            id: adminData.id,
            gender: adminData.gender,
            email: adminData.email,
            username: adminData.username,
            password: hashedPassword,
            role: adminData.role
        });

        await newAdmin.save();

        console.log('✅ Admin user created successfully!');
        console.log('📋 Admin Credentials:');
        console.log('Username:', adminData.username);
        console.log('Password:', adminData.password);
        console.log('Email:', adminData.email);
        console.log('Name:', adminData.name);
        console.log('User ID:', adminData.id);

        console.log('\n🔐 You can now login with:');
        console.log('Username: admin');
        console.log('Password: Admin@123');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    }
}

createAdmin();
