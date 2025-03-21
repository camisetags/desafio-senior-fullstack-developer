interface StatusBadgeProps {
  status: 'pendente' | 'em_andamento' | 'concluido';
}

const statusConfig = {
  pendente: {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: '⏳'
  },
  em_andamento: {
    label: 'Em Andamento',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: '🔧'
  },
  concluido: {
    label: 'Concluído',
    className: 'bg-green-100 text-green-800 border-green-300',
    icon: '✅'
  },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span className={`text-sm px-2.5 py-0.5 rounded-full border ${config.className}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
