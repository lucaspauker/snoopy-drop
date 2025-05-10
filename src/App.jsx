import { useEffect, useState, useRef } from 'react';
import snoopys from './data/snoopy.json';
import SnoopyCard, {getRarityLabel} from './components/SnoopyCard';

function App() {
  const [current, setCurrent] = useState(null);
  const [count, setCount] = useState(0);
  const [seen, setSeen] = useState(new Set());
  const hasInitialized = useRef(false);
  const rarityOrder = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

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

  useEffect(() => {
    if (!hasInitialized.current) {
      handleDrop();
      hasInitialized.current = true;
    }
  }, []);

  const rarityGroups = snoopys.reduce((acc, s) => {
    const { label } = getRarityLabel(s.rarity);
    acc[label] = acc[label] || [];
    acc[label].push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pt-16">
      <div className="w-full max-w-2xl px-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Snoopy Drop</h1>

        <div className="flex justify-between items-center mb-6 px-2">
          {/* Stats */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <p>
              You've seen {count} Snoopy{count !== 1 && 's'} so far!
            </p>
          </div>

          {/* Button */}
          <button
            onClick={handleDrop}
            className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded"
          >
            Drop a Snoopy 🎁
          </button>
        </div>

        <SnoopyCard snoopy={current} />

        {/* Seen Snoopys Grid */}
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
      </div>
    </div>
  );
}

export default App;

