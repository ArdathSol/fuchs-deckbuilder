import React from 'react';
import { Shield, Swords, Flame, ShoppingCart, Coffee, Skull, HelpCircle, Package } from 'lucide-react';
import { MAP_NODES, ARTIFACTS } from '../data/gameData';

export default function GameMap({ currentTier, currentAct, visitedNodes, onSelectNode, character, playerArtifacts }) {
  
  const getNodeIcon = (type) => {
    switch (type) {
      case 'Kampf': return <Swords size={18} className="text-orange-400" />;
      case 'Elite': return <Flame size={18} className="text-red-500 animate-pulse" />;
      case 'Shop': return <ShoppingCart size={18} className="text-cyan-400" />;
      case 'Lagerfeuer': return <Coffee size={18} className="text-emerald-400" />;
      case 'Ereignis': return <HelpCircle size={18} className="text-purple-400" />;
      case 'Schatztruhe': return <Package size={18} className="text-amber-500 animate-bounce" />;
      case 'Boss': return <Skull size={24} className="text-red-600 animate-pulse" />;
      default: return <HelpCircle size={18} />;
    }
  };

  const tiers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-slate-900/90 text-white p-4 relative overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${character.color} flex items-center justify-center text-xl`}>
            🦊
          </div>
          <div>
            <div className="font-bold text-sm text-slate-200">{character.name} <span className="text-amber-500 text-xs ml-2">Aufstieg {character.ascensionLevel || 0}</span></div>
            <div className="text-xs text-slate-400">Status: Auf dem Pfad des Abenteuers</div>
          </div>
        </div>

        <div className="flex-1 px-4 flex justify-center gap-1.5 border-x border-slate-800/60 overflow-x-auto max-w-sm">
          {playerArtifacts && playerArtifacts.length > 0 ? (
            playerArtifacts.map((artId, idx) => {
              const artifact = ARTIFACTS[artId];
              return (
                <div key={`${artId}-${idx}`} className="group relative w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 cursor-help transform hover:scale-110 transition-transform">
                  <Package size={16} />
                  <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 shadow-2xl font-mono text-slate-200">
                    <strong className="text-amber-400 block mb-0.5">{artifact.name}</strong>
                    {artifact.desc}
                  </span>
                </div>
              );
            })
          ) : (
            <span className="text-[10px] font-mono text-slate-600">Keine Artefakte</span>
          )}
        </div>

        <div className="text-right">
          <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Akt {currentAct} / 3</div>
          <div className="text-sm font-bold text-slate-300">Ebene {currentTier + 1} / 10</div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-3xl flex flex-col-reverse justify-around items-center my-4 relative bg-slate-950/40 rounded-2xl p-6 border border-slate-800/50 backdrop-blur-sm min-h-[800px] overflow-hidden">
        {tiers.map((tierIndex) => {
          const nodesInTier = MAP_NODES.filter(n => n.tier === tierIndex);
          const isSelectableTier = currentTier === tierIndex;

          return (
            <div key={tierIndex} className="w-full flex justify-center gap-6 relative py-3">
              <div className="absolute -top-1 left-0 right-0 border-t border-dashed border-slate-800/60 text-[10px] text-slate-600 px-2 flex justify-between">
                <span>{tierIndex === 9 ? 'BOSS' : tierIndex === 0 ? 'START' : `Ebene ${tierIndex + 1}`}</span>
              </div>

              {nodesInTier.map((node) => {
                const isVisited = visitedNodes.includes(node.id);
                let isClickable = isSelectableTier;
                if (currentTier > 0 && isSelectableTier) {
                  const lastVisitedId = visitedNodes[visitedNodes.length - 1];
                  const lastNode = MAP_NODES.find(n => n.id === lastVisitedId);
                  isClickable = lastNode ? lastNode.connectedTo.includes(node.id) : true;
                }

                return (
                  <button
                    key={node.id}
                    disabled={!isClickable || isVisited}
                    onClick={() => onSelectNode(node)}
                    className={`group relative w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isVisited 
                        ? 'border-slate-700 bg-slate-800 opacity-40 cursor-not-allowed'
                        : isClickable
                        ? 'border-amber-500 bg-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-110 hover:border-amber-400 cursor-pointer animate-pulse'
                        : 'border-slate-800 bg-slate-950/60 opacity-30 cursor-not-allowed'
                    }`}
                  >
                    {getNodeIcon(node.type)}
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-[11px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20 shadow-xl font-mono text-amber-400">
                      {node.label} ({node.type})
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
