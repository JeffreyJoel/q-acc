import { Medal, Target, CheckCircle } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle }) => (
  <div className="bg-neutral-800 rounded-2xl p-6">
    <h3 className="text-sm text-neutral-400 uppercase tracking-wider mb-2">{title}</h3>
    <div className="text-4xl font-bold text-white mb-1">{value}</div>
    {subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
  </div>
);

interface TokenStatProps {
  symbol: string;
  amount: number;
}

const TokenStat: React.FC<TokenStatProps> = ({ symbol, amount }) => (
  <div className="flex justify-between items-center py-3 border-b border-neutral-700 last:border-0">
    <span className="font-mono text-neutral-300">{symbol}</span>
    <span className="font-medium text-white">{amount}</span>
  </div>
);

interface AchievementProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Achievement: React.FC<AchievementProps> = ({ icon, title, description }) => (
  <div className="bg-neutral-800 rounded-2xl p-6 flex gap-4">
    <div className="text-peach-400">
      {icon}
    </div>
    <div>
      <h3 className="font-medium text-white mb-1">{title}</h3>
      <p className="text-sm text-neutral-400">{description}</p>
    </div>
  </div>
);

const Stats: React.FC = () => {
  const tokenStats = [
    { symbol: 'X23', amount: 40 },
    { symbol: 'CTZN', amount: 80 },
    { symbol: 'GRID', amount: 120 },
    { symbol: 'PRSM', amount: 150 },
    { symbol: '2MOON', amount: 75 },
    { symbol: 'H2D', amount: 320 },
    { symbol: 'WPACK', amount: 90 },
    { symbol: 'X23 - Round 1', amount: 350 },
    { symbol: 'X23 - Round 2', amount: 583 },
  ];

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="PROJECTS FUNDED" value={8} />
        <StatsCard title="ROUNDS PARTICIPATED" value={3} />
        <StatsCard title="TOTAL VALUE LOCKED" value="$24,500" />
      </div>

      <div className="bg-neutral-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Tokens Per Project</h2>
        <div className="divide-y divide-neutral-700">
          {tokenStats.map((token) => (
            <TokenStat key={token.symbol} {...token} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Q/ACC Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Achievement
            icon={<Medal size={24} />}
            title="MULTI-SEASONS"
            description="Supporting projects across multiple seasons"
          />
          <Achievement
            icon={<Target size={24} />}
            title="MULTI-PROJECTS"
            description="Supported multiple projects in one round!"
          />
          <Achievement
            icon={<CheckCircle size={24} />}
            title="CLAIMED!"
            description="Only for users who have claimed their tokens"
          />
        </div>
      </div>
    </div>
  );
};

export default Stats;