import { useEffect, useState, useRef } from 'react';
import snoopys from './data/snoopy.json';
import SnoopyCard, {getRarityLabel} from './components/SnoopyCard';

function App() {
  const [current, setCurrent] = useState(null);
  const [count, setCount] = useState(0);
  const [seen, setSeen] = useState(new Set());
  const [showDropdown, setShowDropdown] = useState(false);
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

            <div className="relative text-left">
              <button
                onClick={() => setShowDropdown(prev => !prev)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
              >
                <span className="underline">Seen Snoopys</span>
                <span
                  className={`transition-transform duration-200 ${
                    showDropdown ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              {showDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-300 p-4 rounded-xl text-sm shadow-lg z-50 max-h-80 overflow-y-auto">
                {rarityOrder
                  .filter(label => rarityGroups[label])
                  .map(label => {
                    const group = rarityGroups[label];
                    const seenCount = group.filter(s => seen.has(s.id)).length;

                    return (
                      <div key={label} className="mb-2">
                        <strong className="block">
                          {label} ({seenCount}/{group.length})
                        </strong>
                        <ul className="ml-4 list-disc">
                          {group
                            .filter(s => seen.has(s.id))
                            .map(s => (
                              <li key={s.id}>{s.name}</li>
                            ))}
                        </ul>
                      </div>
                    );
                  })}
                  {Object.keys(rarityGroups).length === 0 && (
                    <p className="text-gray-500 italic">No Snoopy drops yet</p>
                  )}
                </div>
              )}
            </div>
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
      </div>
    </div>
  );
}

export default App;

