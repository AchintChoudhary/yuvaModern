import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Instagram, Linkedin, Send, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import FormInput from '../components/FormInput';
import FormTextarea from '../components/FormTextarea';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email address is invalid';
    }

    if (!formData.message.trim()) tempErrors.message = 'Message is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please correct form validation errors.', 'error');
      return;
    }

    setLoading(true);
    showToast('Sending message...', 'loading');

    try {
      const res = await axios.post('/api/contact', formData);
      if (res.data.success) {
        setSubmitted(true);
        showToast('Message sent! We will contact you soon.', 'success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to send message. Please check connections.', 'error');
    } finally {
      setLoading(false);
    }
  };

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
            Connect
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[1.1] text-white max-w-4xl"
          >
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-grey-light text-base md:text-lg max-w-2xl leading-relaxed mt-6"
          >
            Have query, partnership offer, or feedback? Send us a message or join our social clusters.
          </motion.p>
        </div>
      </section>

      {/* 2. CONTACT PANELS */}
      <section className="py-20 bg-dark-900 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
            
            {/* Info Panel - 5 cols */}
            <div className="lg:col-span-5 text-left flex flex-col gap-8 justify-start">
              <div>
                <h3 className="text-xl font-bold font-display text-white mb-2">Connect Directly</h3>
                <p className="text-grey text-sm">We respond to student inquiries and institutional partnerships within 48 hours.</p>
              </div>

              {/* Direct Info list */}
              <div className="flex flex-col gap-5">
                <div className="glass p-5 rounded-xl border border-white/5 flex items-start gap-4">
                  <div className="p-3 bg-dark-950 border border-white/5 rounded-lg text-primary">
                    <Mail className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-grey uppercase tracking-widest">Email Address</h5>
                    <a href="mailto:info@yuvaduty.org" className="text-base text-white hover:text-primary font-semibold transition-colors mt-1 block">
                      info@yuvaduty.org
                    </a>
                  </div>
                </div>

                <div className="glass p-5 rounded-xl border border-white/5 flex items-start gap-4">
                  <div className="p-3 bg-dark-950 border border-white/5 rounded-lg text-primary">
                    <Phone className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-grey uppercase tracking-widest">Phone Support</h5>
                    <a href="tel:+919876543210" className="text-base text-white hover:text-primary font-semibold transition-colors mt-1 block">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="glass p-5 rounded-xl border border-white/5 flex items-start gap-4">
                  <div className="p-3 bg-dark-950 border border-white/5 rounded-lg text-primary">
                    <MapPin className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-grey uppercase tracking-widest">Location Hub</h5>
                    <span className="text-base text-white font-semibold mt-1 block">
                      Mumbai & New Delhi, India
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold font-display text-white">Social Media Profiles</h4>
                <div className="flex items-center gap-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-grey hover:text-primary transition-colors border border-white/5 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-lg"
                  >
                    <Instagram className="w-4 h-4 text-primary" />
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3 text-white/40" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-grey hover:text-primary transition-colors border border-white/5 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-lg"
                  >
                    <Linkedin className="w-4 h-4 text-primary" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 text-white/40" />
                  </a>
                </div>
              </div>
            </div>

            {/* Form Panel - 7 cols */}
            <div className="lg:col-span-7">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass p-8 md:p-12 rounded-2xl border border-primary/20 text-center flex flex-col items-center gap-6"
                >
                  <ShieldCheck className="w-16 h-16 text-primary" />
                  <div>
                    <h3 className="text-2xl font-bold font-display text-white">Message Sent!</h3>
                    <p className="text-grey text-base leading-relaxed mt-3">
                      Thank you for contacting Yuva Duty. We have received your query and will follow up shortly via email.
                    </p>
                  </div>
                  <Button onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col gap-5 text-left">
                  <span className="text-xs uppercase font-bold tracking-widest text-primary font-display block mb-1">
                    Send a Message
                  </span>

                  <FormInput
                    label="Your Name"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                    error={errors.name}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormInput
                      label="Email Address"
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. name@email.com"
                      required
                      error={errors.email}
                    />

                    <FormInput
                      label="Phone Number"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter 10-digit number"
                    />
                  </div>

                  <FormInput
                    label="Subject"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Subject of your message"
                  />

                  <FormTextarea
                    label="Your Message"
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your query or suggestion in detail..."
                    required
                    error={errors.message}
                  />

                  <Button
                    type="submit"
                    loading={loading}
                    icon={Send}
                    className="mt-2"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAP OVERLAY SECTION */}
      <section className="py-24 bg-dark-950 border-t border-white/5 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SectionHeading
            subtitle="Locations"
            title="Our Active Hubs"
            description="We coordinate civic awareness camps from major municipal zones."
          />

          {/* Map mockup */}
          <div className="h-96 w-full rounded-2xl border border-white/5 overflow-hidden relative group">
            {/* Embedded grid overlay for visual depth */}
            <div className="absolute inset-0 bg-grid opacity-25 z-0" />
            <div className="absolute inset-0 bg-dark-950/80 z-10 pointer-events-none" />
            
            {/* Visual content: dark premium abstract background representing India Map location markers */}
            <div className="absolute inset-0 z-0 flex items-center justify-center bg-radial-gradient">
              <div className="relative w-full h-full max-w-lg flex items-center justify-center">
                {/* Visual Circle markers representing hubs */}
                <div className="absolute top-1/3 left-1/3 flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary border-4 border-dark-950 animate-ping absolute" />
                  <div className="w-3.5 h-3.5 rounded-full bg-primary border-4 border-dark-950 relative z-10" />
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-1.5 text-white bg-dark-900 border border-white/10 px-1.5 py-0.5 rounded shadow">Delhi Hub</span>
                </div>

                <div className="absolute top-2/3 left-1/2 flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-secondary border-4 border-dark-950 animate-ping absolute" />
                  <div className="w-3.5 h-3.5 rounded-full bg-secondary border-4 border-dark-950 relative z-10" />
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-1.5 text-white bg-dark-900 border border-white/10 px-1.5 py-0.5 rounded shadow">Mumbai Hub</span>
                </div>

                <div className="absolute top-1/2 left-2/3 flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary border-4 border-dark-950 relative z-10" />
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-1.5 text-white bg-dark-900 border border-white/10 px-1.5 py-0.5 rounded shadow">Kolkata Network</span>
                </div>

                <div className="absolute top-3/4 left-1/3 flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary border-4 border-dark-950 relative z-10" />
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-1.5 text-white bg-dark-900 border border-white/10 px-1.5 py-0.5 rounded shadow">Pune Cluster</span>
                </div>
              </div>
            </div>
            
            {/* Center prompt text overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-black/60 backdrop-blur-sm opacity-100 group-hover:opacity-0 transition-opacity duration-500">
              <MapPin className="w-10 h-10 text-primary mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Regional Operational Networks</h4>
              <p className="text-grey text-sm max-w-md text-center">We currently manage school awareness drives and community cleaning events in Delhi, Mumbai, Kolkata, and Pune. Expanding soon to South India.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
