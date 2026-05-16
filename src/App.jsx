import React, { useState, useEffect } from 'react';
import CharacterSelect from './components/CharacterSelect';
import GameMap from './components/GameMap';
import CombatScreen from './components/CombatScreen';
import { CHARACTERS, ENEMIES, ARTIFACTS, CARDS } from './data/gameData';
import { Trophy, ShieldAlert, Package, ShoppingCart, Coffee, HelpCircle, Coins, Heart, Flame, Volume2, VolumeX, AlertTriangle } from 'lucide-react';

export default function App() {
  const [characters, setCharacters] = useState(() => {
    const local = localStorage.getItem('fox_rogue_chars_v5');
    return local ? JSON.parse(local) : CHARACTERS;
  });

  const [gameState, setGameState] = useState('CHAR_SELECT'); 
  const [selectedChar, setSelectedChar] = useState(null);
  
  const [currentAct, setCurrentAct] = useState(1);
  const [currentTier, setCurrentTier] = useState(0);
  const [visitedNodes, setVisitedNodes] = useState([]);
  
  const [playerGold, setPlayerGold] = useState(100);
  const [playerCurrentHp, setPlayerCurrentHp] = useState(80);
  const [playerDeck, setPlayerDeck] = useState([]);
  const [playerArtifacts, setPlayerArtifacts] = useState([]);
  
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [earnedGoldThisCombat, setEarnedGoldThisCombat] = useState(0);
  const [shopInventory, setShopInventory] = useState({ cards: [], potions: [] });
  const [activeEvent, setActiveEvent] = useState(null);

  // Audio System & Abbruch
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('fox_rogue_chars_v5', JSON.stringify(characters));
  }, [characters]);

  // Dummy-Funktion für Sound-Effekte
  const playSound = (type) => {
    if (!audioEnabled) return;
    console.log(`[AUDIO] Spiele Soundeffekt ab: ${type}.mp3`);
  };

  const handleSelectCharacter = (char) => {
    setSelectedChar(char);
    setPlayerCurrentHp(char.hp);
    setPlayerGold(100);
    const startDeck = char.startingDeck.map((cardId, index) => ({ ...CARDS[cardId], uniqId: `${cardId}-start-${index}` }));
    setPlayerDeck(startDeck);
    
    setCurrentAct(1);
    setCurrentTier(0);
    setVisitedNodes([]);
    setPlayerArtifacts([]);
    setGameState('MAP');
    playSound('game_start');
  };

  const handleSelectNode = (node) => {
    setVisitedNodes(prev => [...prev, node.id]);
    
    if (node.type === 'Kampf' || node.type === 'Elite' || node.type === 'Boss') {
      let enemyPool = ENEMIES.filter(e => e.type === node.type && e.act === currentAct);
      
      // Fallback, falls keine Gegner für den Akt gefunden wurden
      if (enemyPool.length === 0) enemyPool = ENEMIES.filter(e => e.type === 'Normal');

      const baseEnemy = enemyPool[Math.floor(Math.random() * enemyPool.length)];
      
      const ascensionMult = 1 + (selectedChar.ascensionLevel || 0) * 0.10;
      const scaledHp = Math.floor(baseEnemy.hp * ascensionMult);
      
      setCurrentEnemy({ ...baseEnemy, hp: scaledHp, maxHp: scaledHp });
      
      const baseGold = node.type === 'Elite' ? 40 : node.type === 'Boss' ? 100 : 15;
      setEarnedGoldThisCombat(baseGold + Math.floor(Math.random() * 15));
      
      playSound('combat_start');
      setGameState('COMBAT');
      
    } else if (node.type === 'Schatztruhe') {
      playSound('chest_open');
      const artifactKeys = Object.keys(ARTIFACTS);
      const randomArtifactKey = artifactKeys[Math.floor(Math.random() * artifactKeys.length)];
      setPlayerArtifacts(prev => [...prev, randomArtifactKey]);
      setTimeout(() => advanceMap(), 1500);
      
    } else if (node.type === 'Shop') {
      playSound('shop_door');
      generateShopInventory();
      setGameState('SHOP');
      
    } else if (node.type === 'Lagerfeuer') {
      playSound('campfire_crackle');
      setGameState('CAMPFIRE');
      
    } else if (node.type === 'Ereignis') {
      playSound('event_mystic');
      generateRandomEvent();
      setGameState('EVENT');
    }
  };

  const generateShopInventory = () => {
    const keys = Object.keys(CARDS);
    const randomCards = Array.from({length: 4}).map(() => {
      const key = keys[Math.floor(Math.random() * keys.length)];
      return { ...CARDS[key], price: 45 + Math.floor(Math.random() * 30), id: key };
    });
    setShopInventory({ 
      cards: randomCards, 
      potions: [
        { id: 'hp_pot', name: 'Heiltrank', desc: 'Heilt sofort 30 HP', price: 35, count: 1 },
        { id: 'str_pot', name: 'Stärketrank', desc: 'Nächster Angriff +5', price: 25, count: 1 }
      ] 
    });
  };

  const generateRandomEvent = () => {
    setActiveEvent({
      title: 'Der unheimliche Altar',
      text: 'Ein verwitterter Altar verströmt eine seltsame Aura. Es scheint, als verlangt er ein Opfer.',
      options: [
        { text: 'Blut opfern (Verliere 15 HP, Erhalte 75 Gold)', action: () => { setPlayerCurrentHp(p => Math.max(1, p - 15)); setPlayerGold(p => p + 75); } },
        { text: 'Beten (Heile 20 HP, Verliere 25 Gold)', action: () => { if(playerGold >= 25) { setPlayerCurrentHp(p => Math.min(selectedChar.maxHp, p + 20)); setPlayerGold(p => p - 25); } } },
        { text: 'Ignorieren und weitergehen', action: () => {} }
      ]
    });
  };

  const handleCombatWin = (remainingHp) => {
    playSound('victory');
    setPlayerCurrentHp(remainingHp);
    setPlayerGold(prev => prev + earnedGoldThisCombat);
    
    if (currentEnemy && currentEnemy.type === 'Boss') {
      if (currentAct < 3) {
        setCurrentAct(prev => prev + 1);
        setCurrentTier(0);
        setVisitedNodes([]);
        setGameState('MAP');
      } else {
        setCharacters(prev => prev.map(c => {
          if (c.id === selectedChar.id) return { ...c, ascensionLevel: (c.ascensionLevel || 0) + 1 };
          if (c.id === 'fire') return { ...c, unlocked: true };
          return c;
        }));
        setGameState('WIN_SCREEN');
      }
    } else {
      setGameState('REWARD');
    }
  };

  const claimCardReward = (chosenCard) => {
    if (chosenCard) {
      playSound('card_obtain');
      setPlayerDeck(prev => [...prev, { ...chosenCard, uniqId: `reward-${Date.now()}` }]);
    }
    advanceMap();
  };

  const advanceMap = () => {
    setCurrentTier(prev => Math.min(9, prev + 1));
    setGameState('MAP');
  };

  const resetToMenu = () => {
    setShowAbortConfirm(false);
    setGameState('CHAR_SELECT');
    setSelectedChar(null);
  };

  // UI Header Component (Wiederverwendbar)
  const TopBar = () => (
    <div className="w-full bg-slate-950/90 border-b border-slate-800 p-3 flex justify-between items-center backdrop-blur-md z-50 sticky top-0">
      <div className="flex gap-4">
        <div className="font-bold text-amber-400 flex items-center gap-1 min-h-[44px]"><Heart size={16} className="text-red-500"/> {playerCurrentHp}/{selectedChar?.maxHp}</div>
        <div className="font-bold text-amber-400 flex items-center gap-1 min-h-[44px]"><Coins size={16}/> {playerGold}</div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => { setAudioEnabled(!audioEnabled); playSound('click'); }} className="p-2 bg-slate-900 rounded-lg border border-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center">
          {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-slate-500" />}
        </button>
        <button onClick={() => setShowAbortConfirm(true)} className="px-3 py-2 bg-red-950/50 hover:bg-red-900 border border-red-800 rounded-lg text-xs font-bold text-red-200 transition min-h-[44px]">
          Run abbrechen
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30 flex flex-col font-sans">
      
      {/* Abbrechen Dialog */}
      {showAbortConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl">
            <AlertTriangle size={40} className="mx-auto text-red-500 mb-4 animate-pulse" />
            <h3 className="text-xl font-bold mb-2">Run wirklich abbrechen?</h3>
            <p className="text-sm text-slate-400 mb-6">Der aktuelle Fortschritt geht unwiderruflich verloren.</p>
            <div className="flex flex-col gap-3">
              <button onClick={resetToMenu} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl min-h-[44px]">Ja, Run beenden</button>
              <button onClick={() => setShowAbortConfirm(false)} className="w-full py-3 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl min-h-[44px]">Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      {gameState !== 'CHAR_SELECT' && gameState !== 'WIN_SCREEN' && gameState !== 'LOSE_SCREEN' && <TopBar />}

      <div className="flex-1 relative">
        {gameState === 'CHAR_SELECT' && <CharacterSelect characters={characters} onSelect={handleSelectCharacter} />}

        {gameState === 'MAP' && (
          <GameMap currentTier={currentTier} currentAct={currentAct} visitedNodes={visitedNodes} onSelectNode={handleSelectNode} character={selectedChar} playerArtifacts={playerArtifacts} />
        )}

        {gameState === 'COMBAT' && (
          <CombatScreen character={{...selectedChar, hp: playerCurrentHp, maxHp: selectedChar.maxHp, startingDeck: playerDeck.map(c => c.id)}} enemy={currentEnemy} onCombatWin={(hp) => handleCombatWin(hp)} onCombatLose={() => { playSound('defeat'); setGameState('LOSE_SCREEN'); }} playSound={playSound} />
        )}

        {/* Reparierter SHOP */}
        {gameState === 'SHOP' && (
          <div className="min-h-[80vh] p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-cyan-400 mb-6 mt-4"><ShoppingCart /> Fuchshändler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
              {shopInventory.cards.map((card, idx) => (
                <button key={idx} disabled={playerGold < card.price} onClick={() => { setPlayerGold(p => p - card.price); setPlayerDeck(p => [...p, { ...card, uniqId: `shop-${Date.now()}` }]); setShopInventory(prev => ({...prev, cards: prev.cards.filter((_, i) => i !== idx)})); playSound('buy'); }} className="border border-slate-800 bg-slate-900/80 p-4 rounded-xl flex flex-col justify-between text-left hover:border-cyan-500 disabled:opacity-40 transition min-h-[100px]">
                  <div><div className="font-bold text-slate-200">{card.name}</div><p className="text-xs text-slate-400">{card.desc}</p></div>
                  <div className="mt-2 text-sm font-bold text-amber-400"><Coins size={14} className="inline"/> {card.price}</div>
                </button>
              ))}
            </div>
            <button onClick={advanceMap} className="mt-8 px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-sm transition min-h-[44px]">Shop verlassen</button>
          </div>
        )}

        {/* Repariertes LAGERFEUER */}
        {gameState === 'CAMPFIRE' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            <Flame size={48} className="text-orange-500 mb-6 animate-pulse" />
            <h2 className="text-2xl font-black mb-8">Sichere Lichtung</h2>
            <div className="flex flex-col w-full max-w-sm gap-4">
              <button onClick={() => { setPlayerCurrentHp(p => Math.min(selectedChar.maxHp, p + Math.floor(selectedChar.maxHp * 0.3))); playSound('heal'); advanceMap(); }} className="border border-slate-700 bg-slate-900 p-6 rounded-xl hover:border-emerald-500 transition min-h-[80px]">
                <Heart className="mx-auto text-emerald-500 mb-2"/>
                <div className="font-bold">Ausruhen</div>
                <p className="text-xs text-slate-400">Heilt 30% max HP</p>
              </button>
              <button onClick={() => { setPlayerDeck(prev => prev.map(c => c.type === 'Angriff' ? { ...c, damage: (c.damage||0) + 3 } : c)); playSound('smith'); advanceMap(); }} className="border border-slate-700 bg-slate-900 p-6 rounded-xl hover:border-orange-500 transition min-h-[80px]">
                <Flame className="mx-auto text-orange-500 mb-2"/>
                <div className="font-bold">Schmieden</div>
                <p className="text-xs text-slate-400">Alle Angriffe +3 Schaden</p>
              </button>
            </div>
          </div>
        )}

        {/* Repariertes EVENT */}
        {gameState === 'EVENT' && activeEvent && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold mb-4">{activeEvent.title}</h2>
              <p className="text-slate-300 text-sm mb-8 leading-relaxed">{activeEvent.text}</p>
              <div className="flex flex-col gap-3">
                {activeEvent.options.map((opt, idx) => (
                  <button key={idx} onClick={() => { opt.action(); playSound('click'); advanceMap(); }} className="w-full text-left p-4 bg-slate-950 border border-slate-700 hover:border-purple-500 rounded-xl text-sm transition min-h-[44px]">
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Belohnungsbildschirm */}
        {gameState === 'REWARD' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-2xl font-black text-amber-400 mb-4">Sieg!</h2>
            <p className="mb-6 text-sm text-slate-300">Wähle eine Karte für das Deck:</p>
            <div className="flex flex-col gap-4 w-full max-w-sm mb-6">
              {[...Array(3)].map((_, i) => {
                const keys = Object.keys(CARDS);
                const card = CARDS[keys[(i + Date.now()) % keys.length]];
                return (
                  <button key={i} onClick={() => claimCardReward(card)} className="border border-slate-700 bg-slate-900 p-4 rounded-xl text-left hover:border-amber-500 transition min-h-[60px]">
                    <div className="font-bold text-amber-400">{card.name}</div>
                    <div className="text-xs text-slate-400">{card.desc}</div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => claimCardReward(null)} className="py-3 px-6 bg-slate-800 rounded-xl text-sm font-bold min-h-[44px]">Überspringen</button>
          </div>
        )}

        {/* Endscreens */}
        {gameState === 'WIN_SCREEN' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-900">
            <Trophy size={60} className="text-amber-400 mb-6 animate-bounce" />
            <h1 className="text-3xl font-black text-amber-400 mb-4">RUN GEWONNEN!</h1>
            <p className="text-slate-300 mb-8 max-w-sm">Aufstiegslevel freigeschaltet. Die nächste Reise wird gefährlicher.</p>
            <button onClick={resetToMenu} className="px-8 py-4 bg-amber-600 hover:bg-amber-500 font-bold rounded-xl min-h-[44px]">Hauptmenü</button>
          </div>
        )}

        {gameState === 'LOSE_SCREEN' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-950">
            <ShieldAlert size={60} className="text-red-500 mb-6" />
            <h1 className="text-3xl font-black text-red-500 mb-4">GEFALLEN</h1>
            <button onClick={resetToMenu} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl min-h-[44px]">Neuer Versuch</button>
          </div>
        )}
      </div>
    </div>
  );
}
