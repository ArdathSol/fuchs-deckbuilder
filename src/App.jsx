import React, { useState, useEffect } from 'react';
import CharacterSelect from './components/CharacterSelect';
import GameMap from './components/GameMap';
import CombatScreen from './components/CombatScreen';
import { CHARACTERS, ENEMIES, ARTIFACTS, CARDS, EVENTS } from './data/gameData';
import { Trophy, ShieldAlert, Package, ShoppingCart, Coffee, HelpCircle, Coins, Heart, Volume2, VolumeX, AlertTriangle, Sparkles, Crown, Flame } from 'lucide-react';
import { startBGM, stopBGM, playClick, playReward } from './utils/audio';

export default function App() {
  const [characters, setCharacters] = useState(() => {
    const local = localStorage.getItem('fox_rogue_chars_v7');
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

  const [startBonusChoice, setStartBonusChoice] = useState({ card: null, artifact: null });
  const [bossRewardChoices, setBossRewardChoices] = useState([]);

  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('fox_rogue_chars_v7', JSON.stringify(characters));
  }, [characters]);

  useEffect(() => {
    if (audioEnabled) startBGM();
    else stopBGM();
  }, [audioEnabled]);

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) playClick();
  };

  const handleSelectCharacter = (char) => {
    setSelectedChar(char);
    setPlayerCurrentHp(char.hp);
    setPlayerGold(100);
    const startDeck = char.startingDeck.map((cardId, index) => ({ ...CARDS[cardId], uniqId: `${cardId}-start-${index}` }));
    setPlayerDeck(startDeck);
    setCurrentAct(1); setCurrentTier(0); setVisitedNodes([]); setPlayerArtifacts([]);
    
    const normalArtifacts = Object.values(ARTIFACTS).filter(a => !a.isBoss);
    setStartBonusChoice({ 
      card: Object.values(CARDS)[Math.floor(Math.random() * Object.values(CARDS).length)], 
      artifact: normalArtifacts[Math.floor(Math.random() * normalArtifacts.length)] 
    });
    setGameState('START_BONUS');
    if (audioEnabled) playReward();
  };

  const claimStartBonus = (type) => {
    if (audioEnabled) playClick();
    if (type === 'card') setPlayerDeck(prev => [...prev, { ...startBonusChoice.card, uniqId: `bonus-${Date.now()}` }]);
    if (type === 'artifact') setPlayerArtifacts(prev => [...prev, startBonusChoice.artifact.id]);
    setGameState('MAP');
  };

  const handleSelectNode = (node) => {
    setVisitedNodes(prev => [...prev, node.id]);
    if (audioEnabled) playClick();
    
    if (node.type === 'Kampf' || node.type === 'Elite' || node.type === 'Boss') {
      // FIX: Mapping von Knotentyp 'Kampf' auf Gegnertyp 'Normal'
      const searchType = node.type === 'Kampf' ? 'Normal' : node.type;
      let enemyPool = ENEMIES.filter(e => e.type === searchType && e.act === currentAct);
      
      if (enemyPool.length === 0) enemyPool = ENEMIES.filter(e => e.type === 'Normal' && e.act === 1);
      const baseEnemy = enemyPool[Math.floor(Math.random() * enemyPool.length)];
      
      const ascensionMult = 1 + (selectedChar.ascensionLevel || 0) * 0.10;
      const scaledHp = Math.floor(baseEnemy.hp * ascensionMult);
      
      setCurrentEnemy({ ...baseEnemy, hp: scaledHp, maxHp: scaledHp });
      setEarnedGoldThisCombat((node.type === 'Elite' ? 40 : node.type === 'Boss' ? 100 : 15) + Math.floor(Math.random() * 15));
      setGameState('COMBAT');
      
    } else if (node.type === 'Schatztruhe') {
      const normalArtifacts = Object.keys(ARTIFACTS).filter(k => !ARTIFACTS[k].isBoss);
      setPlayerArtifacts(prev => [...prev, normalArtifacts[Math.floor(Math.random() * normalArtifacts.length)]]);
      if (audioEnabled) playReward();
      setTimeout(() => advanceMap(), 1500);
      
    } else if (node.type === 'Shop') {
      const keys = Object.keys(CARDS);
      const generatedCards = Array.from({length: 4}).map(() => ({ ...CARDS[keys[Math.floor(Math.random() * keys.length)]], price: 45 + Math.floor(Math.random() * 30) }));
      setShopInventory({ cards: generatedCards });
      setGameState('SHOP');
      
    } else if (node.type === 'Lagerfeuer') {
      setGameState('CAMPFIRE');
      
    } else if (node.type === 'Ereignis') {
      setActiveEvent(EVENTS[Math.floor(Math.random() * EVENTS.length)]);
      setGameState('EVENT');
    }
  };

  const handleCombatWin = (remainingHp) => {
    if (audioEnabled) playReward();
    setPlayerCurrentHp(remainingHp);
    setPlayerGold(prev => prev + earnedGoldThisCombat);
    
    if (currentEnemy && currentEnemy.type === 'Boss') {
      if (currentAct < 3) {
        const bossArts = Object.values(ARTIFACTS).filter(a => a.isBoss);
        setBossRewardChoices(bossArts.sort(() => 0.5 - Math.random()).slice(0, 3));
        setGameState('BOSS_REWARD');
      } else {
        setCharacters(prev => prev.map(c => c.id === selectedChar.id ? { ...c, ascensionLevel: (c.ascensionLevel || 0) + 1 } : c));
        setGameState('WIN_SCREEN');
      }
    } else {
      setGameState('REWARD');
    }
  };

  const claimBossReward = (artifactId) => {
    if (artifactId) setPlayerArtifacts(prev => [...prev, artifactId]);
    setCurrentAct(prev => prev + 1);
    setCurrentTier(0);
    setVisitedNodes([]);
    setGameState('MAP');
  };

  const claimCardReward = (chosenCard) => {
    if (chosenCard) {
      setPlayerDeck(prev => [...prev, { ...chosenCard, uniqId: `reward-${Date.now()}` }]);
    }
    advanceMap();
  };

  const advanceMap = () => { setCurrentTier(prev => Math.min(9, prev + 1)); setGameState('MAP'); };
  const resetToMenu = () => { setShowAbortConfirm(false); setGameState('CHAR_SELECT'); setSelectedChar(null); };

  const eventAPI = {
    hurt: (amount) => {
      setPlayerCurrentHp(p => {
        const next = Math.max(0, p - amount);
        if (next === 0) setTimeout(() => setGameState('LOSE_SCREEN'), 500);
        return next;
      });
    },
    heal: (amount) => setPlayerCurrentHp(p => Math.min(selectedChar.maxHp, p + amount)),
    spend: (amount) => setPlayerGold(p => Math.max(0, p - amount)),
    gainGold: (amount) => setPlayerGold(p => p + amount),
    addCard: (cardId) => setPlayerDeck(p => [...p, { ...CARDS[cardId], uniqId: `evt-${Date.now()}` }]),
    giveRandomArtifact: () => setPlayerArtifacts(p => [...p, Object.keys(ARTIFACTS)[0]]),
    gold: playerGold
  };

  const TopBar = () => (
    <div className="w-full bg-slate-950/90 border-b border-slate-800 p-3 flex justify-between items-center z-40 sticky top-0 h-[68px]">
      <div className="flex gap-4">
        <div className="font-bold text-amber-400 flex items-center gap-1 min-h-[44px]"><Heart size={16} className="text-red-500"/> {playerCurrentHp}/{selectedChar?.maxHp}</div>
        <div className="font-bold text-amber-400 flex items-center gap-1 min-h-[44px]"><Coins size={16}/> {playerGold}</div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={toggleAudio} className="p-2 bg-slate-900 border border-slate-700 rounded-lg outline-none">
          {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-slate-500" />}
        </button>
        <button type="button" onClick={() => setShowAbortConfirm(true)} className="px-3 py-2 bg-red-950/50 border border-red-800 rounded-lg text-xs font-bold text-red-200 outline-none">
          Abbrechen
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30 flex flex-col font-sans relative">
      
      {showAbortConfirm && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full text-center">
            <AlertTriangle size={40} className="mx-auto text-red-500 mb-4 animate-pulse" />
            <h3 className="text-xl font-bold mb-2">Run abbrechen?</h3>
            <div className="flex flex-col gap-3">
              <button type="button" onClick={resetToMenu} className="w-full py-3 bg-red-600 rounded-xl font-bold outline-none">Ja, beenden</button>
              <button type="button" onClick={() => setShowAbortConfirm(false)} className="w-full py-3 bg-slate-800 rounded-xl font-bold outline-none">Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'CHAR_SELECT' && (
        <div className="absolute top-4 right-4 z-50">
          <button type="button" onClick={toggleAudio} className="p-3 bg-slate-900 border border-slate-700 rounded-full shadow-lg outline-none hover:bg-slate-800 transition">
            {audioEnabled ? <Volume2 size={24} className="text-amber-400" /> : <VolumeX size={24} className="text-slate-500" />}
          </button>
        </div>
      )}

      {gameState !== 'CHAR_SELECT' && gameState !== 'WIN_SCREEN' && gameState !== 'LOSE_SCREEN' && <TopBar />}

      <div className="flex-1 relative">
        {gameState === 'CHAR_SELECT' && <CharacterSelect characters={characters} onSelect={handleSelectCharacter} />}

        {gameState === 'START_BONUS' && (
          <div className="p-4 text-center mt-10">
            <Sparkles size={48} className="text-cyan-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-black mb-8">Segen des Fuchses</h2>
            <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto">
              <button type="button" onClick={() => claimStartBonus('card')} className="flex-1 border-2 border-slate-700 bg-slate-900 p-6 rounded-xl text-left hover:border-cyan-500 outline-none">
                <div className="text-xs text-cyan-400 font-bold mb-3">Option 1: Karte</div>
                <div className="font-bold text-lg">{startBonusChoice.card?.name}</div>
              </button>
              <button type="button" onClick={() => claimStartBonus('artifact')} className="flex-1 border-2 border-slate-700 bg-slate-900 p-6 rounded-xl text-left hover:border-amber-500 outline-none">
                <div className="text-xs text-amber-400 font-bold mb-3">Option 2: Artefakt</div>
                <div className="font-bold text-lg"><Package size={18} className="inline mr-2"/>{startBonusChoice.artifact?.name}</div>
              </button>
            </div>
          </div>
        )}

        {gameState === 'BOSS_REWARD' && (
          <div className="p-4 text-center mt-10">
            <Crown size={60} className="text-amber-500 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl font-black text-amber-400 mb-8">Boss bezwungen! Wähle dein Relikt:</h2>
            <div className="flex flex-col gap-4 max-w-lg mx-auto mb-8">
              {bossRewardChoices.map((artifact, i) => (
                <button type="button" key={i} onClick={() => claimBossReward(artifact.id)} className="border-2 border-slate-700 bg-slate-900 p-5 rounded-xl text-left hover:border-amber-500 transition outline-none">
                  <div className="font-bold text-amber-400 text-lg">{artifact.name}</div><div className="text-sm text-slate-300">{artifact.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'MAP' && <GameMap currentTier={currentTier} currentAct={currentAct} visitedNodes={visitedNodes} onSelectNode={handleSelectNode} character={selectedChar} playerArtifacts={playerArtifacts} />}
        {gameState === 'COMBAT' && <CombatScreen character={{...selectedChar, currentHp: playerCurrentHp, maxHp: selectedChar.maxHp, startingDeck: playerDeck}} enemy={currentEnemy} playerArtifacts={playerArtifacts} onCombatWin={handleCombatWin} onCombatLose={() => setGameState('LOSE_SCREEN')} />}

        {gameState === 'SHOP' && (
          <div className="min-h-[80vh] p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-cyan-400 mb-6 mt-4"><ShoppingCart /> Fuchshändler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
              {shopInventory.cards?.map((card, idx) => (
                <button type="button" key={idx} disabled={playerGold < card.price} onClick={() => { setPlayerGold(p => p - card.price); setPlayerDeck(p => [...p, { ...card, uniqId: `shop-${Date.now()}` }]); setShopInventory(prev => ({...prev, cards: prev.cards.filter((_, i) => i !== idx)})); }} className="border border-slate-800 bg-slate-900/80 p-4 rounded-xl flex flex-col justify-between text-left hover:border-cyan-500 disabled:opacity-40 transition min-h-[100px] outline-none">
                  <div><div className="font-bold text-slate-200">{card.name}</div><p className="text-xs text-slate-400">{card.desc}</p></div>
                  <div className="mt-2 text-sm font-bold text-amber-400"><Coins size={14} className="inline"/> {card.price}</div>
                </button>
              ))}
            </div>
            <button type="button" onClick={advanceMap} className="mt-8 px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-sm transition min-h-[44px] outline-none">Shop verlassen</button>
          </div>
        )}

        {gameState === 'CAMPFIRE' && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            <Flame size={48} className="text-orange-500 mb-6 animate-pulse" />
            <h2 className="text-2xl font-black mb-8">Sichere Lichtung</h2>
            <div className="flex flex-col w-full max-w-sm gap-4">
              <button type="button" onClick={() => { setPlayerCurrentHp(p => Math.min(selectedChar.maxHp, p + Math.floor(selectedChar.maxHp * 0.3))); advanceMap(); }} className="border border-slate-700 bg-slate-900 p-6 rounded-xl hover:border-emerald-500 transition min-h-[80px] outline-none">
                <Heart className="mx-auto text-emerald-500 mb-2"/>
                <div className="font-bold">Ausruhen</div>
                <p className="text-xs text-slate-400">Heilt 30% max HP</p>
              </button>
              <button type="button" onClick={() => { setPlayerDeck(prev => prev.map(c => c.type === 'Angriff' ? { ...c, damage: (c.damage||0) + 3 } : c)); advanceMap(); }} className="border border-slate-700 bg-slate-900 p-6 rounded-xl hover:border-orange-500 transition min-h-[80px] outline-none">
                <Flame className="mx-auto text-orange-500 mb-2"/>
                <div className="font-bold">Schmieden</div>
                <p className="text-xs text-slate-400">Alle Angriffe +3 Schaden</p>
              </button>
            </div>
          </div>
        )}

        {gameState === 'EVENT' && activeEvent && (
          <div className="p-4 flex flex-col items-center mt-10">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">{activeEvent.title}</h2>
              <p className="text-slate-300 mb-8">{activeEvent.text}</p>
              <div className="flex flex-col gap-3">
                {activeEvent.options.map((opt, idx) => (
                  <button type="button" key={idx} onClick={() => { opt.action(eventAPI); advanceMap(); }} className="p-4 bg-slate-950 border border-slate-700 rounded-xl text-left hover:border-purple-500 outline-none">{opt.text}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === 'REWARD' && (
          <div className="p-4 text-center mt-20">
            <h2 className="text-2xl font-black text-amber-400 mb-6">Sieg! Wähle eine Karte:</h2>
            <div className="flex flex-col gap-4 max-w-sm mx-auto mb-6">
              {[...Array(3)].map((_, i) => {
                const k = Object.keys(CARDS);
                const c = CARDS[k[Math.floor(Math.random()*k.length)]];
                return <button type="button" key={i} onClick={() => claimCardReward(c)} className="border border-slate-700 bg-slate-900 p-4 rounded-xl text-left font-bold text-amber-400 outline-none">{c.name}</button>;
              })}
            </div>
            <button type="button" onClick={() => claimCardReward(null)} className="py-3 px-6 bg-slate-800 rounded-xl font-bold outline-none">Überspringen</button>
          </div>
        )}

        {gameState === 'WIN_SCREEN' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-900">
            <Trophy size={60} className="text-amber-400 mb-6 animate-bounce" />
            <h1 className="text-3xl font-black text-amber-400 mb-4">RUN GEWONNEN!</h1>
            <p className="text-slate-300 mb-8 max-w-sm">Aufstiegslevel freigeschaltet. Die nächste Reise wird gefährlicher.</p>
            <button type="button" onClick={resetToMenu} className="px-8 py-4 bg-amber-600 hover:bg-amber-500 font-bold rounded-xl min-h-[44px] outline-none">Hauptmenü</button>
          </div>
        )}

        {gameState === 'LOSE_SCREEN' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-950">
            <ShieldAlert size={60} className="text-red-500 mb-6" />
            <h1 className="text-3xl font-black text-red-500 mb-4">GEFALLEN</h1>
            <button type="button" onClick={resetToMenu} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl min-h-[44px] outline-none">Neuer Versuch</button>
          </div>
        )}
      </div>
    </div>
  );
}
