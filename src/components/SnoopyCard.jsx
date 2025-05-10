export function getRarityLabel(rarity) {
  if (rarity >= 0.98) return { label: "Legendary", color: "text-yellow-500" };
  if (rarity >= 0.9) return { label: "Epic", color: "text-purple-500" };
  if (rarity >= 0.8) return { label: "Rare", color: "text-red-500" };
  if (rarity >= 0.5) return { label: "Uncommon", color: "text-blue-500" };
  return { label: "Common", color: "text-gray-500" };
}

function SnoopyCard({ snoopy }) {
  if (!snoopy) return null;
  const { label, color } = getRarityLabel(snoopy.rarity);


  return (
    <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mt-4">{snoopy.name}</h2>
      <div className="w-full max-w-[24rem] aspect-[3/4] sm:w-[26rem] sm:h-[32rem] mx-auto border border-gray-200 rounded-xl overflow-hidden">
        <img
          src={snoopy.image}
          alt={snoopy.name}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-gray-700 italic">{snoopy.mood}</p>
      <p className={`font-semibold ${color}`}>Rarity: {label}</p>
      <p className="mt-2">“{snoopy.quote}”</p>
    </div>
  );
}

export default SnoopyCard;

