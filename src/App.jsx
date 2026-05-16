import React, { useState, useEffect } from 'react';
import CharacterSelect from './components/CharacterSelect';
import GameMap from './components/GameMap';
import CombatScreen from './components/CombatScreen';
import { CHARACTERS, ENEMIES, ARTIFACTS, CARDS } from './data/gameData';
import { Trophy, ShieldAlert, Package } from 'lucide-react';

export default function App() {
  const [characters, setCharacters] = useState(() => {
    const local = localStorage.getItem('fox_rogue_chars_v4');
    return local ? JSON.parse(local) : CHARACTERS;
  });

  const [gameState, setGameState] = useState('CHAR_SELECT'); 
  const [selectedChar, setSelectedChar] = useState(null);
  
  // Neues 3-Akte-System
  const [currentAct, setCurrentAct] = useState(1);
  const [currentTier, setCurrentTier] = useState(0);
  const [visitedNodes, setVisitedNodes] = useState([]);
  
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [playerArtifacts, setPlayerArtifacts] = useState([]);

  useEffect(() => {
    localStorage.setItem('fox_rogue_chars_v4', JSON.stringify(characters));
  }, [characters]);

  const handleSelectCharacter = (char) => {
    setSelectedChar(char);
    setGameState('MAP');
    setCurrentAct(1);
    setCurrentTier(0);
    setVisitedNodes([]);
    setPlayerArtifacts([]); 
  };

  const handleSelectNode = (node) => {
    setVisitedNodes(prev => [...prev, node.id]);
    
    if (node.type === 'Kampf' || node.type === 'Elite' || node.type === 'Boss') {
      let enemyPool = ENEMIES.filter(e => e.type === 'Normal');
      if (node.type === 'Elite') enemyPool = ENEMIES.filter(e => e.type === 'Elite');
      if (node.type === 'Boss') enemyPool = ENEMIES.filter(e => e.type === 'Boss');

      const baseEnemy = enemyPool[Math.floor(Math.random() * enemyPool.length)] || ENEMIES[0];
      
      // Dynamische Skalierung: Gegner werden pro Akt und pro Ascension-Level stärker
      const ascensionMult = 1 + (selectedChar.ascensionLevel || 0) * 0.15;
      const actMult = 1 + (currentAct - 1) * 0.3;
      
      const scaledHp = Math.floor(baseEnemy.hp * ascensionMult * actMult);
      const scaledIntent = Math.floor(baseEnemy.intentValue * (1 + (selectedChar.ascensionLevel || 0) * 0.1) * actMult);

      setCurrentEnemy({ 
        ...baseEnemy, 
        hp: scaledHp, 
        maxHp: scaledHp, 
        intentValue: scaledIntent 
      });
      setGameState('COMBAT');
      
    } else if (node.type === 'Schatztruhe') {
      const artifactKeys = Object.keys(ARTIFACTS);
      const randomArtifactKey = artifactKeys[Math.floor(Math.random() * artifactKeys.length)];
      setPlayerArtifacts(prev => [...prev, randomArtifactKey]);
      
      setTimeout(() => {
        setGameState('MAP');
        setCurrentTier(prev => Math.min(9, prev + 1));
      }, 1000);
    } else {
      setCurrentTier(prev => Math.min(9, prev + 1));
      setGameState('MAP');
    }
  };

  const handleCombatWin = () => {
    if (currentEnemy && currentEnemy.type === 'Boss') {
      if (currentAct < 3) {
        // Nächster Akt wird geladen
        setCurrentAct(prev => prev + 1);
        setCurrentTier(0);
        setVisitedNodes([]);
        setGameState('MAP');
      } else {
        // Run komplett gewonnen (Akt 3 Boss besiegt) - Meta-Progression!
        setCharacters(prev => prev.map(c => {
          if (c.id === selectedChar.id) {
            return { ...c, ascensionLevel: (c.ascensionLevel || 0) + 1 };
          }
          if (c.id === 'fire') return { ...c, unlocked: true };
          return c;
        }));
        setGameState('WIN_SCREEN');
      }
    } else if (currentEnemy && currentEnemy.type === 'Elite') {
      setGameState('ELITE_REWARD');
    } else {
      setCurrentTier(prev => Math.min(9, prev + 1));
      setGameState('MAP');
    }
  };

  const handleCombatLose = () => {
    setGameState('LOSE_SCREEN');
  };

  const claimEliteReward = (chosenCardId, chosenArtifactId) => {
    if (chosenArtifactId) {
      setPlayerArtifacts(prev => [...prev, chosenArtifactId]);
    }
    setGameState('MAP');
    setCurrentTier(prev => Math.min(9, prev + 1));
  };

  const resetToMenu = () => {
    setGameState('CHAR_SELECT');
    setSelectedChar(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30">
      {gameState === 'CHAR_SELECT' && (
        <CharacterSelect characters={characters} onSelect={handleSelectCharacter} />
      )}

      {gameState === 'MAP' && (
        <GameMap 
          currentTier={currentTier}
          currentAct={currentAct}
          visitedNodes={visitedNodes}
          onSelectNode={handleSelectNode}
          character={selectedChar}
          playerArtifacts={playerArtifacts} 
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

      {gameState === 'ELITE_REWARD' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-center">
          <Trophy size={44} className="text-amber-400 mb-6 animate-pulse" />
          <h2 className="text-3xl font-black text-amber-400 tracking-wider mb-2">SIEG ÜBER ELITE!</h2>
          <p className="text-slate-300 max-w-md text-sm mb-8">Wähle ein seltenes Artefakt für den Run aus:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full mb-10 text-left">
            <div className="p-6 rounded-xl border border-amber-600 bg-amber-950/20 text-center flex flex-col justify-between">
              <Package size={32} className="mx-auto text-amber-500 mb-4 bouncing" />
              <div className="flex flex-col gap-3">
                {[...Array(1)].map((_, i) => {
                  const keys = Object.keys(ARTIFACTS);
                  const artifact = ARTIFACTS[keys[(i + Date.now()) % keys.length]];
                  return (
                    <button key={i} onClick={() => claimEliteReward(null, artifact.id)} className="w-full text-left p-4 border border-slate-700 hover:border-amber-500 rounded-lg bg-slate-950 transition-colors">
                      <strong className="text-amber-400 block mb-0.5">{artifact.name}</strong>
                      <span className="text-slate-300 text-xs">{artifact.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="p-6 rounded-xl border border-slate-700 bg-slate-900 flex items-center justify-center text-slate-500 text-sm italic">
                Simulierte Karten-Wahl (wird später implementiert)...
            </div>
          </div>
          
          <button 
            onClick={() => claimEliteReward(null, null)}
            className="text-xs text-slate-500 hover:text-slate-300 font-mono underline"
          >
            Alle Belohnungen überspringen & weiter
          </button>
        </div>
      )}

      {gameState === 'WIN_SCREEN' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-center">
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500 rounded-full flex items-center justify-center text-amber-400 mb-6 animate-bounce">
            <Trophy size={44} />
          </div>
          <h1 className="text-4xl font-black text-amber-400 tracking-wider mb-2">SIEG! AUFSTIEG ERREICHT!</h1>
          <p className="text-slate-300 max-w-md text-sm mb-6">
            Hervorragend! Alle 3 Akte wurden überlebt. Der Charakter ist nun im Aufstiegs-Level (Ascension) gestiegen. Bei der nächsten Auswahl werden die Gegner noch erbarmungsloser sein!
          </p>
          <button 
            onClick={resetToMenu}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg transition hover:scale-105"
          >
            Zurück zur Charakterauswahl
          </button>
        </div>
      )}

      {gameState === 'LOSE_SCREEN' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-center">
          <div className="w-20 h-20 bg-red-950/40 border border-red-700/50 rounded-full flex items-center justify-center text-red-500 mb-6 animate-pulse">
            <ShieldAlert size={44} />
          </div>
          <h1 className="text-3xl font-extrabold text-red-500 tracking-wider mb-2">DER FUCHS IST GEFALLEN</h1>
          <p className="text-slate-400 max-w-md text-xs mb-6 font-mono">
            Akt {currentAct} war dieses Mal zu stark. Das Deck muss optimiert werden, um einen neuen Versuch zu starten!
          </p>
          <button 
            onClick={resetToMenu}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg border border-slate-700 transition hover:bg-slate-700"
          >
            Erneut versuchen
          </button>
        </div>
      )}
    </div>
  );
}
