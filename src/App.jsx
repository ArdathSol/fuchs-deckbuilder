import React, { useState, useEffect } from 'react';
import CharacterSelect from './components/CharacterSelect';
import GameMap from './components/GameMap';
import CombatScreen from './components/CombatScreen';
import { CHARACTERS, ENEMIES } from './data/gameData';
import { Trophy, ShieldAlert, Sparkles } from 'lucide-react';

export default function App() {
  // Global unlocks / persistent state management
  const [characters, setCharacters] = useState(() => {
    const local = localStorage.getItem('fox_rogue_chars');
    return local ? JSON.parse(local) : CHARACTERS;
  });

  const [gameState, setGameState] = useState('CHAR_SELECT'); // CHAR_SELECT, MAP, COMBAT, WIN_SCREEN, LOSE_SCREEN
  const [selectedChar, setSelectedChar] = useState(null);
  const [currentTier, setCurrentTier] = useState(0);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [currentEnemy, setCurrentEnemy] = useState(null);

  useEffect(() => {
    localStorage.setItem('fox_rogue_chars', JSON.stringify(characters));
  }, [characters]);

  const handleSelectCharacter = (char) => {
    setSelectedChar(char);
    setGameState('MAP');
    setCurrentTier(0);
    setVisitedNodes([]);
  };

  const handleSelectNode = (node) => {
    setVisitedNodes(prev => [...prev, node.id]);
    
    // Choose appropriate monster enemy level scaling based on node type tier
    let enemyPool = ENEMIES.filter(e => e.type === 'Normal');
    if (node.type === 'Elite') enemyPool = ENEMIES.filter(e => e.type === 'Elite');
    if (node.type === 'Boss') enemyPool = ENEMIES.filter(e => e.type === 'Boss');

    const selectedEnemy = enemyPool[Math.floor(Math.random() * enemyPool.length)] || ENEMIES[0];
    
    // Quick cloned deep copy to avoid mutant states
    setCurrentEnemy({ ...selectedEnemy });
    setGameState('COMBAT');
  };

  const handleCombatWin = () => {
    // Check if boss was cleared for full run completion
    if (currentEnemy && currentEnemy.type === 'Boss') {
      // Unlock fire fuchs as requested in prompt progression challenge rule!
      setCharacters(prev => prev.map(c => {
        if (c.id === 'fire') return { ...c, unlocked: true };
        return c;
      }));
      setGameState('WIN_SCREEN');
    } else {
      // Advance tier difficulty map level forward
      setCurrentTier(prev => Math.min(3, prev + 1));
      setGameState('MAP');
    }
  };

  const handleCombatLose = () => {
    setGameState('LOSE_SCREEN');
  };

  const resetToMenu = () => {
    setGameState('CHAR_SELECT');
    setSelectedChar(null);
  };

  return (
    <div class="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30">
      {gameState === 'CHAR_SELECT' && (
        <CharacterSelect characters={characters} onSelect={handleSelectCharacter} />
      )}

      {gameState === 'MAP' && (
        <GameMap 
          currentTier={currentTier}
          visitedNodes={visitedNodes}
          onSelectNode={handleSelectNode}
          character={selectedChar}
        />
      )}

      {gameState === 'COMBAT' && (
        <CombatScreen 
          character={selectedChar}
          enemy={currentEnemy}
          onCombatWin={handleCombatWin}
          onCombatLose={handleCombatLose}
        />
      )}

      {gameState === 'WIN_SCREEN' && (
        <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-center">
          <div class="w-20 h-20 bg-amber-500/10 border border-amber-500 rounded-full flex items-center justify-center text-amber-400 mb-6 animate-bounce">
            <Trophy size={44} />
          </div>
          <h1 class="text-4xl font-black text-amber-400 tracking-wider mb-2">SIEG ÜBER DEN GOLEM!</h1>
          <p class="text-slate-300 max-w-md text-sm mb-6">
            Hervorragend! Du hast die Slay-the-Spire-Map bezwungen. Als Belohnung wurde der mächtige <strong class="text-red-400">Feuer-Fuchs</strong> für deinen nächsten Run dauerhaft freigeschaltet!
          </p>
          <button 
            onClick={resetToMenu}
            class="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg transition"
          >
            Hauptmenü & Neuen Fuchs testen
          </button>
        </div>
      )}

      {gameState === 'LOSE_SCREEN' && (
        <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-center">
          <div class="w-20 h-20 bg-red-950/40 border border-red-700/50 rounded-full flex items-center justify-center text-red-500 mb-6 animate-pulse">
            <ShieldAlert size={44} />
          </div>
          <h1 class="text-3xl font-extrabold text-red-500 tracking-wider mb-2">DEIN FUCHS IST GEFALLEN</h1>
          <p class="text-slate-400 max-w-md text-xs mb-6 font-mono">
            Der Dungeon war diesmal zu stark. Optimiere dein Deck, nutze deine Fähigkeiten klüger und versuche es erneut!
          </p>
          <button 
            onClick={resetToMenu}
            class="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg border border-slate-700 transition"
          >
            Erneut versuchen
          </button>
        </div>
      )}
    </div>
  );
}