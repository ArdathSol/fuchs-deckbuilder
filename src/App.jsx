import React, { useState, useEffect } from 'react';
import CharacterSelect from './components/CharacterSelect';
import GameMap from './components/GameMap';
import CombatScreen from './components/CombatScreen';
import { CHARACTERS, ENEMIES, CARDS } from './data/gameData';
import { Trophy, ShieldAlert, ShoppingCart, Coffee, HelpCircle, Coins, Heart, Flame } from 'lucide-react';

export default function App() {
  // --- Globale States & Persistent Progression ---
  const [characters, setCharacters] = useState(() => {
    const local = localStorage.getItem('fox_rogue_chars');
    return local ? JSON.parse(local) : CHARACTERS;
  });

  // Screen-Zustände: CHAR_SELECT, MAP, COMBAT, REWARD, SHOP, CAMPFIRE, EVENT, WIN_SCREEN, LOSE_SCREEN
  const [gameState, setGameState] = useState('CHAR_SELECT'); 
  const [selectedChar, setSelectedChar] = useState(null);
  const [currentTier, setCurrentTier] = useState(0);
  const [visitedNodes, setVisitedNodes] = useState([]);
  
  // Ökonomie & Zustand während des aktuellen Runs
  const [playerGold, setPlayerGold] = useState(100); // Startgold
  const [playerCurrentHp, setPlayerCurrentHp] = useState(80);
  const [playerDeck, setPlayerDeck] = useState([]);

  // Kampf & Interaktions-Zustände
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [earnedGoldThisCombat, setEarnedGoldThisCombat] = useState(0);
  const [shopInventory, setShopInventory] = useState({ cards: [], potions: [] });
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    localStorage.setItem('fox_rogue_chars', JSON.stringify(characters));
  }, [characters]);

  // --- Initialisierung eines neuen Runs ---
  const handleSelectCharacter = (char) => {
    setSelectedChar(char);
    setPlayerCurrentHp(char.hp);
    setPlayerGold(100); // Basis-Startgold
    
    // Kopiere das Startdeck des Fuchses
    const startingDeckObjects = char.startingDeck.map((cardId, index) => ({
      ...CARDS[cardId],
      uniqId: `${cardId}-start-${index}`
    }));
    setPlayerDeck(startingDeckObjects);
    
    setGameState('MAP');
    setCurrentTier(0);
    setVisitedNodes([]);
  };

  // --- Map-Knotenpunkt-Auswahl-Logik ---
  const handleSelectNode = (node) => {
    setVisitedNodes(prev => [...prev, node.id]);
    
    if (node.type === 'Kampf' || node.type === 'Elite' || node.type === 'Boss') {
      let enemyPool = ENEMIES.filter(e => e.type === 'Normal');
      if (node.type === 'Elite') enemyPool = ENEMIES.filter(e => e.type === 'Elite');
      if (node.type === 'Boss') enemyPool = ENEMIES.filter(e => e.type === 'Boss');

      const selectedEnemy = enemyPool[Math.floor(Math.random() * enemyPool.length)] || ENEMIES[0];
      setCurrentEnemy({ ...selectedEnemy });
      
      // Berechne potenzielles Kampf-Gold
      const baseGold = node.type === 'Elite' ? 40 : node.type === 'Boss' ? 100 : 15;
      setEarnedGoldThisCombat(baseGold + Math.floor(Math.random() * 15));
      
      setGameState('COMBAT');
    } 
    else if (node.type === 'Shop') {
      generateShopInventory();
      setGameState('SHOP');
    } 
    else if (node.type === 'Lagerfeuer') {
      setGameState('CAMPFIRE');
    } 
    else if (node.type === 'Ereignis') {
      generateRandomEvent();
      setGameState('EVENT');
    }
  };

  // --- Hilfsfunktionen für die Generierung von Inhalten ---
  const generateShopInventory = () => {
    const allCardKeys = Object.keys(CARDS);
    const randomCards = [];
    // Wähle 4 zufällige Karten aus dem Pool
    for (let i = 0; i < 4; i++) {
      const randomKey = allCardKeys[Math.floor(Math.random() * allCardKeys.length)];
      randomCards.push({ 
        ...CARDS[randomKey], 
        price: 45 + Math.floor(Math.random() * 30),
        id: randomKey
      });
    }
    const potions = [
      { id: 'hp_pot', name: 'Heiltrank', desc: 'Heilt sofort 25 HP', price: 30, count: 1 },
      { id: 'gold_pot', name: 'Glücks-Elixier', desc: 'Erhalte sofort 50 Gold', price: 20, count: 1 }
    ];
    setShopInventory({ cards: randomCards, potions });
  };

  const generateRandomEvent = () => {
    const events = [
      {
        title: 'Der verlassene Fuchsschrein',
        text: 'Du stehst vor einem bemoosten Altar eines uralten Elementarfuchses. Eine unheimliche Energie liegt in der Luft. Was tust du?',
        options: [
          {
            text: 'Blutopfer bringen (Verliere 15 HP, Erhalte 80 Gold)',
            action: () => {
              setPlayerCurrentHp(prev => Math.max(1, prev - 15));
              setPlayerGold(prev => prev + 80);
            }
          },
          {
            text: 'Nach Schätzen graben (Erhalte eine zufällige Karte)',
            action: () => {
              const keys = Object.keys(CARDS);
              const randomCard = CARDS[keys[Math.floor(Math.random() * keys.length)]];
              setPlayerDeck(prev => [...prev, { ...randomCard, uniqId: `event-${Date.now()}` }]);
            }
          },
          {
            text: 'Den Ort respektvoll verlassen (Nichts passiert)',
            action: () => {}
          }
        ]
      }
    ];
    setActiveEvent(events[0]);
  };

  // --- Navigation & Belohnungs-Abschluss ---
  const handleCombatWin = (remainingHp) => {
    setPlayerCurrentHp(remainingHp);
    setPlayerGold(prev => prev + earnedGoldThisCombat);
    
    if (currentEnemy && currentEnemy.type === 'Boss') {
      setCharacters(prev => prev.map(c => {
        if (c.id === 'fire') return { ...c, unlocked: true };
        return c;
      }));
      setGameState('WIN_SCREEN');
    } else {
      setGameState('REWARD');
    }
  };

  const claimCardReward = (chosenCard) => {
    if (chosenCard) {
      setPlayerDeck(prev => [...prev, { ...chosenCard, uniqId: `reward-${Date.now()}` }]);
    }
    advanceTier();
  };

  const advanceTier = () => {
    setCurrentTier(prev => Math.min(3, prev + 1));
    setGameState('MAP');
  };

  const resetToMenu = () => {
    setGameState('CHAR_SELECT');
    setSelectedChar(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30">
      
      {/* 1. Charakterauswahl */}
      {gameState === 'CHAR_SELECT' && (
        <CharacterSelect characters={characters} onSelect={handleSelectCharacter} />
      )}

      {/* 2. Spielkarte */}
      {gameState === 'MAP' && (
        <GameMap 
          currentTier={currentTier}
          visitedNodes={visitedNodes}
          onSelectNode={handleSelectNode}
          character={{...selectedChar, hp: playerCurrentHp}} // Zeige aktuelle HP auf Map an
        />
      )}

      {/* 3. Kampfsystem */}
      {gameState === 'COMBAT' && (
        <CombatScreen 
          character={{...selectedChar, hp: selectedChar.hp, currentHp: playerCurrentHp, startingDeck: playerDeck.map(c => c.id)}}
          enemy={currentEnemy}
          onCombatWin={(hp) => handleCombatWin(hp)}
          onCombatLose={() => setGameState('LOSE_SCREEN')}
        />
      )}

      {/* 4. REWARD SCREEN (Nach dem Kampf) */}
      {gameState === 'REWARD' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900/95 text-center">
          <h2 className="text-3xl font-black text-amber-400 mb-2 tracking-wider">KAMPF GEWONNEN!</h2>
          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-full border border-amber-500/30 text-amber-400 font-mono font-bold mb-6">
            <Coins size={16} /> +{earnedGoldThisCombat} Gold erhalten
          </div>
          <p className="text-slate-400 text-sm mb-6">Wähle eine Karte für dein Deck:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mb-8">
            {[...Array(3)].map((_, i) => {
              const keys = Object.keys(CARDS);
              const card = CARDS[keys[(i + Date.now()) % keys.length]];
              return (
                <div 
                  key={i} 
                  onClick={() => claimCardReward(card)}
                  className="border-2 border-slate-700 bg-slate-950 hover:border-amber-500 rounded-xl p-4 cursor-pointer transition transform hover:-translate-y-2 flex flex-col justify-between min-h-[150px]"
                >
                  <div className="flex justify-between text-xs opacity-60"><span>{card.type}</span><span>⚡ {card.cost}</span></div>
                  <div className="font-bold my-2 text-amber-400">{card.name}</div>
                  <p className="text-xs text-slate-300">{card.desc}</p>
                </div>
              );
            })}
          </div>
          <button onClick={() => claimCardReward(null)} className="text-xs text-slate-500 hover:text-slate-300 font-mono underline">
            Belohnung überspringen & weiter
          </button>
        </div>
      )}

      {/* 5. SHOP INTERFACE */}
      {gameState === 'SHOP' && (
        <div className="min-h-screen bg-slate-900 p-6 flex flex-col items-center">
          <div className="w-full max-w-4xl flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-cyan-400"><ShoppingCart /> Der reisende Fuchshändler</h2>
            <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-lg font-bold text-amber-400"><Coins /> {playerGold} Gold</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <div>
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-4">Karten-Angebote</h3>
              <div className="grid grid-cols-2 gap-4">
                {shopInventory.cards.map((card, idx) => (
                  <button 
                    key={idx}
                    disabled={playerGold < card.price}
                    onClick={() => {
                      setPlayerGold(prev => prev - card.price);
                      setPlayerDeck(prev => [...prev, { ...card, uniqId: `shop-${Date.now()}` }]);
                      setShopInventory(prev => ({...prev, cards: prev.cards.filter((_, i) => i !== idx)}));
                    }}
                    className="border-2 border-slate-800 bg-slate-950 p-3 rounded-xl flex flex-col justify-between min-h-[140px] text-left hover:border-cyan-500 disabled:opacity-40 transition"
                  >
                    <div>
                      <div className="text-[10px] opacity-60 uppercase font-mono">{card.type}</div>
                      <div className="font-bold text-sm text-slate-200 my-1">{card.name}</div>
                      <p className="text-xs text-slate-400 leading-tight">{card.desc}</p>
                    </div>
                    <div className="mt-2 text-xs font-bold text-amber-400 flex items-center gap-1"><Coins size={12}/> {card.price} G</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-4">Verbrauchsgüter</h3>
              <div className="flex flex-col gap-3">
                {shopInventory.potions.map((pot, idx) => (
                  <div key={idx} className="border border-slate-800 bg-slate-950 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm text-emerald-400">{pot.name}</div>
                      <p className="text-xs text-slate-400">{pot.desc}</p>
                    </div>
                    <button
                      disabled={playerGold < pot.price || pot.count === 0}
                      onClick={() => {
                        setPlayerGold(prev => prev - pot.price);
                        if (pot.id === 'hp_pot') setPlayerCurrentHp(prev => Math.min(selectedChar.hp, prev + 25));
                        if (pot.id === 'gold_pot') setPlayerGold(prev => prev + 50);
                        setShopInventory(prev => ({
                          ...prev,
                          potions: prev.potions.map((p, i) => i === idx ? { ...p, count: 0 } : p)
                        }));
                      }}
                      className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 disabled:bg-slate-900 rounded font-bold text-xs flex items-center gap-1 transition"
                    >
                      <Coins size={12}/> {pot.count > 0 ? `${pot.price} G kaufen` : 'Ausverkauft'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button onClick={advanceTier} className="mt-8 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-sm transition">Verlassen & Weiterreisen</button>
        </div>
      )}

      {/* 6. LAGERFEUER (Rastplatz) */}
      {gameState === 'CAMPFIRE' && (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-orange-950/50 border border-orange-500 rounded-full flex items-center justify-center text-orange-400 mb-4 animate-pulse"><Coffee size={32} /></div>
          <h2 className="text-3xl font-black text-slate-100 tracking-wider mb-2">EINE SICHERE LICHTUNG</h2>
          <p className="text-slate-400 text-sm max-w-md mb-8">Das Lagerfeuer knackt leise. Nutze die Atempause, um deine Wunden zu versorgen oder deine Fähigkeiten zu schärfen.</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button 
              onClick={() => {
                const missingHp = selectedChar.hp - playerCurrentHp;
                const healAmount = Math.max(5, Math.floor(missingHp * 0.3));
                setPlayerCurrentHp(prev => Math.min(selectedChar.hp, prev + healAmount));
                advanceTier();
              }}
              className="flex-1 border border-slate-700 bg-slate-950 p-5 rounded-xl hover:border-emerald-500 transition group"
            >
              <Heart className="mx-auto text-emerald-500 mb-2 group-hover:scale-110 transition" size={24}/>
              <div className="font-bold text-sm">Ausruhen</div>
              <p className="text-xs text-slate-400 mt-1">Heile 30% der fehlenden HP</p>
            </button>
            <button 
              onClick={() => {
                setPlayerDeck(prev => prev.map(card => card.type === 'Angriff' ? { ...card, damage: (card.damage || 0) + 3, name: `${card.name}+` } : card));
                advanceTier();
              }}
              className="flex-1 border border-slate-700 bg-slate-950 p-5 rounded-xl hover:border-orange-500 transition group"
            >
              <Flame className="mx-auto text-orange-500 mb-2 group-hover:scale-110 transition" size={24}/>
              <div className="font-bold text-sm">Schmieden</div>
              <p className="text-xs text-slate-400 mt-1">Verbessere alle Angriffskarten (+3 Schaden)</p>
            </button>
          </div>
        </div>
      )}

      {/* 7. EVENT SYSTEM */}
      {gameState === 'EVENT' && activeEvent && (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-widest mb-2"><HelpCircle size={14}/> Mysteriöses Ereignis</div>
            <h2 className="text-2xl font-bold text-slate-100 mb-4">{activeEvent.title}</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 bg-slate-950/50 p-4 rounded-xl border border-slate-800 font-sans">{activeEvent.text}</p>
            <div className="flex flex-col gap-3">
              {activeEvent.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    opt.action();
                    advanceTier();
                  }}
                  className="w-full text-left p-3 bg-slate-950 border border-slate-800 hover:border-purple-500 rounded-xl font-medium text-xs text-slate-200 transition hover:bg-slate-900"
                >
                  ⏳ {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. END SCREENS (Win / Lose) */}
      {gameState === 'WIN_SCREEN' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-center">
          <Trophy size={44} className="text-amber-400 mb-6 animate-bounce" />
          <h1 className="text-4xl font-black text-amber-400 tracking-wider mb-2">DAS EMPIRE DER FÜCHSE IST GERETTET!</h1>
          <p className="text-slate-300 max-w-md text-sm mb-6">Du hast die Tiefen des Waldes durchkämmt und den Wächter bezwungen. Deine Füchse triumphieren! Der mächtige <strong className="text-red-400">Feuer-Fuchs</strong> steht bereit.</p>
          <button onClick={resetToMenu} className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 font-bold rounded-xl shadow-lg transition hover:scale-105">Hauptmenü</button>
        </div>
      )}

      {gameState === 'LOSE_SCREEN' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-center">
          <ShieldAlert size={44} className="text-red-500 mb-6 animate-pulse" />
          <h1 className="text-3xl font-extrabold text-red-500 tracking-wider mb-2">DEIN FUCHS IST GEFALLEN</h1>
          <p className="text-slate-400 max-w-md text-xs mb-6 font-mono">Der Dungeon war zu stark. Optimiere dein Deck und versuche es erneut!</p>
          <button onClick={resetToMenu} className="px-6 py-2.5 bg-slate-800 text-slate-200 font-bold rounded-lg border border-slate-700 transition hover:bg-slate-700">Erneut versuchen</button>
        </div>
      )}
    </div>
  );
}