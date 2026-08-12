import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Logo from '../components/Logo';

const AdminLogin = () => {
  const { login, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all credentials.', 'error');
      return;
    }

    setLoading(true);
    showToast('Authorizing...', 'loading');

    const result = await login(email, password);

    if (result.success) {
      showToast('Logged in successfully! Welcome to Admin Panel.', 'success');
      navigate('/admin/dashboard');
    } else {
      showToast(result.message || 'Invalid email or password.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-20 pb-12 overflow-hidden bg-dark-950">
      {/* Background Visual Overlay */}
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full px-5 z-10 text-center relative">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <Logo size="lg" iconOnly />
          <h2 className="text-2xl font-extrabold font-display text-white">Admin Access Portal</h2>
          <p className="text-grey text-xs">Enter credentials to gain system permissions and edit site assets.</p>
        </div>

        {/* Credentials Form Box */}
        <form onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col gap-5 text-left">
          <FormInput
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@yuvaduty.org"
            required
          />

          <FormInput
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div className="flex items-center gap-2 mt-1 py-2 px-3 rounded-lg bg-primary/5 border border-primary/10">
            <ShieldAlert className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-[10px] text-grey leading-tight">
              Default credentials seeded initially: <br />
              <strong className="text-white font-mono">admin@yuvaduty.org</strong> / <strong className="text-white font-mono">admin_duty_2026</strong>
            </span>
          </div>

          <Button
            type="submit"
            loading={loading}
            icon={Lock}
            fullWidth
            className="mt-4"
          >
            Authorize Access
          </Button>
        </form>

        <p className="text-white/20 text-[10px] mt-6 select-none font-mono">
          SECURE IP AUDITED CONNECT | JWT AUTHORIZED
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
