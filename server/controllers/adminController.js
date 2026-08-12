const Registration = require('../models/Registration');
const Volunteer = require('../models/Volunteer');
const School = require('../models/School');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const Video = require('../models/Video');
const ContactMessage = require('../models/ContactMessage');
const TeamMember = require('../models/TeamMember');
const Testimonial = require('../models/Testimonial');
const SiteSettings = require('../models/SiteSettings');

// Helper to update statistics when models change
const updateAutoStats = async () => {
  try {
    const volunteersCount = await Volunteer.countDocuments({ status: 'active' });
    const schoolsCount = await School.countDocuments({ status: 'active' });
    const projectsCount = await Project.countDocuments();
    
    // Find or create the stats key
    let statsSetting = await SiteSettings.findOne({ key: 'stats' });
    if (!statsSetting) {
      statsSetting = new SiteSettings({
        key: 'stats',
        value: {
          totalVolunteers: volunteersCount + 150, // base counter offset
          schoolsReached: schoolsCount + 12,
          projectsCount: projectsCount,
          communityMembers: volunteersCount * 3 + 500,
        }
      });
    } else {
      statsSetting.value = {
        ...statsSetting.value,
        totalVolunteers: volunteersCount + 150,
        schoolsReached: schoolsCount + 12,
        projectsCount: projectsCount,
        communityMembers: volunteersCount * 3 + 500,
      };
      statsSetting.markModified('value');
    }
    await statsSetting.save();
  } catch (err) {
    console.error('Error updating auto stats:', err.message);
  }
};

// ==========================================
// 1. REGISTRATIONS CONTROLLER
// ==========================================

// Create registration (Public)
const createRegistration = async (req, res) => {
  try {
    const { name, email, phone, age, city, state, role, organization, message, socialLinks } = req.body;
    
    if (!name || !email || !phone || !age || !city || !state || !role || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const registration = new Registration({
      name, email, phone, age, city, state, role, organization, message, socialLinks
    });

    await registration.save();
    res.status(201).json({ success: true, message: 'Registration submitted successfully!' });
  } catch (error) {
    console.error('Registration creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit registration' });
  }
};

// Get all registrations (Admin)
const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve registrations' });
  }
};

// Update registration status (Admin) - Approving can auto-create a volunteer/school
const updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    registration.status = status;
    await registration.save();

    // If approved, automatically provision in appropriate schema
    if (status === 'approved') {
      if (['Student', 'Volunteer'].includes(registration.role)) {
        // Create volunteer if not already existing
        const exists = await Volunteer.findOne({ email: registration.email });
        if (!exists) {
          const volunteer = new Volunteer({
            name: registration.name,
            email: registration.email,
            phone: registration.phone,
            role: 'Volunteer',
            city: registration.city,
            status: 'active'
          });
          await volunteer.save();
        }
      } else if (registration.role === 'School') {
        const exists = await School.findOne({ name: registration.organization });
        if (!exists && registration.organization) {
          const school = new School({
            name: registration.organization,
            location: `${registration.city}, ${registration.state}`,
            contactPerson: registration.name,
            email: registration.email,
            phone: registration.phone,
            status: 'active'
          });
          await school.save();
        }
      }
      await updateAutoStats();
    }

    res.json({ success: true, message: `Registration ${status}`, data: registration });
  } catch (error) {
    console.error('Update registration status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update registration status' });
  }
};

// ==========================================
// 2. VOLUNTEERS CONTROLLER (Admin)
// ==========================================

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ joinedAt: -1 });
    res.json({ success: true, count: volunteers.length, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch volunteers' });
  }
};

const createVolunteer = async (req, res) => {
  try {
    const { name, email, phone, role, city, status } = req.body;
    const exists = await Volunteer.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Volunteer email already exists' });
    }
    const volunteer = new Volunteer({ name, email, phone, role, city, status });
    await volunteer.save();
    await updateAutoStats();
    res.status(201).json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create volunteer' });
  }
};

const updateVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }
    await updateAutoStats();
    res.json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update volunteer' });
  }
};

const deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }
    await updateAutoStats();
    res.json({ success: true, message: 'Volunteer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete volunteer' });
  }
};

// ==========================================
// 3. SCHOOLS CONTROLLER (Admin)
// ==========================================

const getSchools = async (req, res) => {
  try {
    const schools = await School.find().sort({ createdAt: -1 });
    res.json({ success: true, count: schools.length, data: schools });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch schools' });
  }
};

const createSchool = async (req, res) => {
  try {
    const school = new School(req.body);
    await school.save();
    await updateAutoStats();
    res.status(201).json({ success: true, data: school });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add school' });
  }
};

const updateSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!school) {
      return res.status(404).json({ success: false, message: 'School not found' });
    }
    await updateAutoStats();
    res.json({ success: true, data: school });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update school' });
  }
};

const deleteSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
      return res.status(404).json({ success: false, message: 'School not found' });
    }
    await updateAutoStats();
    res.json({ success: true, message: 'School deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete school' });
  }
};

// ==========================================
// 4. PROJECTS CONTROLLER (Public & Admin)
// ==========================================

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, image, status, featured } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }
    const project = new Project({ title, description, image, status, featured });
    await project.save();
    await updateAutoStats();
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    await updateAutoStats();
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    await updateAutoStats();
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
};

// ==========================================
// 5. ACTIVITIES CONTROLLER (Public & Admin)
// ==========================================

const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ date: -1 });
    res.json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch activities' });
  }
};

const createActivity = async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add activity' });
  }
};

const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update activity' });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete activity' });
  }
};

// ==========================================
// 6. VIDEOS CONTROLLER (Public & Admin)
// ==========================================

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch videos' });
  }
};

const createVideo = async (req, res) => {
  try {
    const video = new Video(req.body);
    await video.save();
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload video' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete video' });
  }
};

// ==========================================
// 7. CONTACT MESSAGES CONTROLLER
// ==========================================

// Submit Contact Message (Public)
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please enter all required fields' });
    }
    const newMessage = new ContactMessage({ name, email, phone, subject, message });
    await newMessage.save();
    res.status(201).json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

// Get Contact Messages (Admin)
const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch contact messages' });
  }
};

// ==========================================
// 8. TEAM MEMBERS CONTROLLER (Public & Admin)
// ==========================================

const getTeam = async (req, res) => {
  try {
    const team = await TeamMember.find().sort({ createdAt: 1 });
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch team members' });
  }
};

const createTeamMember = async (req, res) => {
  try {
    const member = new TeamMember(req.body);
    await member.save();
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add team member' });
  }
};

const updateTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update team member' });
  }
};

const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    res.json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete team member' });
  }
};

// ==========================================
// 9. TESTIMONIALS CONTROLLER (Public & Admin)
// ==========================================

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add testimonial' });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update testimonial' });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete testimonial' });
  }
};

// ==========================================
// 10. STATISTICS / SITE SETTINGS
// ==========================================

const getStats = async (req, res) => {
  try {
    let stats = await SiteSettings.findOne({ key: 'stats' });
    if (!stats) {
      // Create defaults
      stats = new SiteSettings({
        key: 'stats',
        value: {
          totalVolunteers: 150,
          schoolsReached: 12,
          projectsCount: 2,
          communityMembers: 500,
        }
      });
      await stats.save();
    }
    res.json({ success: true, data: stats.value });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve stats' });
  }
};

const updateStats = async (req, res) => {
  try {
    let stats = await SiteSettings.findOne({ key: 'stats' });
    if (!stats) {
      stats = new SiteSettings({ key: 'stats', value: req.body });
    } else {
      stats.value = { ...stats.value, ...req.body };
      stats.markModified('value');
    }
    await stats.save();
    res.json({ success: true, data: stats.value });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update stats' });
  }
};

module.exports = {
  createRegistration,
  getRegistrations,
  updateRegistrationStatus,
  
  getVolunteers,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool,
  
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  
  getVideos,
  createVideo,
  deleteVideo,
  
  submitContactMessage,
  getContactMessages,
  
  getTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  
  getStats,
  updateStats
};
