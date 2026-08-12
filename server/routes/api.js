const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
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
} = require('../controllers/adminController');

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.post('/registrations', createRegistration);
router.post('/contact', submitContactMessage);
router.get('/projects', getProjects);
router.get('/activities', getActivities);
router.get('/videos', getVideos);
router.get('/team', getTeam);
router.get('/testimonials', getTestimonials);
router.get('/stats', getStats);

// ==========================================
// PROTECTED ADMIN ROUTES (JWT Required)
// ==========================================
router.use(protect);

// Registrations management
router.get('/registrations', getRegistrations);
router.patch('/registrations/:id', updateRegistrationStatus);

// Volunteers management
router.get('/volunteers', getVolunteers);
router.post('/volunteers', createVolunteer);
router.patch('/volunteers/:id', updateVolunteer);
router.delete('/volunteers/:id', deleteVolunteer);

// Schools management
router.get('/schools', getSchools);
router.post('/schools', createSchool);
router.patch('/schools/:id', updateSchool);
router.delete('/schools/:id', deleteSchool);

// Projects management
router.post('/projects', createProject);
router.patch('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Activities management
router.post('/activities', createActivity);
router.patch('/activities/:id', updateActivity);
router.delete('/activities/:id', deleteActivity);

// Videos management
router.post('/videos', createVideo);
router.delete('/videos/:id', deleteVideo);

// Contact messages log
router.get('/contact', getContactMessages);

// Team management
router.post('/team', createTeamMember);
router.patch('/team/:id', updateTeamMember);
router.delete('/team/:id', deleteTeamMember);

// Testimonials management
router.post('/testimonials', createTestimonial);
router.patch('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

// Site settings / statistics
router.patch('/stats', updateStats);

module.exports = router;
