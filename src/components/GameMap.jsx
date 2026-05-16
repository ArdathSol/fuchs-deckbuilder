import React from 'react';
import { Shield, Swords, Flame, ShoppingCart, Coffee, Skull, HelpCircle, ArrowUp } from 'lucide-react';
import { MAP_NODES } from '../data/gameData';

export default function GameMap({ currentTier, visitedNodes, onSelectNode, character }) {
  
  const getNodeIcon = (type) => {
    switch (type) {
      case 'Kampf': return <Swords size={18} class="text-orange-400" />;
      case 'Elite': return <Flame size={18} class="text-red-500" />;
      case 'Shop': return <ShoppingCart size={18} class="text-cyan-400" />;
      case 'Lagerfeuer': return <Coffee size={18} class="text-emerald-400" />;
      case 'Ereignis': return <HelpCircle size={18} class="text-purple-400" />;
      case 'Boss': return <Skull size={24} class="text-red-600 animate-pulse" />;
      default: return <HelpCircle size={18} />;
    }
  };

  // Group nodes by tier for a vertical/hierarchical visual representation
  const tiers = [0, 1, 2, 3];

  return (
    <div class="flex flex-col items-center justify-between min-h-screen bg-slate-900/90 text-white p-4 relative overflow-y-auto">
      {/* Top bar info */}
      <div class="w-full max-w-3xl bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center mb-4">
        <div class="flex items-center gap-3">
          <div class={`w-10 h-10 rounded-full bg-gradient-to-r ${character.color} flex items-center justify-center text-xl`}>
            🦊
          </div>
          <div>
            <div class="font-bold text-sm text-slate-200">{character.name}</div>
            <div class="text-xs text-slate-400">Status: Auf dem Pfad des Abenteuers</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-xs text-slate-400 font-mono">Aktuelle Ebene</div>
          <div class="text-sm font-bold text-amber-500">Tier {currentTier + 1} / 4</div>
        </div>
      </div>

      {/* Map Layout Structure */}
      <div class="flex-1 w-full max-w-xl flex flex-col-reverse justify-around items-center my-4 relative bg-slate-950/40 rounded-2xl p-6 border border-slate-800/50 backdrop-blur-sm min-h-[500px]">
        
        {/* Connection Background Line hints could go here, simplified into vertical flows */}
        {tiers.map((tierIndex) => {
          const nodesInTier = MAP_NODES.filter(n => n.tier === tierIndex);
          const isSelectableTier = currentTier === tierIndex;

          return (
            <div key={tierIndex} class="w-full flex justify-center gap-6 md:gap-12 relative py-3">
              {/* Optional Tier Divider Line */}
              <div class="absolute -top-1 left-0 right-0 border-t border-dashed border-slate-800/60 text-[10px] text-slate-600 px-2 flex justify-between">
                <span>{tierIndex === 3 ? 'FINALE' : `Stufe ${tierIndex + 1}`}</span>
              </div>

              {nodesInTier.map((node) => {
                const isVisited = visitedNodes.includes(node.id);
                // Simple logical check for path validation
                let isClickable = isSelectableTier;
                if (currentTier > 0 && isSelectableTier) {
                  // Must connect from a previously visited node
                  const lastVisitedId = visitedNodes[visitedNodes.length - 1];
                  const lastNode = MAP_NODES.find(n => n.id === lastVisitedId);
                  isClickable = lastNode ? lastNode.connectedTo.includes(node.id) : true;
                }

                return (
                  <button
                    key={node.id}
                    disabled={!isClickable || isVisited}
                    onClick={() => onSelectNode(node)}
                    class={`group relative w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isVisited 
                        ? 'border-slate-700 bg-slate-800 opacity-40 cursor-not-allowed'
                        : isClickable
                        ? 'border-amber-500 bg-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-110 hover:border-amber-400 cursor-pointer animate-pulse'
                        : 'border-slate-800 bg-slate-950/60 opacity-30 cursor-not-allowed'
                    }`}
                  >
                    {getNodeIcon(node.type)}
                    
                    {/* Tooltip on hover */}
                    <span class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-[11px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20 shadow-xl font-mono text-amber-400">
                      {node.label} ({node.type})
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Guide Footer */}
      <div class="text-center text-xs text-slate-500 font-mono mt-2 max-w-md">
        Wähle einen leuchtenden Knotenpunkt aus, um fortzufahren. Besiege den Boss auf Stufe 4, um den Run abzuschließen!
      </div>
    </div>
  );
}