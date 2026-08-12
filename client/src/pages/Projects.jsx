import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Sparkles, FolderKanban } from 'lucide-react';
import axios from 'axios';
import SectionHeading from '../components/SectionHeading';
import StatusBadge from '../components/StatusBadge';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/projects');
        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to load projects, utilizing fallback templates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const defaultProjects = [
    {
      _id: '1',
      title: 'School Awareness Program',
      description: 'Empowering school students with fundamental civic knowledge, cleanliness awareness, and basic traffic and safety rules. Conducted through interactive workshops, drawing drills, and safety guides led by student coordinators.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
      status: 'PILOT'
    },
    {
      _id: '2',
      title: 'Community Awareness Drive',
      description: 'Engaging local communities in waste segregation, clean environment guidelines, recycling, and active citizenship. Student volunteers hold street rallies and interact directly with shopkeepers and residents.',
      image: 'https://images.unsplash.com/photo-1464938050746-8a58f97782ac?auto=format&fit=crop&w=600&q=80',
      status: 'UPCOMING'
    }
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  // Filter projects by status
  const filteredProjects = filter === 'ALL'
    ? displayProjects
    : displayProjects.filter(p => p.status.toUpperCase() === filter);

  return (
    <div className="relative pt-20">
      {/* 1. HERO SECTION */}
      <section className="py-20 md:py-28 bg-dark-950 relative overflow-hidden">
        {/* Background Visual Overlay */}
        <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-5 md:px-10 z-10 text-center flex flex-col items-center relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase font-bold tracking-widest text-primary font-display block mb-4"
          >
            Portfolio
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[1.1] text-white max-w-4xl"
          >
            Our Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">Initiatives</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-grey-light text-base md:text-lg max-w-2xl leading-relaxed mt-6"
          >
            Browse the civic projects and campaigns run by Yuva Duty student volunteers across municipal circles.
          </motion.p>
        </div>
      </section>

      {/* 2. FILTER & PROJECTS LISTING */}
      <section className="py-16 bg-dark-900 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-16">
            {['ALL', 'PILOT', 'UPCOMING', 'COMPLETED'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider font-display uppercase border transition-all duration-300 ${
                  filter === cat
                    ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(255,106,0,0.3)]'
                    : 'bg-dark-950 text-white/60 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[250px]">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] glass rounded-2xl border border-white/5 p-8 max-w-md mx-auto">
              <FolderKanban className="w-12 h-12 text-white/20 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">No Projects Found</h4>
              <p className="text-grey text-sm text-center">There are no active initiatives matching this status filter at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((proj, idx) => (
                <motion.div
                  key={proj._id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass rounded-xl overflow-hidden border border-white/5 flex flex-col hover:border-primary/20 hover:shadow-[0_10px_35px_rgba(255,106,0,0.08)] group transition-all duration-300 text-left h-full"
                >
                  {/* Visual wrapper */}
                  <div className="h-60 sm:h-72 relative overflow-hidden bg-dark-800">
                    <img
                      src={proj.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80'}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <StatusBadge status={proj.status} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-90" />
                  </div>

                  {/* Info details */}
                  <div className="p-6 md:p-8 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold font-display text-white group-hover:text-primary transition-colors mb-3">
                        {proj.title}
                      </h3>
                      <p className="text-grey text-sm md:text-base leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. FUTURE PROJECTS PLACEHOLDER */}
      <section className="py-24 bg-dark-950 border-t border-white/5 relative z-10 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center flex flex-col items-center">
          <span className="text-xs uppercase font-extrabold tracking-widest text-primary font-display block mb-4">
            Future Goals
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight text-white mb-6">
            More Impact is Coming
          </h2>
          <p className="text-grey text-base md:text-lg max-w-2xl leading-relaxed mb-8">
            We are designing new modules focusing on digital civic awareness, traffic rules advocacy, and high school leadership camps. Keep an eye out for updates.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl mt-4">
            <div className="glass p-5 rounded-xl border border-white/5 text-center">
              <span className="text-xs uppercase tracking-wider font-bold text-primary font-display block mb-1">Coming Soon</span>
              <h4 className="text-sm font-bold text-white">Digital Civic Literacy</h4>
            </div>
            <div className="glass p-5 rounded-xl border border-white/5 text-center">
              <span className="text-xs uppercase tracking-wider font-bold text-primary font-display block mb-1">Coming Soon</span>
              <h4 className="text-sm font-bold text-white">Traffic Rules Advocacy</h4>
            </div>
            <div className="glass p-5 rounded-xl border border-white/5 text-center">
              <span className="text-xs uppercase tracking-wider font-bold text-primary font-display block mb-1">Coming Soon</span>
              <h4 className="text-sm font-bold text-white">Youth Civic Camps</h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
