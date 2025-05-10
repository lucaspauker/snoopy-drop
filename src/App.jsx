import { useEffect, useState } from 'react';
import snoopys from './data/snoopy.json';
import SnoopyCard from './components/SnoopyCard';

export function getRarityLabel(rarity) {
  if (rarity >= 0.98) return { label: 'Legendary', color: 'text-yellow-500' };
  if (rarity >= 0.9) return { label: 'Epic', color: 'text-purple-500' };
  if (rarity >= 0.8) return { label: 'Rare', color: 'text-blue-500' };
  if (rarity >= 0.5) return { label: 'Uncommon', color: 'text-green-500' };
  return { label: 'Common', color: 'text-gray-500' };
}

const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

function App() {
  const [current, setCurrent] = useState(null);

  const [count, setCount] = useState(() => {
    const stored = localStorage.getItem('dropCount');
    return stored ? parseInt(stored, 10) : 0;
  });

  const [seen, setSeen] = useState(() => {
    const stored = localStorage.getItem('seenSnoopys');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const getRandomWeighted = () => {
    const weights = snoopys.map(s => 1 - s.rarity);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const r = Math.random() * totalWeight;

    let cumulative = 0;
    for (let i = 0; i < snoopys.length; i++) {
      cumulative += weights[i];
      if (r < cumulative) return snoopys[i];
    }

    return snoopys[snoopys.length - 1];
  };

  const handleDrop = () => {
    const selected = getRandomWeighted();
    setCurrent(selected);
    setCount(prev => prev + 1);
    setSeen(prev => {
      const newSet = new Set(prev);
      newSet.add(selected.id);
      return newSet;
    });
  };

  const handleRefresh = () => {
    localStorage.removeItem('seenSnoopys');
    localStorage.removeItem('dropCount');
    window.location.reload();
  };

  useEffect(() => {
    localStorage.setItem('dropCount', count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem('seenSnoopys', JSON.stringify(Array.from(seen)));
  }, [seen]);

  const rarityGroups = snoopys.reduce((acc, s) => {
    const { label } = getRarityLabel(s.rarity);
    acc[label] = acc[label] || [];
    acc[label].push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pt-8 sm:pt-16">
      <div className="w-full max-w-2xl px-2 sm:px-4 text-center pb-20">
        <h1 className="text-4xl font-bold mb-6">Snoopy Drop</h1>

        {/* Stats + Desktop Button */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 text-sm text-gray-600">
          <p>
            You've seen {count} Snoopy{count !== 1 && 's'} so far!
          </p>

          <button
            onClick={handleDrop}
            className="hidden sm:block bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 px-4 text-base rounded-2xl"
          >
            Drop a Snoopy 🎁
          </button>
        </div>

        {/* SnoopyCard */}
        <SnoopyCard snoopy={current} />

        {/* Mobile Button */}
        <div className="sm:hidden mt-6 px-4">
          <button
            onClick={handleDrop}
            className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-4 px-6 text-lg rounded-2xl"
          >
            Drop a Snoopy 🎁
          </button>
        </div>

        {/* Seen Grid */}
        <div className="mt-10 text-left">
          {rarityOrder.map(label => {
            const group = rarityGroups[label];
            if (!group) return null;

            return (
              <div key={label} className="mb-6">
                <h2 className="text-lg font-bold mb-2">{label}</h2>
                <div className="flex flex-wrap gap-4">
                  {group.map(s => {
                    const unlocked = seen.has(s.id);
                    return (
                      <div
                        key={s.id}
                        className="flex flex-col items-center w-20 text-xs"
                      >
                        <div
                          className={`w-16 h-16 rounded-full overflow-hidden border border-gray-300 bg-white relative`}
                        >
                          <img
                            src={s.image}
                            alt=""
                            className={`w-full h-full object-cover transition-all duration-300 ${
                              unlocked ? '' : 'blur-md brightness-75'
                            }`}
                          />
                        </div>
                        <span className="mt-1 text-center font-medium">
                          {unlocked ? s.name : '???'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleRefresh}
          className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-3 px-6 text-base rounded-2xl"
        >
          🔁 Reset Progress
        </button>
      </div>
    </div>
  );
}

export default App;

