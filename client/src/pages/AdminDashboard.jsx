import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, School, Briefcase, Calendar, Video, Mail, Settings, LogOut, 
  Plus, Edit, Trash2, Check, X, Shield, PlusCircle, AlertCircle, BarChart2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormTextarea from '../components/FormTextarea';
import StatusBadge from '../components/StatusBadge';
import Logo from '../components/Logo';

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Dashboard state
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data States
  const [stats, setStats] = useState({ totalVolunteers: 0, schoolsReached: 0, projectsCount: 0, communityMembers: 0 });
  const [registrations, setRegistrations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [videos, setVideos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States (Modal)
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'volunteer', 'school', 'project', 'activity', 'video'
  const [modalAction, setModalAction] = useState('create'); // 'create', 'edit'
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({});

  // Stats edit state
  const [statsForm, setStatsForm] = useState({ totalVolunteers: 0, schoolsReached: 0, projectsCount: 0, communityMembers: 0 });

  // Fetch all dashboard data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, regsRes, volsRes, schoolsRes, projsRes, actsRes, vidsRes, msgsRes] = await Promise.all([
        axios.get('/api/stats'),
        axios.get('/api/registrations'),
        axios.get('/api/volunteers'),
        axios.get('/api/schools'),
        axios.get('/api/projects'),
        axios.get('/api/activities'),
        axios.get('/api/videos'),
        axios.get('/api/contact')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
        setStatsForm(statsRes.data.data);
      }
      if (regsRes.data.success) setRegistrations(regsRes.data.data);
      if (volsRes.data.success) setVolunteers(volsRes.data.data);
      if (schoolsRes.data.success) setSchools(schoolsRes.data.data);
      if (projsRes.data.success) setProjects(projsRes.data.data);
      if (actsRes.data.success) setActivities(actsRes.data.data);
      if (vidsRes.data.success) setVideos(vidsRes.data.data);
      if (msgsRes.data.success) setMessages(msgsRes.data.data);
      
    } catch (err) {
      console.error('Error fetching dashboard details:', err);
      showToast('Failed to sync database logs. Verify admin authorization.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogoutClick = () => {
    logout();
    showToast('Logged out successfully.', 'success');
    navigate('/admin/login');
  };

  // ==========================================
  // REGISTRATIONS APPROVAL
  // ==========================================
  const handleRegistrationApproval = async (id, status) => {
    try {
      showToast('Updating status...', 'loading');
      const res = await axios.patch(`/api/registrations/${id}`, { status });
      if (res.data.success) {
        showToast(`Registration successfully ${status}.`, 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Action failed. Check connections.', 'error');
    }
  };

  // ==========================================
  // DELETE OPERATIONS (With Confirm)
  // ==========================================
  const handleDeleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to permanently delete this ${type}?`)) return;
    
    let url = `/api/${type}/${id}`;
    if (type === 'team') url = `/api/team/${id}`;
    if (type === 'testimonials') url = `/api/testimonials/${id}`;
    
    try {
      showToast('Deleting item...', 'loading');
      const res = await axios.delete(url);
      if (res.data.success) {
        showToast('Resource deleted successfully.', 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Delete operation failed.', 'error');
    }
  };

  // ==========================================
  // MODAL SUBMIT (CREATE & EDIT)
  // ==========================================
  const handleModalOpen = (type, action, item = null) => {
    setModalType(type);
    setModalAction(action);
    setSelectedId(item ? item._id : null);
    
    if (action === 'edit' && item) {
      setFormData(item);
    } else {
      // Set empty initial fields based on type
      if (type === 'volunteer') setFormData({ name: '', email: '', phone: '', role: 'Volunteer', city: '', status: 'active' });
      else if (type === 'school') setFormData({ name: '', location: '', contactPerson: '', email: '', phone: '', status: 'pending' });
      else if (type === 'project') setFormData({ title: '', description: '', image: '', status: 'PILOT', featured: false });
      else if (type === 'activity') setFormData({ title: '', description: '', date: '', location: '', image: '', status: 'upcoming' });
      else if (type === 'video') setFormData({ title: '', description: '', thumbnail: '', videoUrl: '' });
    }
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    showToast('Saving details...', 'loading');
    
    const isEdit = modalAction === 'edit';
    const baseUrl = `/api/${modalType === 'video' ? 'videos' : modalType}`;
    const url = isEdit ? `${baseUrl}/${selectedId}` : baseUrl;
    const method = isEdit ? 'patch' : 'post';
    
    try {
      const res = await axios[method](url, formData);
      if (res.data.success) {
        showToast('Saved successfully!', 'success');
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed. Review form inputs.', 'error');
    }
  };

  // Save Manual Stats
  const handleSaveStats = async (e) => {
    e.preventDefault();
    try {
      showToast('Saving statistics...', 'loading');
      const res = await axios.patch('/api/stats', statsForm);
      if (res.data.success) {
        showToast('Homepage statistics updated successfully!', 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Stats update failed.', 'error');
    }
  };

  const pendingRegs = registrations.filter(r => r.status === 'pending');

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col lg:flex-row text-left">
      {/* Sidebar Navigation */}
      <aside className="lg:w-64 bg-dark-900 border-r border-white/5 flex flex-col z-20">
        {/* Branding header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Logo size="sm" />
          <span className="text-[9px] bg-primary/20 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
            Admin
          </span>
        </div>

        {/* User Badge */}
        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold font-display text-sm">
            A
          </div>
          <div>
            <h5 className="text-xs font-semibold text-white">Yuva Duty Director</h5>
            <p className="text-[10px] text-grey">Role: Executive Admin</p>
          </div>
        </div>

        {/* Nav list */}
        <nav className="flex-grow p-4 flex flex-col gap-1.5">
          {[
            { id: 'dashboard', label: 'Analytics Panel', icon: BarChart2 },
            { id: 'registrations', label: `Registrations (${pendingRegs.length})`, icon: Settings },
            { id: 'volunteers', label: 'Volunteers List', icon: Users },
            { id: 'schools', label: 'School Network', icon: School },
            { id: 'projects', label: 'Initiatives', icon: Briefcase },
            { id: 'activities', label: 'Civic Activities', icon: Calendar },
            { id: 'videos', label: 'Videos Hub', icon: Video },
            { id: 'messages', label: `Contact Inbox (${messages.length})`, icon: Mail },
            { id: 'stats', label: 'Global Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/15' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Bottom link */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200"
          >
            <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Area */}
      <main className="flex-grow p-6 md:p-10 bg-dark-950 overflow-y-auto min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            {/* ==========================================
                1. TABS: ANALYTICS DASHBOARD
                ========================================== */}
            {activeTab === 'dashboard' && (
              <div className="flex flex-col gap-8">
                {/* Header title */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white">System Executive Dashboard</h1>
                  <p className="text-grey text-xs mt-1">Real-time statistics index, pending registration tallies, and active civic drives.</p>
                </div>

                {/* Counters Widgets grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                  <div className="glass p-5 rounded-xl border border-white/5 text-left">
                    <Users className="w-6 h-6 text-primary mb-2" />
                    <span className="text-2xl font-bold font-display text-white block">{stats.totalVolunteers}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-grey">Total Volunteers</span>
                  </div>
                  <div className="glass p-5 rounded-xl border border-white/5 text-left">
                    <Settings className="w-6 h-6 text-secondary mb-2" />
                    <span className="text-2xl font-bold font-display text-white block">{pendingRegs.length}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-grey">Pending Signups</span>
                  </div>
                  <div className="glass p-5 rounded-xl border border-white/5 text-left">
                    <School className="w-6 h-6 text-primary mb-2" />
                    <span className="text-2xl font-bold font-display text-white block">{schools.length}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-grey">Schools Joined</span>
                  </div>
                  <div className="glass p-5 rounded-xl border border-white/5 text-left">
                    <Briefcase className="w-6 h-6 text-secondary mb-2" />
                    <span className="text-2xl font-bold font-display text-white block">{projects.length}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-grey">Total Initiatives</span>
                  </div>
                  <div className="glass p-5 rounded-xl border border-white/5 text-left">
                    <Calendar className="w-6 h-6 text-primary mb-2" />
                    <span className="text-2xl font-bold font-display text-white block">{activities.length}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-grey">Civic Activities</span>
                  </div>
                </div>

                {/* Split list logs summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Pending applications */}
                  <div className="lg:col-span-7 glass p-6 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white font-display">Pending Applications</h3>
                      <button onClick={() => setActiveTab('registrations')} className="text-xs text-primary hover:underline">View All</button>
                    </div>
                    {pendingRegs.length === 0 ? (
                      <p className="text-grey text-xs">No pending applications at the moment.</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {pendingRegs.slice(0, 4).map(reg => (
                          <div key={reg._id} className="p-4 bg-dark-900 border border-white/5 rounded-lg flex items-center justify-between">
                            <div>
                              <h5 className="text-xs font-bold text-white">{reg.name}</h5>
                              <p className="text-[10px] text-grey">{reg.role} | {reg.city}, {reg.state}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleRegistrationApproval(reg._id, 'approved')} className="p-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleRegistrationApproval(reg._id, 'rejected')} className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick message log */}
                  <div className="lg:col-span-5 glass p-6 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white font-display">Recent Contact Messages</h3>
                      <button onClick={() => setActiveTab('messages')} className="text-xs text-primary hover:underline">Inbox</button>
                    </div>
                    {messages.length === 0 ? (
                      <p className="text-grey text-xs">Inbox is empty.</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {messages.slice(0, 4).map(msg => (
                          <div key={msg._id} className="p-4 bg-dark-900 border border-white/5 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <h5 className="text-xs font-bold text-white">{msg.name}</h5>
                              <span className="text-[9px] text-grey">{new Date(msg.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-[10px] text-grey-light italic truncate">"{msg.message}"</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                2. TABS: REGISTRATIONS LIST
                ========================================== */}
            {activeTab === 'registrations' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold font-display text-white">Join Us Registrations</h1>
                    <p className="text-grey text-xs mt-1">Approve applications to automatically provision user roles as Volunteers or Schools.</p>
                  </div>
                </div>

                <div className="glass rounded-xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-dark-900 border-b border-white/5 text-grey font-bold uppercase tracking-wider">
                          <th className="p-4">Name / Contact</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Organization / Location</th>
                          <th className="p-4">Motivation Statement</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="p-8 text-center text-grey">No applications logged in system.</td>
                          </tr>
                        ) : (
                          registrations.map(reg => (
                            <tr key={reg._id} className="border-b border-white/5 hover:bg-white/5">
                              <td className="p-4">
                                <div className="font-bold text-white">{reg.name}</div>
                                <div className="text-grey mt-0.5">{reg.email} | {reg.phone}</div>
                              </td>
                              <td className="p-4 font-semibold text-white">{reg.role}</td>
                              <td className="p-4">
                                <div className="text-white">{reg.organization || 'Individual'}</div>
                                <div className="text-grey mt-0.5">{reg.city}, {reg.state}</div>
                              </td>
                              <td className="p-4 max-w-xs truncate text-grey-light" title={reg.message}>
                                {reg.message}
                              </td>
                              <td className="p-4">
                                <StatusBadge status={reg.status} />
                              </td>
                              <td className="p-4">
                                <div className="flex justify-center gap-2">
                                  {reg.status === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => handleRegistrationApproval(reg._id, 'approved')}
                                        className="px-2.5 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors font-semibold"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleRegistrationApproval(reg._id, 'rejected')}
                                        className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-semibold"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  {reg.status !== 'pending' && (
                                    <span className="text-grey italic">Evaluated</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                3. TABS: VOLUNTEERS CRUD
                ========================================== */}
            {activeTab === 'volunteers' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold font-display text-white">Volunteers Registry</h1>
                    <p className="text-grey text-xs mt-1">Manage team directories, coordinates, and active engagement statuses.</p>
                  </div>
                  <Button size="sm" icon={Plus} onClick={() => handleModalOpen('volunteer', 'create')}>
                    Add Volunteer
                  </Button>
                </div>

                <div className="glass rounded-xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-dark-900 border-b border-white/5 text-grey font-bold uppercase tracking-wider">
                          <th className="p-4">Volunteer</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">City</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {volunteers.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="p-8 text-center text-grey">No volunteers registered.</td>
                          </tr>
                        ) : (
                          volunteers.map(vol => (
                            <tr key={vol._id} className="border-b border-white/5 hover:bg-white/5">
                              <td className="p-4 font-bold text-white">{vol.name}</td>
                              <td className="p-4 text-grey-light">{vol.email}</td>
                              <td className="p-4 text-grey-light">{vol.phone}</td>
                              <td className="p-4 font-semibold text-white">{vol.role}</td>
                              <td className="p-4 text-grey-light">{vol.city}</td>
                              <td className="p-4">
                                <StatusBadge status={vol.status} />
                              </td>
                              <td className="p-4">
                                <div className="flex justify-center gap-3">
                                  <button onClick={() => handleModalOpen('volunteer', 'edit', vol)} className="text-primary hover:text-primary-light">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteItem('volunteers', vol._id)} className="text-red-400 hover:text-red-300">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                4. TABS: SCHOOLS CRUD
                ========================================== */}
            {activeTab === 'schools' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold font-display text-white">School Networks</h1>
                    <p className="text-grey text-xs mt-1">Manage institutional partners hosting active School Awareness Workshops.</p>
                  </div>
                  <Button size="sm" icon={Plus} onClick={() => handleModalOpen('school', 'create')}>
                    Add Partner School
                  </Button>
                </div>

                <div className="glass rounded-xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-dark-900 border-b border-white/5 text-grey font-bold uppercase tracking-wider">
                          <th className="p-4">School Name</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">Contact Coordinator</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schools.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="p-8 text-center text-grey">No schools registered.</td>
                          </tr>
                        ) : (
                          schools.map(s => (
                            <tr key={s._id} className="border-b border-white/5 hover:bg-white/5">
                              <td className="p-4 font-bold text-white">{s.name}</td>
                              <td className="p-4 text-grey-light">{s.location}</td>
                              <td className="p-4 text-white font-semibold">{s.contactPerson}</td>
                              <td className="p-4 text-grey-light">{s.email}</td>
                              <td className="p-4 text-grey-light">{s.phone}</td>
                              <td className="p-4">
                                <StatusBadge status={s.status} />
                              </td>
                              <td className="p-4">
                                <div className="flex justify-center gap-3">
                                  <button onClick={() => handleModalOpen('school', 'edit', s)} className="text-primary hover:text-primary-light">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteItem('schools', s._id)} className="text-red-400 hover:text-red-300">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                5. TABS: PROJECTS CRUD
                ========================================== */}
            {activeTab === 'projects' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold font-display text-white">Project Portfolios</h1>
                    <p className="text-grey text-xs mt-1">Manage public projects displayed on the portfolio page.</p>
                  </div>
                  <Button size="sm" icon={Plus} onClick={() => handleModalOpen('project', 'create')}>
                    Create Initiative
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.length === 0 ? (
                    <div className="col-span-2 p-8 text-center text-grey glass rounded-xl border border-white/5">No active initiatives.</div>
                  ) : (
                    projects.map(proj => (
                      <div key={proj._id} className="glass p-5 rounded-xl border border-white/5 flex gap-4 text-left">
                        <img
                          src={proj.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80'}
                          alt={proj.title}
                          className="w-24 h-24 object-cover rounded-lg border border-white/10 flex-shrink-0"
                        />
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-bold text-white truncate max-w-[200px]">{proj.title}</h4>
                              <StatusBadge status={proj.status} />
                            </div>
                            <p className="text-[11px] text-grey line-clamp-2 leading-relaxed">{proj.description}</p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                            <span className="text-[9px] uppercase tracking-wider font-semibold text-primary">
                              {proj.featured ? '★ Featured' : 'General'}
                            </span>
                            <div className="flex gap-2">
                              <button onClick={() => handleModalOpen('project', 'edit', proj)} className="text-xs text-primary hover:underline">Edit</button>
                              <button onClick={() => handleDeleteItem('projects', proj._id)} className="text-xs text-red-400 hover:underline">Delete</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ==========================================
                6. TABS: ACTIVITIES CRUD
                ========================================== */}
            {activeTab === 'activities' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold font-display text-white">Civic Activities</h1>
                    <p className="text-grey text-xs mt-1">Manage single-day events, cleanup drives, and municipal coordination meetings.</p>
                  </div>
                  <Button size="sm" icon={Plus} onClick={() => handleModalOpen('activity', 'create')}>
                    Add Activity
                  </Button>
                </div>

                <div className="glass rounded-xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-dark-900 border-b border-white/5 text-grey font-bold uppercase tracking-wider">
                          <th className="p-4">Activity Name</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-grey">No activities scheduled.</td>
                          </tr>
                        ) : (
                          activities.map(act => (
                            <tr key={act._id} className="border-b border-white/5 hover:bg-white/5">
                              <td className="p-4 font-bold text-white">{act.title}</td>
                              <td className="p-4 text-grey-light">{new Date(act.date).toLocaleDateString()}</td>
                              <td className="p-4 text-grey-light">{act.location}</td>
                              <td className="p-4">
                                <StatusBadge status={act.status} />
                              </td>
                              <td className="p-4">
                                <div className="flex justify-center gap-3">
                                  <button onClick={() => handleModalOpen('activity', 'edit', act)} className="text-primary hover:text-primary-light">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteItem('activities', act._id)} className="text-red-400 hover:text-red-300">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                7. TABS: VIDEOS HUB
                ========================================== */}
            {activeTab === 'videos' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold font-display text-white">Educational Video Assets</h1>
                    <p className="text-grey text-xs mt-1">Manage public resources, YouTube embeds, and workshop highlight videos.</p>
                  </div>
                  <Button size="sm" icon={Plus} onClick={() => handleModalOpen('video', 'create')}>
                    Upload Video Link
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {videos.length === 0 ? (
                    <div className="col-span-3 p-8 text-center text-grey glass rounded-xl border border-white/5">No video links uploaded.</div>
                  ) : (
                    videos.map(vid => (
                      <div key={vid._id} className="glass rounded-xl overflow-hidden border border-white/5 hover:border-primary/10 transition-colors flex flex-col text-left">
                        <img
                          src={vid.thumbnail || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80'}
                          alt={vid.title}
                          className="h-40 w-full object-cover border-b border-white/5"
                        />
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">{vid.title}</h4>
                            <p className="text-[10px] text-grey line-clamp-2 leading-relaxed">{vid.description}</p>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/5">
                            <span className="text-[9px] text-grey font-mono truncate max-w-[120px]">{vid.videoUrl}</span>
                            <button onClick={() => handleDeleteItem('videos', vid._id)} className="text-red-400 hover:text-red-300">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ==========================================
                8. TABS: CONTACT INBOX MESSAGES
                ========================================== */}
            {activeTab === 'messages' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-2xl font-extrabold font-display text-white">Contact Inbox</h1>
                  <p className="text-grey text-xs mt-1">Read feedback, partner requests, and queries received from the public Contact Form.</p>
                </div>

                <div className="flex flex-col gap-4">
                  {messages.length === 0 ? (
                    <div className="p-8 text-center text-grey glass rounded-xl border border-white/5">No messages received.</div>
                  ) : (
                    messages.map(msg => (
                      <div key={msg._id} className="glass p-5 rounded-xl border border-white/5 text-left flex flex-col gap-2">
                        <div className="flex justify-between items-start border-b border-white/5 pb-3">
                          <div>
                            <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                            <p className="text-[10px] text-grey mt-0.5">{msg.email} | {msg.phone || 'No Phone'}</p>
                          </div>
                          <span className="text-[9px] text-grey bg-white/5 px-2 py-1 rounded">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-primary mb-1">Subject: {msg.subject}</h5>
                          <p className="text-xs text-grey-light leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ==========================================
                9. TABS: GLOBAL STATISTICS EDIT
                ========================================== */}
            {activeTab === 'stats' && (
              <div className="max-w-xl mx-auto flex flex-col gap-6 text-left">
                <div>
                  <h1 className="text-2xl font-extrabold font-display text-white">Global Settings & Statistics</h1>
                  <p className="text-grey text-xs mt-1">Directly edit the numerical counters displayed on the homepage impact section.</p>
                </div>

                <form onSubmit={handleSaveStats} className="glass p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col gap-5">
                  <FormInput
                    label="Total Volunteers Counter"
                    id="totalVolunteers"
                    type="number"
                    value={statsForm.totalVolunteers}
                    onChange={(e) => setStatsForm({ ...statsForm, totalVolunteers: Number(e.target.value) })}
                    required
                  />

                  <FormInput
                    label="Schools Reached Counter"
                    id="schoolsReached"
                    type="number"
                    value={statsForm.schoolsReached}
                    onChange={(e) => setStatsForm({ ...statsForm, schoolsReached: Number(e.target.value) })}
                    required
                  />

                  <FormInput
                    label="Active Projects Counter"
                    id="projectsCount"
                    type="number"
                    value={statsForm.projectsCount}
                    onChange={(e) => setStatsForm({ ...statsForm, projectsCount: Number(e.target.value) })}
                    required
                  />

                  <FormInput
                    label="Community Members Counter"
                    id="communityMembers"
                    type="number"
                    value={statsForm.communityMembers}
                    onChange={(e) => setStatsForm({ ...statsForm, communityMembers: Number(e.target.value) })}
                    required
                  />

                  <Button type="submit" className="mt-4">
                    Save Statistics Config
                  </Button>
                </form>
              </div>
            )}
          </>
        )}
      </main>

      {/* CRUD MANAGEMENT OVERLAY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass max-w-lg w-full rounded-2xl border border-white/10 p-6 md:p-8 text-left relative overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold font-display text-white capitalize">
                {modalAction} {modalType}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white text-xs font-semibold">
                ✕
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleModalSubmit} className="flex flex-col gap-4">
              
              {/* VOLUNTEER FIELDS */}
              {modalType === 'volunteer' && (
                <>
                  <FormInput
                    label="Full Name"
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <FormInput
                    label="Email Address"
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Phone"
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                    <FormInput
                      label="City"
                      id="city"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                      label="Role Designation"
                      id="role"
                      value={formData.role || 'Volunteer'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      options={[
                        { value: 'Volunteer', label: 'Volunteer' },
                        { value: 'School Ambassador', label: 'School Ambassador' },
                        { value: 'Campus Coordinator', label: 'Campus Coordinator' },
                        { value: 'Mentor', label: 'Mentor' }
                      ]}
                      required
                    />
                    <FormSelect
                      label="Volunteer Status"
                      id="status"
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' }
                      ]}
                      required
                    />
                  </div>
                </>
              )}

              {/* SCHOOL FIELDS */}
              {modalType === 'school' && (
                <>
                  <FormInput
                    label="School Name"
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <FormInput
                    label="Location (City, State)"
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                  <FormInput
                    label="Contact Person Coordinator"
                    id="contactPerson"
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Email Address"
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <FormInput
                      label="Phone"
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <FormSelect
                    label="Status"
                    id="status"
                    value={formData.status || 'pending'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    options={[
                      { value: 'active', label: 'Active Partner' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'contact-established', label: 'Contact Established' }
                    ]}
                    required
                  />
                </>
              )}

              {/* PROJECT FIELDS */}
              {modalType === 'project' && (
                <>
                  <FormInput
                    label="Project Title"
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <FormInput
                    label="Image URL"
                    id="image"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                      label="Status Code"
                      id="status"
                      value={formData.status || 'PILOT'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      options={[
                        { value: 'PILOT', label: 'Pilot Project' },
                        { value: 'UPCOMING', label: 'Upcoming' },
                        { value: 'COMPLETED', label: 'Completed' }
                      ]}
                      required
                    />
                    <FormSelect
                      label="Featured Flag"
                      id="featured"
                      value={formData.featured === true ? 'true' : 'false'}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.value === 'true' })}
                      options={[
                        { value: 'false', label: 'No' },
                        { value: 'true', label: 'Yes (Feature on Home)' }
                      ]}
                      required
                    />
                  </div>
                  <FormTextarea
                    label="Description"
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </>
              )}

              {/* ACTIVITY FIELDS */}
              {modalType === 'activity' && (
                <>
                  <FormInput
                    label="Activity Title"
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Activity Date"
                      id="date"
                      type="date"
                      value={formData.date ? formData.date.split('T')[0] : ''}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                    <FormInput
                      label="Location"
                      id="location"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Image URL"
                      id="image"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                    <FormSelect
                      label="Status"
                      id="status"
                      value={formData.status || 'upcoming'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      options={[
                        { value: 'upcoming', label: 'Upcoming' },
                        { value: 'completed', label: 'Completed' }
                      ]}
                      required
                    />
                  </div>
                  <FormTextarea
                    label="Description"
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </>
              )}

              {/* VIDEO FIELDS */}
              {modalType === 'video' && (
                <>
                  <FormInput
                    label="Video Title"
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <FormInput
                    label="Video Embed URL"
                    id="videoUrl"
                    value={formData.videoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    required
                  />
                  <FormInput
                    label="Thumbnail Image URL"
                    id="thumbnail"
                    value={formData.thumbnail || ''}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  />
                  <FormTextarea
                    label="Short Description"
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
                <Button variant="ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
