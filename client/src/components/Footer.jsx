import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Mail, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-white/5 relative overflow-hidden z-10 pt-16 pb-8">
      {/* Subtle Glows */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-secondary/5 rounded-full filter blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="flex flex-col gap-5">
            <Logo size="md" />
            <p className="text-grey text-sm leading-relaxed mt-2">
              Yuva Duty is a youth-led initiative in India working to develop civic responsibility, social awareness, and community leadership among young people.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-dark-800 border border-white/5 hover:border-primary hover:text-primary flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-dark-800 border border-white/5 hover:border-primary hover:text-primary flex items-center justify-center transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@yuvaduty.org"
                className="w-9 h-9 rounded-full bg-dark-800 border border-white/5 hover:border-primary hover:text-primary flex items-center justify-center transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4 text-left">
            <h4 className="text-base font-bold font-display tracking-wider text-white">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/about" className="text-grey hover:text-primary text-sm transition-colors w-fit">
                About Us
              </Link>
              <Link to="/community" className="text-grey hover:text-primary text-sm transition-colors w-fit">
                Our Community
              </Link>
              <Link to="/projects" className="text-grey hover:text-primary text-sm transition-colors w-fit">
                Featured Projects
              </Link>
              <Link to="/join" className="text-grey hover:text-primary text-sm transition-colors w-fit">
                Join Movement
              </Link>
              <Link to="/contact" className="text-grey hover:text-primary text-sm transition-colors w-fit">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4 text-left">
            <h4 className="text-base font-bold font-display tracking-wider text-white">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-3">
              <p className="text-grey text-sm leading-relaxed">
                Have questions or want to partner with us? Drop us an email.
              </p>
              <a
                href="mailto:info@yuvaduty.org"
                className="text-white hover:text-primary text-sm font-semibold flex items-center gap-1.5 transition-colors w-fit"
              >
                <Mail className="w-4 h-4 text-primary" />
                info@yuvaduty.org
              </a>
            </div>
          </div>

          {/* Volunteer CTA */}
          <div className="flex flex-col gap-4 text-left">
            <h4 className="text-base font-bold font-display tracking-wider text-white">
              Be Part of Change
            </h4>
            <p className="text-grey text-sm leading-relaxed">
              Join our network of school and campus ambassadors making a difference today.
            </p>
            <Link to="/join" className="mt-2">
              <Button variant="outline" size="sm" icon={ArrowRight}>
                Volunteer Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-grey">
            &copy; {currentYear} YUVA DUTY. All rights reserved. Registered non-profit initiative.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/admin/login" className="text-xs text-white/20 hover:text-primary transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
