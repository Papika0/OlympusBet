'use client';

interface FactionCardProps {
  type: 'SPARTA' | 'ATHENS';
  name: string;
  description: string;
  motto: string;
  totalMembers: number;
  totalXp: string;
  wins: number;
  isUserFaction?: boolean;
  onJoin?: () => void;
}

export function FactionCard({
  type,
  name,
  description,
  motto,
  totalMembers,
  totalXp,
  wins,
  isUserFaction = false,
  onJoin,
}: FactionCardProps) {
  const colors = type === 'SPARTA' 
    ? { bg: 'bg-sparta-500', border: 'border-sparta-500', text: 'text-sparta-500' }
    : { bg: 'bg-athens-500', border: 'border-athens-500', text: 'text-athens-500' };

  const icon = type === 'SPARTA' ? '🔴' : '🔵';

  return (
    <div className={`card-marble p-6 border-2 ${isUserFaction ? colors.border : 'border-marble-700'} transition-all hover:border-opacity-70`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-xl font-display ${colors.text}`}>{name}</h3>
          <p className="text-xs text-marble-400 italic">"{motto}"</p>
        </div>
      </div>

      <p className="text-marble-300 text-sm mb-4">{description}</p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-gold-500">{totalMembers.toLocaleString()}</div>
          <div className="text-xs text-marble-500">Members</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gold-500">{totalXp}</div>
          <div className="text-xs text-marble-500">Total XP</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gold-500">{wins}</div>
          <div className="text-xs text-marble-500">Wars Won</div>
        </div>
      </div>

      {isUserFaction ? (
        <div className={`text-center py-2 ${colors.bg} rounded-lg text-white font-semibold`}>
          ✓ Your Faction
        </div>
      ) : onJoin ? (
        <button
          onClick={onJoin}
          className={`w-full py-2 rounded-lg ${colors.bg} text-white font-semibold hover:opacity-90 transition-opacity`}
        >
          Join {name}
        </button>
      ) : null}
    </div>
  );
}

interface FactionWarProps {
  spartaScore: string;
  athensScore: string;
  prizePool: string;
  timeRemaining: string;
  userContribution?: string;
  userFaction?: 'SPARTA' | 'ATHENS';
}

export function FactionWar({
  spartaScore,
  athensScore,
  prizePool,
  timeRemaining,
  userContribution,
  userFaction,
}: FactionWarProps) {
  const spartaNum = parseFloat(spartaScore);
  const athensNum = parseFloat(athensScore);
  const total = spartaNum + athensNum;
  const spartaPercent = total > 0 ? (spartaNum / total) * 100 : 50;
  const athensPercent = total > 0 ? (athensNum / total) * 100 : 50;

  return (
    <div className="card-marble p-6 border border-gold-600/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-display text-gold-500">⚔️ Faction War</h3>
        <div className="text-sm text-marble-400">
          ⏱️ {timeRemaining} remaining
        </div>
      </div>

      {/* War progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-sparta-500 font-bold">🔴 Sparta: {spartaScore}</span>
          <span className="text-athens-500 font-bold">🔵 Athens: {athensScore}</span>
        </div>
        <div className="h-4 rounded-full overflow-hidden flex">
          <div
            className="bg-sparta-500 transition-all duration-500"
            style={{ width: `${spartaPercent}%` }}
          />
          <div
            className="bg-athens-500 transition-all duration-500"
            style={{ width: `${athensPercent}%` }}
          />
        </div>
      </div>

      {/* Prize pool */}
      <div className="text-center mb-4">
        <div className="text-sm text-marble-400">Prize Pool</div>
        <div className="text-2xl font-display text-gold-500">Ξ {prizePool}</div>
      </div>

      {/* User contribution */}
      {userFaction && userContribution && (
        <div className="text-center p-3 bg-marble-800 rounded-lg">
          <div className="text-sm text-marble-400">Your Contribution</div>
          <div className="text-lg text-gold-500">{userContribution} XP</div>
          <div className={`text-sm ${userFaction === 'SPARTA' ? 'text-sparta-500' : 'text-athens-500'}`}>
            Fighting for {userFaction}
          </div>
        </div>
      )}
    </div>
  );
}
