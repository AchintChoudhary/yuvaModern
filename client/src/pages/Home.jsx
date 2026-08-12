import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, ShieldCheck, Heart, Sparkles, BookOpen, Users, School, Briefcase } from 'lucide-react';
import axios from 'axios';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import AnimatedCard from '../components/AnimatedCard';
import StatusBadge from '../components/StatusBadge';

const Home = () => {
  const [stats, setStats] = useState({
    totalVolunteers: 156,
    schoolsReached: 14,
    projectsCount: 2,
    communityMembers: 512
  });
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Fetch statistics and projects on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get('/api/stats');
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      } catch (err) {
        console.warn('Failed to fetch dynamic stats, using fallback presets:', err);
      }

      try {
        const projectsRes = await axios.get('/api/projects');
        if (projectsRes.data.success) {
          // Only show featured or first 2 projects
          setProjects(projectsRes.data.data.slice(0, 2));
        }
      } catch (err) {
        console.warn('Failed to fetch projects, using fallbacks:', err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchData();
  }, []);

  // Preset fallbacks for projects if API fails/is empty
  const defaultProjects = [
    {
      _id: '1',
      title: 'School Awareness Program',
      description: 'Empowering school students with fundamental civic knowledge, cleanliness awareness, and basic traffic and safety rules. Conducted through interactive workshops and action-based learning.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
      status: 'PILOT'
    },
    {
      _id: '2',
      title: 'Community Awareness Drive',
      description: 'Engaging local communities in sanitation drives, recycling awareness, and social service projects. Led entirely by student volunteers to create a cleaner and kinder environment.',
      image: 'https://images.unsplash.com/photo-1464938050746-8a58f97782ac?auto=format&fit=crop&w=600&q=80',
      status: 'UPCOMING'
    }
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  return (
    <div className="relative">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="min-h-screen relative flex items-center justify-center pt-24 overflow-hidden">
        {/* Background Visual Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
            alt="Indian youth volunteering"
            className="w-full h-full object-cover filter brightness-[0.22] contrast-[1.05]"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-transparent to-dark-950/20" />
        </div>

        {/* Ambient Orange Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full radial-gradient bg-primary/10 filter blur-[100px] animate-pulse pointer-events-none" />

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto px-5 md:px-10 z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Tagline Badge */}
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-widest text-primary flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Empowering India's Youth
            </span>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display leading-[1.1] tracking-tight text-white max-w-4xl">
              Empowering India's Youth to <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary text-glow">
                Build a Better Tomorrow.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-grey-light text-base md:text-xl max-w-2xl leading-relaxed mt-4">
              We are a student-led initiative working to develop civic responsibility, social awareness, and community leadership among young people.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
              <Link to="/join" className="w-full sm:w-auto">
                <Button size="lg" fullWidth icon={ArrowRight}>
                  Join Community
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" fullWidth>
                  Partner With Us
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-8 flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' })}
          >
            <span className="text-xs uppercase tracking-widest text-white/40 hover:text-primary transition-colors">
              Scroll to explore
            </span>
            <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center p-1">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-1.5 bg-primary rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. MISSION & VISION SECTION */}
      <section className="py-24 bg-dark-900 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SectionHeading
            subtitle="Our Compass"
            title="Vision & Mission"
            description="We aim to drive real, ground-level change in India by embedding civic responsibility inside the classroom and local communities."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass p-8 md:p-12 rounded-2xl flex flex-col gap-6 border-l-4 border-l-primary relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full filter blur-2xl group-hover:bg-primary/10 transition-colors" />
              <Compass className="w-10 h-10 text-primary" />
              <h3 className="text-2xl font-extrabold font-display text-white">
                Our Mission
              </h3>
              <p className="text-grey-light text-base md:text-lg leading-relaxed">
                To inspire and empower students to become responsible citizens through awareness, education, active civic participation, and direct community service.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass p-8 md:p-12 rounded-2xl flex flex-col gap-6 border-l-4 border-l-secondary relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full filter blur-2xl group-hover:bg-secondary/10 transition-colors" />
              <ShieldCheck className="w-10 h-10 text-secondary" />
              <h3 className="text-2xl font-extrabold font-display text-white">
                Our Vision
              </h3>
              <p className="text-grey-light text-base md:text-lg leading-relaxed">
                A future where every student actively contributes to building a cleaner, kinder, safer, and more responsible India.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES SECTION */}
      <section className="py-24 bg-dark-950 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SectionHeading
            subtitle="Core Pillars"
            title="What We Stand For"
            description="Our fundamental beliefs guide how we work as a student-led organization and define our civic initiatives."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <AnimatedCard
              number="01"
              icon={ShieldCheck}
              title="Responsibility"
              description="We take ownership. We don't wait for others to fix civic issues; we step up to resolve them."
            />
            <AnimatedCard
              number="02"
              icon={Compass}
              title="Leadership"
              description="Students become changemakers. We foster real-world leadership qualities by giving youth full charge of initiatives."
            />
            <AnimatedCard
              number="03"
              icon={Heart}
              title="Service"
              description="Small actions create big impact. We believe consistent community service builds empathy and transforms lives."
            />
          </div>
        </div>
      </section>

      {/* 4. WHY YUVA DUTY? */}
      <section className="py-24 bg-dark-900 border-t border-white/5 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text side */}
            <div className="lg:col-span-5 text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-primary font-display block mb-2">
                Why Us?
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display leading-tight mb-6">
                Why Support <br />
                Yuva Duty?
              </h2>
              <p className="text-grey text-base leading-relaxed mb-8">
                Unlike corporate NGOs, Yuva Duty is completely run by students. We bridge the gap between textbook awareness and active, on-ground civic responsibility.
              </p>
              <Link to="/about">
                <Button variant="outline" icon={ArrowRight}>
                  Learn Our Story
                </Button>
              </Link>
            </div>

            {/* Cards side */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
              <div className="glass p-6 rounded-xl border border-white/5 flex flex-col gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                <h4 className="text-lg font-bold text-white">Student-Led</h4>
                <p className="text-grey text-sm">Initiated and managed entirely by high school and college students.</p>
              </div>
              <div className="glass p-6 rounded-xl border border-white/5 flex flex-col gap-3">
                <ShieldCheck className="w-8 h-8 text-secondary" />
                <h4 className="text-lg font-bold text-white">Non-Profit</h4>
                <p className="text-grey text-sm">Every single donation or resource goes directly towards our civic drives.</p>
              </div>
              <div className="glass p-6 rounded-xl border border-white/5 flex flex-col gap-3">
                <Users className="w-8 h-8 text-primary" />
                <h4 className="text-lg font-bold text-white">Civic Awareness</h4>
                <p className="text-grey text-sm">Building core civic discipline from trash management to traffic guidelines.</p>
              </div>
              <div className="glass p-6 rounded-xl border border-white/5 flex flex-col gap-3">
                <Compass className="w-8 h-8 text-secondary" />
                <h4 className="text-lg font-bold text-white">Community Dev</h4>
                <p className="text-grey text-sm">Fostering active engagement between campus bodies and local citizens.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. IMPACT PREVIEW STATS */}
      <section className="py-20 bg-dark-950 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center p-6 glass rounded-xl border border-white/5"
            >
              <Users className="w-8 h-8 text-primary mb-3" />
              <span className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-white text-glow">
                {stats.totalVolunteers}+
              </span>
              <span className="text-xs uppercase tracking-widest text-grey mt-2">
                Total Volunteers
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center justify-center p-6 glass rounded-xl border border-white/5"
            >
              <School className="w-8 h-8 text-secondary mb-3" />
              <span className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-white text-glow">
                {stats.schoolsReached}+
              </span>
              <span className="text-xs uppercase tracking-widest text-grey mt-2">
                Schools Reached
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center p-6 glass rounded-xl border border-white/5"
            >
              <Briefcase className="w-8 h-8 text-primary mb-3" />
              <span className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-white text-glow">
                {stats.projectsCount}
              </span>
              <span className="text-xs uppercase tracking-widest text-grey mt-2">
                Active Projects
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center p-6 glass rounded-xl border border-white/5"
            >
              <Users className="w-8 h-8 text-secondary mb-3" />
              <span className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-white text-glow">
                {stats.communityMembers}+
              </span>
              <span className="text-xs uppercase tracking-widest text-grey mt-2">
                Community Members
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED PROJECTS */}
      <section className="py-24 bg-dark-900 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SectionHeading
            subtitle="Action Portfolios"
            title="Featured Initiatives"
            description="Explore our active civic operations. We implement small-scale pilots before full scaling."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {displayProjects.map((proj, idx) => (
              <motion.div
                key={proj._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="glass rounded-xl overflow-hidden border border-white/5 group hover:border-primary/20 transition-all duration-300 text-left flex flex-col h-full"
              >
                {/* Image Wrap */}
                <div className="h-56 md:h-64 relative overflow-hidden">
                  <img
                    src={proj.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80'}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <StatusBadge status={proj.status} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-primary transition-colors duration-300 mb-3">
                      {proj.title}
                    </h3>
                    <p className="text-grey text-sm md:text-base leading-relaxed mb-6">
                      {proj.description}
                    </p>
                  </div>

                  <Link to="/projects" className="w-fit">
                    <Button variant="outline" size="sm" icon={ArrowRight}>
                      Learn More
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COMMUNITY CTA */}
      <section className="py-24 bg-dark-950 relative z-10 border-t border-white/5 overflow-hidden">
        {/* Background Grid Overlay */}
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] radial-gradient bg-primary/5 rounded-full filter blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
              Ready to Be Part <br className="sm:hidden" /> of the Change?
            </h2>
            <p className="text-grey text-base md:text-lg max-w-2xl leading-relaxed">
              Your small, disciplined civic actions can spark a massive community movement. Join other young leaders driving accountability across India.
            </p>
            <Link to="/join" className="mt-4">
              <Button size="lg" icon={ArrowRight}>
                Join Yuva Duty
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
