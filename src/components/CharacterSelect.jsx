import React from 'react';
import { Lock, Play, ShieldAlert, Award } from 'lucide-react';

export default function CharacterSelect({ characters, onSelect }) {
  return (
    <div class="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-950 text-white select-none">
      <div class="text-center mb-8 max-w-2xl">
        <h1 class="text-4xl font-extrabold tracking-wider text-orange-500 mb-2 drop-shadow-md">
          🦊 FOX DECKBUILDER ROGUELITE 🦊
        </h1>
        <p class="text-slate-400 text-sm md:text-base">
          Wähle deinen Fuchs-Helden. Gewinne Runs, um mächtigere Elementar- und Cyber-Füchse freizuschalten, neue Fähigkeiten einzusetzen und die Spitze der Slay-the-Spire-Map zu erklimmen!
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        {characters.map((char) => (
          <div 
            key={char.id}
            class={`relative border-2 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 ${
              char.unlocked 
                ? `border-slate-700 bg-slate-900/80 hover:${char.borderColor} hover:scale-[1.03] shadow-lg` 
                : 'border-slate-800 bg-slate-950/40 opacity-60'
            }`}
          >
            <div>
              {/* Top Row / Lock Badge */}
              <div class="flex justify-between items-center mb-3">
                <span class={`text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                  char.unlocked ? `${char.textColor} bg-slate-800` : 'text-slate-500 bg-slate-900'
                }`}>
                  {char.title}
                </span>
                {!char.unlocked && <Lock size={16} class="text-red-500" />}
              </div>

              {/* Graphic / Icon Placeholder */}
              <div class={`w-full h-32 rounded-lg bg-gradient-to-br ${char.color} flex items-center justify-center text-5xl mb-4 shadow-inner relative overflow-hidden`}>
                <span class="animate-float z-10">🦊</span>
                <div class="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
              </div>

              {/* Hero Details */}
              <h3 class="text-xl font-bold mb-1 flex items-center gap-2">
                {char.name}
              </h3>
              
              <div class="flex gap-3 text-xs text-slate-300 mb-3">
                <span>❤️ HP: <strong class="text-red-400">{char.hp}/{char.maxHp}</strong></span>
                <span>⚡ Energie: <strong class="text-cyan-400">{char.energy}</strong></span>
              </div>

              <p class="text-xs text-slate-400 mb-4 line-clamp-3">
                {char.description}
              </p>

              {/* Passive Ability Callout */}
              {char.unlocked && (
                <div class="mt-2 p-2 bg-slate-950/60 rounded-lg border border-slate-800 text-xs">
                  <span class="font-bold text-amber-400 block mb-0.5 flex items-center gap-1">
                    <Award size={12} /> Passiv: {char.ability.name}
                  </span>
                  <span class="text-slate-400">{char.ability.desc}</span>
                </div>
              )}
            </div>

            {/* Bottom action or unlock info */}
            <div class="mt-5">
              {char.unlocked ? (
                <button
                  onClick={() => onSelect(char)}
                  class="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white py-2 px-4 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 shadow"
                >
                  <Play size={14} fill="currentColor" /> Run Starten
                </button>
              ) : (
                <div class="p-2 bg-red-950/20 border border-red-900/40 rounded-lg text-center text-xs">
                  <span class="text-red-400 font-semibold flex items-center justify-center gap-1 mb-1">
                    <ShieldAlert size={12} /> Gesperrt
                  </span>
                  <p class="text-slate-400 font-mono text-[11px]">{char.unlockCondition}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}