import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Award, MapPin, AwardIcon, Compass, Sparkles, BookOpen, Quote } from 'lucide-react';
import axios from 'axios';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import AnimatedCard from '../components/AnimatedCard';

const Community = () => {
  const [stats, setStats] = useState({
    totalVolunteers: 156,
    schoolsReached: 14,
    communityMembers: 512
  });
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const statsRes = await axios.get('/api/stats');
        if (statsRes.data.success) setStats(statsRes.data.data);
      } catch (err) {
        console.warn('Failed to load community stats:', err);
      }

      try {
        const testimonialsRes = await axios.get('/api/testimonials');
        if (testimonialsRes.data.success) setTestimonials(testimonialsRes.data.data);
      } catch (err) {
        console.warn('Failed to load testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunityData();
  }, []);

  const roles = [
    {
      title: 'Become Volunteer',
      icon: Users,
      description: 'Participate directly on-ground in our civic cleanliness drives, recycling campaigns, and social service workshops.',
      cta: 'Join as Volunteer'
    },
    {
      title: 'Become School Ambassador',
      icon: GraduationCap,
      description: 'Represent Yuva Duty in your high school. Lead civic awareness drawing drills and engage young junior classes.',
      cta: 'Apply for School'
    },
    {
      title: 'Become Campus Coordinator',
      icon: Compass,
      description: 'Mobilize university or college campus bodies, orchestrating volunteer cohorts and organizing cluster drives.',
      cta: 'Apply for Campus'
    },
    {
      title: 'Become Mentor',
      icon: Award,
      description: 'Are you a teacher, professor, or NGO advisor? Guide student leaders, check safety compliance, and provide inputs.',
      cta: 'Join as Mentor'
    }
  ];

  const benefits = [
    { title: 'Official Certificate', text: 'Receive certified volunteer credentials upon successfully finishing civic drives and hours.' },
    { title: 'Leadership Roles', text: 'Gain real management exposure. Coordinate actual public operations and lead teams.' },
    { title: 'Practical Experience', text: 'Bridge textbook civic sense with real-world problems, waste management, and social work.' },
    { title: 'Wide Networking', text: 'Connect with a vast national community of like-minded young changemakers and mentors.' },
    { title: 'Real Social Impact', text: 'See direct visual results of your action. A cleaner park, a safer crossing, a aware school kid.' }
  ];

  const defaultTestimonials = [
    {
      _id: '1',
      name: 'Rohan Deshmukh',
      role: 'Student Volunteer, College of Science',
      quote: 'Working with Yuva Duty made me realize that change doesn\'t happen by waiting. Leading a local park restoration and recycling campaign taught me core leadership values.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    },
    {
      _id: '2',
      name: 'Mrs. Shalini Iyer',
      role: 'Vice Principal, DAV Public School',
      quote: 'The School Awareness Program was incredibly engaging for our high school students. They didn\'t just listen; they participated in civic cleanliness drills. Outstanding initiative!',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <div className="relative pt-20">
      {/* 1. HERO SECTION */}
      <section className="py-20 md:py-28 bg-dark-950 relative overflow-hidden">
        {/* Background Visual Overlay */}
        <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-5 md:px-10 z-10 text-center flex flex-col items-center relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase font-bold tracking-widest text-primary font-display block mb-4"
          >
            The Movement
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[1.1] text-white max-w-4xl"
          >
            Join India's Young <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">
              Changemakers
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-grey-light text-base md:text-lg max-w-2xl leading-relaxed mt-6"
          >
            Connect with thousands of students driving civic awareness, sanitation reforms, and active community responsibility. Find your role today.
          </motion.p>
        </div>
      </section>

      {/* 2. CHOOSE YOUR ROLE */}
      <section className="py-24 bg-dark-900 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SectionHeading
            subtitle="Engage"
            title="Active Roles"
            description="Whether you are a student, teacher, coordinator, or professional, there is a way you can add value."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {roles.map((role) => (
              <AnimatedCard
                key={role.title}
                icon={role.icon}
                title={role.title}
                description={role.description}
                className="text-left"
              >
                <Link to="/join" className="inline-block mt-6">
                  <Button variant="outline" size="sm">
                    {role.cta}
                  </Button>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VOLUNTEER BENEFITS */}
      <section className="py-24 bg-dark-950 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SectionHeading
            subtitle="Growth"
            title="Volunteer Benefits"
            description="Developing civic habits also molds your professional skills and expands your networking reach."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="glass p-6 md:p-8 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300 text-left flex flex-col justify-between"
              >
                <div className="flex flex-col gap-3">
                  <span className="text-2xl font-bold font-display text-primary/10">0{idx + 1}</span>
                  <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{benefit.title}</h4>
                  <p className="text-grey text-sm leading-relaxed">{benefit.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STATISTICS */}
      <section className="py-20 bg-dark-900 border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-xl border border-white/5 flex flex-col items-center">
              <Users className="w-8 h-8 text-primary mb-3" />
              <span className="text-3xl md:text-4xl font-extrabold font-display text-white text-glow">{stats.totalVolunteers}+</span>
              <p className="text-xs uppercase tracking-widest text-grey mt-2">Active Volunteers</p>
            </div>
            <div className="glass p-8 rounded-xl border border-white/5 flex flex-col items-center">
              <GraduationCap className="w-8 h-8 text-secondary mb-3" />
              <span className="text-3xl md:text-4xl font-extrabold font-display text-white text-glow">{stats.schoolsReached}+</span>
              <p className="text-xs uppercase tracking-widest text-grey mt-2">School Networks</p>
            </div>
            <div className="glass p-8 rounded-xl border border-white/5 flex flex-col items-center">
              <Users className="w-8 h-8 text-primary mb-3" />
              <span className="text-3xl md:text-4xl font-extrabold font-display text-white text-glow">{stats.communityMembers}+</span>
              <p className="text-xs uppercase tracking-widest text-grey mt-2">Active Changemakers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS (COMMUNITY STORIES) */}
      <section className="py-24 bg-dark-950 border-t border-white/5 relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <SectionHeading
            subtitle="Voices"
            title="Community Stories"
            description="Read what our student volunteers, principal networks, and partners say about Yuva Duty."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {displayTestimonials.map((t, idx) => (
              <motion.div
                key={t._id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="glass p-8 rounded-xl border border-white/5 hover:border-primary/10 transition-colors text-left flex flex-col justify-between relative group"
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5 group-hover:text-primary/5 transition-colors pointer-events-none" />
                
                <p className="text-grey-light text-base italic leading-relaxed mb-8 relative z-10">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-dark-800 border border-white/5 text-primary flex items-center justify-center font-bold">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <h5 className="text-sm font-bold text-white">{t.name}</h5>
                    <p className="text-xs text-grey mt-0.5">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
