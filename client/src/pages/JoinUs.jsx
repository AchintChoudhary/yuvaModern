import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, School, HeartHandshake, BookOpen, Send, Sparkles, CheckCircle } from 'lucide-react';
import axios from 'axios';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormTextarea from '../components/FormTextarea';
import { useToast } from '../context/ToastContext';

const JoinUs = () => {
  const { showToast } = useToast();
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    state: '',
    role: '',
    organization: '',
    message: '',
    socialLinks: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const roles = [
    {
      key: 'Student',
      title: 'Student Member',
      icon: GraduationCap,
      description: 'Are you a school or college student? Join our volunteer drives, learn basic civic rules, and lead clean campaigns on campuses.'
    },
    {
      key: 'Volunteer',
      title: 'General Volunteer',
      icon: Users,
      description: 'Open to youth, working professionals, and civic enthusiasts. Help manage on-ground clusters, logistics, and drives.'
    },
    {
      key: 'School',
      title: 'Partner School',
      icon: School,
      description: 'Register your primary or high school to run the School Awareness Program. Educate your junior classes with gamified drills.'
    },
    {
      key: 'Teacher',
      title: 'Faculty Advisor',
      icon: BookOpen,
      description: 'Help guide student leaders inside school/college chapters, coordinate dates, and monitor safety guidelines.'
    },
    {
      key: 'NGO',
      title: 'NGO Partner',
      icon: HeartHandshake,
      description: 'Collaborate on waste disposal, sanitation, recycling logistics, or support city-wide active citizenship drives.'
    }
  ];

  const handleRoleSelect = (roleKey) => {
    setFormData((prev) => ({ ...prev, role: roleKey }));
    
    // Scroll to form smoothly
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    showToast(`Role selected: ${roleKey}. Please fill in the details below.`, 'info');
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email address is invalid';
    }
    
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      tempErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.age) {
      tempErrors.age = 'Age is required';
    } else if (Number(formData.age) < 10 || Number(formData.age) > 100) {
      tempErrors.age = 'Please enter a realistic age';
    }
    
    if (!formData.city.trim()) tempErrors.city = 'City is required';
    if (!formData.state.trim()) tempErrors.state = 'State is required';
    if (!formData.role) tempErrors.role = 'Please select a role from the cards or dropdown';
    if (!formData.message.trim()) tempErrors.message = 'Please explain why you want to join Yuva Duty';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please correct validation errors in the form.', 'error');
      return;
    }

    setLoading(true);
    showToast('Submitting application...', 'loading');

    try {
      const res = await axios.post('/api/registrations', formData);
      if (res.data.success) {
        setIsSuccess(true);
        showToast('Registration submitted! Welcome to the movement.', 'success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          age: '',
          city: '',
          state: '',
          role: '',
          organization: '',
          message: '',
          socialLinks: ''
        });
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to submit registration. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'Student', label: 'Student Member' },
    { value: 'Volunteer', label: 'General Volunteer' },
    { value: 'School', label: 'Partner School' },
    { value: 'Teacher', label: 'Faculty Advisor' },
    { value: 'NGO', label: 'NGO Partner' }
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
            Find Your Fit
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[1.1] text-white max-w-4xl"
          >
            Find Your Role in <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">
              the Movement
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-grey-light text-base md:text-lg max-w-2xl leading-relaxed mt-6"
          >
            Select a role that fits your profile, then submit your credentials. We review applications weekly.
          </motion.p>
        </div>
      </section>

      {/* 2. CHOOSE ROLE CARDS */}
      <section className="py-16 bg-dark-900 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SectionHeading
            subtitle="Step 1"
            title="Select Your Role"
            description="Click a role card to lock it, which pre-populates the registration form below."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
            {roles.map((r, idx) => {
              const Icon = r.icon;
              const isSelected = formData.role === r.key;
              return (
                <motion.div
                  key={r.key}
                  onClick={() => handleRoleSelect(r.key)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className={`glass-card p-6 rounded-xl border flex flex-col justify-between text-left cursor-pointer group transition-all duration-300 ${
                    isSelected 
                      ? 'border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(255,106,0,0.15)]' 
                      : 'border-white/5 hover:border-primary/20'
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className={`p-3.5 rounded-lg w-fit transition-colors duration-300 ${
                      isSelected 
                        ? 'bg-primary text-white' 
                        : 'bg-dark-800 text-primary border border-white/5 group-hover:border-primary/20'
                    }`}>
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors">
                        {r.title}
                      </h4>
                      <p className="text-grey text-xs leading-relaxed mt-2">
                        {r.description}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-bold font-display uppercase tracking-widest mt-6 block transition-colors duration-300 ${
                    isSelected ? 'text-primary' : 'text-white/20 group-hover:text-white/60'
                  }`}>
                    {isSelected ? 'Selected' : 'Select'}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. APPLICATION REGISTRATION FORM */}
      <section ref={formRef} className="py-24 bg-dark-950 border-t border-white/5 relative z-10 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-5 md:px-10 relative">
          <SectionHeading
            subtitle="Step 2"
            title="Submit Registration"
            description="Complete the form details. All approved volunteers receive civic credentials and certificates."
          />

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-8 md:p-12 rounded-2xl border border-primary/20 text-center flex flex-col items-center gap-6"
            >
              <CheckCircle className="w-16 h-16 text-primary animate-bounce" />
              <div>
                <h3 className="text-2xl font-bold font-display text-white">Application Received!</h3>
                <p className="text-grey text-base leading-relaxed mt-3 max-w-lg mx-auto">
                  Thank you for registering. Our outreach coordinators will evaluate your credentials and email you details regarding local clusters and onboarding sessions.
                </p>
              </div>
              <Button onClick={() => setIsSuccess(false)}>
                Submit Another Application
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="glass p-6 md:p-10 rounded-2xl border border-white/5 flex flex-col gap-6 text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-primary font-display block mb-2">
                Application Form
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormInput
                  label="Full Name"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                  error={errors.name}
                />

                <FormInput
                  label="Email Address"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                  error={errors.email}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <FormInput
                  label="Phone Number"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  required
                  error={errors.phone}
                />

                <FormInput
                  label="Age"
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Your age"
                  required
                  error={errors.age}
                />

                <FormSelect
                  label="Selected Role"
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  options={roleOptions}
                  required
                  error={errors.role}
                  placeholder="Choose your role"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormInput
                  label="City"
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Pune"
                  required
                  error={errors.city}
                />

                <FormInput
                  label="State"
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Maharashtra"
                  required
                  error={errors.state}
                />
              </div>

              <FormInput
                label="School / College / Organization"
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Name of your educational institute or organization"
              />

              <FormInput
                label="Social Links (Optional)"
                id="socialLinks"
                value={formData.socialLinks}
                onChange={(e) => setFormData({ ...formData, socialLinks: e.target.value })}
                placeholder="LinkedIn, Instagram, or GitHub profile links"
              />

              <FormTextarea
                label="Why do you want to join Yuva Duty?"
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Explain why you want to support civic awareness and active citizenship drives"
                required
                error={errors.message}
              />

              <Button
                type="submit"
                loading={loading}
                icon={Send}
                className="mt-4"
              >
                Submit Application
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default JoinUs;
