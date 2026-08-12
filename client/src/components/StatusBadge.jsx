import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyles = () => {
    const s = status ? status.toUpperCase() : '';
    
    switch (s) {
      case 'PILOT':
      case 'ACTIVE':
      case 'APPROVED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        
      case 'UPCOMING':
      case 'PENDING':
      case 'CONTACT-ESTABLISHED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        
      case 'COMPLETED':
      case 'REJECTED':
      case 'INACTIVE':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
        
      default:
        return 'bg-white/5 text-white/60 border-white/10';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyles()}`}>
      {status ? status.toUpperCase() : 'UNKNOWN'}
    </span>
  );
};

export default StatusBadge;
