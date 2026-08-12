require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Project = require('../models/Project');
const Volunteer = require('../models/Volunteer');
const School = require('../models/School');
const Activity = require('../models/Activity');
const Video = require('../models/Video');
const ContactMessage = require('../models/ContactMessage');
const TeamMember = require('../models/TeamMember');
const Testimonial = require('../models/Testimonial');
const SiteSettings = require('../models/SiteSettings');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yuvaduty');
    console.log(`Seed MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB seed connection error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    console.log('Clearing existing database entries...');
    await User.deleteMany();
    await Project.deleteMany();
    await Volunteer.deleteMany();
    await School.deleteMany();
    await Activity.deleteMany();
    await Video.deleteMany();
    await ContactMessage.deleteMany();
    await TeamMember.deleteMany();
    await Testimonial.deleteMany();
    await SiteSettings.deleteMany();

    console.log('Seeding default Admin User...');
    const hashedPassword = await bcrypt.hash('admin_duty_2026', 10);
    const admin = new User({
      name: 'Yuva Duty Admin',
      email: 'admin@yuvaduty.org',
      password: hashedPassword,
      role: 'admin',
    });
    await admin.save();
    console.log('Admin User created (Credentials: admin@yuvaduty.org / admin_duty_2026)');

    console.log('Seeding Statistics...');
    const stats = new SiteSettings({
      key: 'stats',
      value: {
        totalVolunteers: 156,
        schoolsReached: 14,
        projectsCount: 2,
        communityMembers: 512,
      },
    });
    await stats.save();

    console.log('Seeding default Projects...');
    const projects = [
      {
        title: 'School Awareness Program',
        description: 'Empowering school students with fundamental civic knowledge, cleanliness awareness, and basic traffic and safety rules. Conducted through interactive workshops, drawing competitions, and action-based learning led by our volunteer coordinators.',
        image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
        status: 'PILOT',
        featured: true,
      },
      {
        title: 'Community Awareness Drive',
        description: 'Engaging local communities in waste segregation, neighborhood cleanliness, environmental recycling, and active civic participation. Student volunteers hold street awareness marches and interact directly with residents.',
        image: 'https://images.unsplash.com/photo-1464938050746-8a58f97782ac?auto=format&fit=crop&w=600&q=80',
        status: 'UPCOMING',
        featured: true,
      },
    ];
    await Project.insertMany(projects);

    console.log('Seeding default Team Members...');
    const team = [
      {
        name: 'Achint',
        role: 'Founder & Executive Director',
        bio: 'A student-leader passionate about building structured channels for youth civic responsibility and social reform across India.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        linkedin: 'https://linkedin.com',
      },
      {
        name: 'Ananya Roy',
        role: 'Head of Community Outreach',
        bio: 'Coordinates campus networks and volunteer mobilization efforts, expanding civic drives to schools and colleges.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        linkedin: 'https://linkedin.com',
      },
    ];
    await TeamMember.insertMany(team);

    console.log('Seeding default Testimonials...');
    const testimonials = [
      {
        name: 'Rohan Deshmukh',
        role: 'Student Volunteer, College of Science',
        quote: 'Working with Yuva Duty made me realize that change doesn\'t happen by waiting. Leading a local park restoration and recycling campaign taught me core leadership values.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      },
      {
        name: 'Mrs. Shalini Iyer',
        role: 'Vice Principal, DAV Public School',
        quote: 'The School Awareness Program was incredibly engaging for our high school students. They didn\'t just listen; they participated in civic cleanliness drills. Outstanding initiative!',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      },
    ];
    await Testimonial.insertMany(testimonials);

    console.log('Seeding default Videos...');
    const videos = [
      {
        title: 'Empowering India\'s Youth - YUVA DUTY',
        description: 'An introduction to our vision of civic responsibility and social action among Indian youth.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80',
      },
      {
        title: 'School Drive Cleanliness Workshop',
        description: 'Highlights of our pilot school drive teaching civic sense and safety rules.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80',
      },
    ];
    await Video.insertMany(videos);

    console.log('Seeding sample Volunteers & Schools for dashboard counters...');
    const volunteers = [
      { name: 'Amit Patel', email: 'amit@gmail.com', phone: '9876543210', role: 'Volunteer', city: 'Delhi', status: 'active' },
      { name: 'Sneha Sen', email: 'sneha@gmail.com', phone: '8765432109', role: 'Campus Coordinator', city: 'Kolkata', status: 'active' },
      { name: 'Vikram Singh', email: 'vikram@gmail.com', phone: '7654321098', role: 'School Ambassador', city: 'Pune', status: 'active' },
    ];
    await Volunteer.insertMany(volunteers);

    const schools = [
      { name: 'St. Xavier High School', location: 'Mumbai', contactPerson: 'Mr. John D\'souza', email: 'xavier@highschool.edu', phone: '9988776655', status: 'active' },
      { name: 'DPS RK Puram', location: 'Delhi', contactPerson: 'Mrs. Rashmi Kapur', email: 'info@dpsrkpuram.edu', phone: '8877665544', status: 'active' },
    ];
    await School.insertMany(schools);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
