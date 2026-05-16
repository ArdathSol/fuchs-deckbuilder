import React from 'react';
import { Swords, Flame, ShoppingCart, Coffee, Skull, HelpCircle, Package, Zap, Moon, Cpu, Sun, Coins } from 'lucide-react';
import { MAP_NODES, ARTIFACTS } from '../data/gameData';

export default function GameMap({ currentTier, currentAct, visitedNodes, onSelectNode, character, playerArtifacts }) {
  
  const getNodeIcon = (type) => {
    switch (type) {
      case 'Kampf': return <Swords size={20} className="text-orange-400" />;
      case 'Elite': return <Flame size={20} className="text-red-500 animate-pulse" />;
      case 'Shop': return <ShoppingCart size={20} className="text-cyan-400" />;
      case 'Lagerfeuer': return <Coffee size={20} className="text-emerald-400" />;
      case 'Ereignis': return <HelpCircle size={20} className="text-purple-400" />;
      case 'Schatztruhe': return <Package size={20} className="text-amber-500" />;
      case 'Boss': return <Skull size={28} className="text-red-600 animate-pulse" />;
      default: return <HelpCircle size={20} />;
    }
  };

  const getArtifactIcon = (iconName) => {
    switch (iconName) {
      case 'Zap': return <Zap size={16} />;
      case 'Moon': return <Moon size={16} />;
      case 'Flame': return <Flame size={16} />;
      case 'Cpu': return <Cpu size={16} />;
      case 'Sun': return <Sun size={16} />;
      case 'Coins': return <Coins size={16} />;
      default: return <Package size={16} />;
    }
  };

  const tiers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-68px)] bg-slate-900/90 text-white p-4 overflow-y-auto">
      
      {/* Artefakt Leiste */}
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-xl p-3 mb-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-500 mr-2 uppercase tracking-wider font-bold hidden sm:block">Artefakte:</span>
          {playerArtifacts && playerArtifacts.length > 0 ? (
            playerArtifacts.map((artId, idx) => {
              const artifact = ARTIFACTS[artId];
              return (
                <div key={`${artId}-${idx}`} className="group relative w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 hover:bg-slate-700 transition cursor-help shrink-0">
                  {getArtifactIcon(artifact.iconName)}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-xs p-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                    <strong className="text-amber-400 block">{artifact.name}</strong>
                    <span className="text-slate-300">{artifact.desc}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <span className="text-xs font-mono text-slate-600">Leer</span>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] text-amber-400 font-bold uppercase">Akt {currentAct}</div>
          <div className="text-xs font-bold text-slate-300">Ebene {currentTier + 1}/10</div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-2xl flex flex-col-reverse justify-around items-center relative bg-slate-950/40 rounded-2xl p-4 sm:p-8 border border-slate-800/50 min-h-[800px]">
        {tiers.map((tierIndex) => {
          const nodesInTier = MAP_NODES.filter(n => n.tier === tierIndex);
          const isSelectableTier = currentTier === tierIndex;

          return (
            <div key={tierIndex} className="w-full flex justify-center gap-4 sm:gap-8 relative py-3">
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
                    className={`group relative w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 min-h-[44px] min-w-[44px] ${
                      isVisited 
                        ? 'border-slate-800 bg-slate-900 opacity-30 cursor-not-allowed'
                        : isClickable
                        ? 'border-amber-500 bg-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-110 hover:bg-slate-800 cursor-pointer animate-pulse z-10'
                        : 'border-slate-800 bg-slate-950/60 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {getNodeIcon(node.type)}
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl text-slate-200">
                      {node.label}
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
