export const getRiskColor = (risk) => {
  if (risk >= 70) return 'bg-red-500';
  if (risk >= 40) return 'bg-amber-500';
  return 'bg-emerald-500';
};

export const getRiskBg = (risk) => {
  if (risk >= 70) return 'bg-red-50 border-red-200';
  if (risk >= 40) return 'bg-amber-50 border-amber-200';
  return 'bg-emerald-50 border-emerald-200';
};

export const getStatusBadge = (status) => {
  const styles = {
    critical: 'bg-red-100 text-red-700 border border-red-200',
    warning: 'bg-amber-100 text-amber-700 border border-amber-200',
    healthy: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  };
  return styles[status];
};

export const generateCapacityData = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
    });
  }
  return days;
};
