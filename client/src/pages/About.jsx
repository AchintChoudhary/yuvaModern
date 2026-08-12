import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Sparkles, Shield, Award, Users, Rocket, Heart } from 'lucide-react';
import axios from 'axios';
import SectionHeading from '../components/SectionHeading';
import AnimatedCard from '../components/AnimatedCard';

const About = () => {
  const [team, setTeam] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get('/api/team');
        if (res.data.success) {
          setTeam(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to fetch team members, using fallback entries:', err);
      } finally {
        setLoadingTeam(false);
      }
    };
    fetchTeam();
  }, []);

  const defaultTeam = [
    {
      _id: '1',
      name: 'Achint',
      role: 'Founder & Director',
      bio: 'Passionate about mobilizing the Indian student fraternity to build disciplined civic habits and grassroots social leadership.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      linkedin: 'https://linkedin.com'
    },
    {
      _id: '2',
      name: 'Ananya Roy',
      role: 'Co-Founder & Operations Lead',
      bio: 'Expert in operational coordination, scaling youth operations to over 10+ partner schools and managing volunteer workflows.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      linkedin: 'https://linkedin.com'
    }
  ];

  const displayTeam = team.length > 0 ? team : defaultTeam;

  const timelineSteps = [
    {
      year: 'The Spark (2025)',
      title: 'Realizing the Gap',
      description: 'During a local cleanliness drive, our founders noticed that while students wanted to help, there was no organized community or system to channel youth civic action in India.'
    },
    {
      year: 'Foundation (Late 2025)',
      title: 'Launching Yuva Duty',
      description: 'Yuva Duty was registered as a student-led non-profit initiative, starting with 10 passionate volunteer student leaders and one core focus: civic responsibility.'
    },
    {
      year: 'First Success (Early 2026)',
      title: 'School Awareness Pilot',
      description: 'Launched our School Awareness Program pilot, delivering basic civic awareness, waste sorting guidelines, and traffic safety rules to 500+ young school children.'
    },
    {
      year: 'Present Day (2026)',
      title: 'Building the Movement',
      description: 'Now extending across multiple colleges and schools, empowering student coordinators to lead their own localized civic actions.'
    }
  ];

  const values = [
    { icon: Shield, title: 'Integrity', text: 'We maintain absolute transparency in our operations, funding, and volunteer coordination.' },
    { icon: Heart, title: 'Respect', text: 'We respect every citizen, municipal worker, and community member, working collaboratively.' },
    { icon: Award, title: 'Service', text: 'Active on-ground action is the heart of what we do. We serve with humility.' },
    { icon: Rocket, title: 'Innovation', text: 'We design creative, gamified workshops to keep children engaged in civic learning.' },
    { icon: Users, title: 'Leadership', text: 'We delegate complete ownership of drives to students, molding tomorrow\'s social changemakers.' }
  ];

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
            Our Philosophy
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[1.1] text-white max-w-3xl"
          >
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">Yuva Duty</span> Exists
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-grey-light text-base md:text-lg max-w-2xl leading-relaxed mt-6"
          >
            We believe that to build a better India tomorrow, we must empower our students to take ownership of their local communities today.
          </motion.p>
        </div>
      </section>

      {/* 2. OUR STORY TIMELINE */}
      <section className="py-24 bg-dark-900 border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <SectionHeading
            subtitle="The Journey"
            title="Our Story"
            description="How a simple observation transformed into a growing student movement for civic action."
          />

          <div className="relative border-l border-white/10 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:bottom-0 md:before:w-[1px] md:before:bg-white/10 mt-16 pl-6 md:pl-0 flex flex-col gap-12">
            {timelineSteps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={step.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex flex-col md:w-1/2 ${
                    isEven ? 'md:ml-auto md:pl-12 md:text-left' : 'md:mr-auto md:pr-12 md:text-right md:items-end'
                  }`}
                >
                  {/* Circle Indicator on timeline */}
                  <div className="absolute top-1 left-[-29px] md:left-auto md:top-1.5 w-[14px] h-[14px] rounded-full bg-primary border-4 border-dark-900 z-10 shadow-[0_0_10px_rgba(255,106,0,0.5)] md:translate-x-1.5 md:left-[-7px]" 
                       style={{ left: !isEven ? 'auto' : undefined, right: !isEven ? '-7px' : undefined }}
                  />

                  <div className="glass p-6 md:p-8 rounded-xl border border-white/5 relative hover:border-primary/20 transition-colors duration-300">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-primary font-display block mb-1">
                      {step.year}
                    </span>
                    <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-grey text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FOUNDER MESSAGE */}
      <section className="py-24 bg-dark-950 border-t border-white/5 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-secondary/5 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Wrap */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                alt="Achint - Founder"
                className="w-full h-[450px] object-cover rounded-2xl border border-white/5 shadow-2xl relative z-10"
              />
              {/* Outer orange outline */}
              <div className="absolute inset-2 border border-primary/20 rounded-2xl pointer-events-none z-20 group-hover:scale-98 transition-transform duration-300" />
            </motion.div>

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 text-left flex flex-col gap-6"
            >
              <span className="text-xs uppercase font-bold tracking-widest text-primary font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Message From the Founder
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight text-white">
                "Real civic change doesn't happen by waiting — it happens by doing."
              </h2>
              <p className="text-grey text-base leading-relaxed">
                As young citizens of India, we are often taught civic responsibility in books, yet we witness civic neglect daily. Yuva Duty was born out of a simple question: *What if our massive youth population took active responsibility for local community reforms?*
              </p>
              <p className="text-grey text-base leading-relaxed">
                We believe that when students lead local drives, they don't just solve immediate problems; they cultivate lifelong habits of responsibility, accountability, and leadership.
              </p>
              <div className="mt-4">
                <h4 className="text-lg font-bold text-white font-display">Achint</h4>
                <p className="text-xs uppercase tracking-widest text-primary font-semibold mt-1">
                  Founder & Director, Yuva Duty
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. MEET OUR TEAM */}
      <section className="py-24 bg-dark-900 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SectionHeading
            subtitle="The Architects"
            title="Meet Our Team"
            description="The dedicated student changemakers steering our civic programs and partner networks."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {displayTeam.map((member) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="glass rounded-xl overflow-hidden border border-white/5 flex flex-col h-full group hover:border-primary/20 transition-all duration-300 text-left"
              >
                {/* Photo */}
                <div className="h-72 relative overflow-hidden bg-dark-800">
                  <img
                    src={member.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />
                </div>

                {/* Info */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold font-display text-white group-hover:text-primary transition-colors mb-1">
                      {member.name}
                    </h4>
                    <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">
                      {member.role}
                    </p>
                    <p className="text-grey text-sm leading-relaxed mb-6">
                      {member.bio}
                    </p>
                  </div>

                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-lg bg-dark-800 border border-white/5 hover:border-primary hover:text-primary flex items-center justify-center transition-all duration-300"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CORE VALUES GRID */}
      <section className="py-24 bg-dark-950 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SectionHeading
            subtitle="The Foundations"
            title="Core Values"
            description="Our organizational culture is built upon these principles, ensuring meaningful, long-term impact."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="glass p-6 md:p-8 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300 text-left flex items-start gap-4 group"
                >
                  <div className="p-3 bg-dark-900 rounded-lg text-primary border border-white/5 group-hover:border-primary/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-display text-white mb-2 group-hover:text-primary transition-colors">
                      {v.title}
                    </h4>
                    <p className="text-grey text-sm leading-relaxed">
                      {v.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
