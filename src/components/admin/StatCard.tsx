'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'green' | 'red' | 'orange' | 'blue' | 'gray';
  icon?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  subtitle,
  color = 'blue',
  icon,
}: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-500/10 border-green-500',
    red: 'bg-red-500/10 border-red-500',
    orange: 'bg-orange-500/10 border-orange-500',
    blue: 'bg-blue-500/10 border-blue-500',
    gray: 'bg-gray-500/10 border-gray-500',
  };

  const colorTextClasses = {
    green: 'text-green-500',
    red: 'text-red-500',
    orange: 'text-orange-500',
    blue: 'text-blue-500',
    gray: 'text-gray-500',
  };

  return (
    <div
      className={`rounded-lg p-6 border-2 ${colorClasses[color]} hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#B4B4B4]">{title}</h3>
        {icon && <div className={`${colorTextClasses[color]} text-lg`}>{icon}</div>}
      </div>

      <div className={`text-3xl font-bold ${colorTextClasses[color]} mb-2`}>
        {value}
      </div>

      {subtitle && <p className="text-xs text-[#666666]">{subtitle}</p>}
    </div>
  );
}
