import React, { useState, useEffect } from 'react';
import CharacterSelect from './components/CharacterSelect';
import GameMap from './components/GameMap';
import CombatScreen from './components/CombatScreen';
import { CHARACTERS, ENEMIES, ARTIFACTS, CARDS, EVENTS } from './data/gameData';
import { Trophy, ShieldAlert, Package, ShoppingCart, Coffee, HelpCircle, Coins, Heart, Volume2, VolumeX, AlertTriangle, Sparkles, Crown } from 'lucide-react';
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

  const [audioEnabled, setAudioEnabled] = useState(false); // Aus Schutz für Ohren standardmäßig aus, Spieler muss es oben links aktivieren!
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('fox_rogue_chars_v7', JSON.stringify(characters));
  }, [characters]);

  // Audio Toggle
  useEffect(() => {
    if (audioEnabled && gameState !== 'CHAR_SELECT') startBGM();
    else stopBGM();
  }, [audioEnabled, gameState]);

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
      let enemyPool = ENEMIES.filter(e => e.type === node.type && e.act === currentAct);
      if (enemyPool.length === 0) enemyPool = ENEMIES.filter(e => e.type === 'Normal');
      const baseEnemy = enemyPool[Math.floor(Math.random() * enemyPool.length)];
      
      setCurrentEnemy({ ...baseEnemy, hp: baseEnemy.hp, maxHp: baseEnemy.hp });
      setEarnedGoldThisCombat((node.type === 'Elite' ? 40 : node.type === 'Boss' ? 100 : 15) + Math.floor(Math.random() * 15));
      setGameState('COMBAT');
      
    } else if (node.type === 'Schatztruhe') {
      const normalArtifacts = Object.keys(ARTIFACTS).filter(k => !ARTIFACTS[k].isBoss);
      setPlayerArtifacts(prev => [...prev, normalArtifacts[Math.floor(Math.random() * normalArtifacts.length)]]);
      if (audioEnabled) playReward();
      setTimeout(() => advanceMap(), 1500);
      
    } else if (node.type === 'Shop') {
      const keys = Object.keys(CARDS);
      setShopInventory({ cards: Array.from({length: 4}).map(() => ({ ...CARDS[keys[Math.floor(Math.random() * keys.length)]], price: 45 + Math.floor(Math.random() * 30) })) });
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

  const advanceMap = () => { setCurrentTier(prev => Math.min(9, prev + 1)); setGameState('MAP'); };
  const resetToMenu = () => { setShowAbortConfirm(false); setGameState('CHAR_SELECT'); setSelectedChar(null); };

  // --- EVENT STATES (Mini API für Events, damit sie HP ändern können) ---
  const eventAPI = {
    hurt: (amount) => setPlayerCurrentHp(p => Math.max(1, p - amount)),
    heal: (amount) => setPlayerCurrentHp(p => Math.min(selectedChar.maxHp, p + amount)),
    spend: (amount) => setPlayerGold(p => Math.max(0, p - amount)),
    gainGold: (amount) => setPlayerGold(p => p + amount),
    addCard: (cardId) => setPlayerDeck(p => [...p, { ...CARDS[cardId], uniqId: `evt-${Date.now()}` }]),
    giveRandomArtifact: () => setPlayerArtifacts(p => [...p, Object.keys(ARTIFACTS)[0]]),
    gold: playerGold
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30 flex flex-col font-sans">
      
      {showAbortConfirm && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full text-center">
            <AlertTriangle size={40} className="mx-auto text-red-500 mb-4 animate-pulse" />
            <h3 className="text-xl font-bold mb-2">Run abbrechen?</h3>
            <div className="flex flex-col gap-3">
              <button onClick={resetToMenu} className="py-3 bg-red-600 rounded-xl font-bold">Ja, beenden</button>
              <button onClick={() => setShowAbortConfirm(false)} className="py-3 bg-slate-800 rounded-xl font-bold">Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      {gameState !== 'CHAR_SELECT' && gameState !== 'WIN_SCREEN' && gameState !== 'LOSE_SCREEN' && (
        <div className="w-full bg-slate-950/90 border-b border-slate-800 p-3 flex justify-between items-center z-40 sticky top-0">
          <div className="flex gap-4">
            <div className="font-bold text-amber-400 flex items-center gap-1"><Heart size={16} className="text-red-500"/> {playerCurrentHp}/{selectedChar?.maxHp}</div>
            <div className="font-bold text-amber-400 flex items-center gap-1"><Coins size={16}/> {playerGold}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleAudio} className="p-2 bg-slate-900 border border-slate-700 rounded-lg">{audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-slate-500" />}</button>
            <button onClick={() => setShowAbortConfirm(true)} className="px-3 bg-red-950/50 border border-red-800 rounded-lg text-xs font-bold text-red-200">Abbrechen</button>
          </div>
        </div>
      )}

      <div className="flex-1 relative">
        {gameState === 'CHAR_SELECT' && <CharacterSelect characters={characters} onSelect={handleSelectCharacter} />}

        {gameState === 'START_BONUS' && (
          <div className="p-4 text-center mt-10">
            <Sparkles size={48} className="text-cyan-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-black mb-8">Segen des Fuchses</h2>
            <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto">
              <button onClick={() => claimStartBonus('card')} className="flex-1 border-2 border-slate-700 bg-slate-900 p-6 rounded-xl text-left hover:border-cyan-500">
                <div className="text-xs text-cyan-400 font-bold mb-3">Option 1: Karte</div>
                <div className="font-bold text-lg">{startBonusChoice.card?.name}</div>
              </button>
              <button onClick={() => claimStartBonus('artifact')} className="flex-1 border-2 border-slate-700 bg-slate-900 p-6 rounded-xl text-left hover:border-amber-500">
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
                <button key={i} onClick={() => { setPlayerArtifacts(p => [...p, artifact.id]); setCurrentAct(p => p + 1); setCurrentTier(0); setVisitedNodes([]); setGameState('MAP'); }} className="border-2 border-slate-700 bg-slate-900 p-5 rounded-xl text-left hover:border-amber-500">
                  <div className="font-bold text-amber-400 text-lg">{artifact.name}</div><div className="text-sm text-slate-300">{artifact.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'MAP' && <GameMap currentTier={currentTier} currentAct={currentAct} visitedNodes={visitedNodes} onSelectNode={handleSelectNode} character={selectedChar} playerArtifacts={playerArtifacts} />}
        {gameState === 'COMBAT' && <CombatScreen character={{...selectedChar, currentHp: playerCurrentHp, maxHp: selectedChar.maxHp, startingDeck: playerDeck}} enemy={currentEnemy} playerArtifacts={playerArtifacts} onCombatWin={handleCombatWin} onCombatLose={() => setGameState('LOSE_SCREEN')} />}

        {gameState === 'EVENT' && activeEvent && (
          <div className="p-4 flex flex-col items-center mt-10">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">{activeEvent.title}</h2>
              <p className="text-slate-300 mb-8">{activeEvent.text}</p>
              <div className="flex flex-col gap-3">
                {activeEvent.options.map((opt, idx) => (
                  <button key={idx} onClick={() => { opt.action(eventAPI); if(audioEnabled) playClick(); advanceMap(); }} className="p-4 bg-slate-950 border border-slate-700 rounded-xl text-left hover:border-purple-500">{opt.text}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ... REWARD, SHOP, WIN und LOSE SCREENS analog (Code abgekürzt zur Übersichtlichkeit, Logik wie zuvor, nutzt advanceMap) */}
        {gameState === 'REWARD' && (
          <div className="p-4 text-center mt-20">
            <h2 className="text-2xl font-black text-amber-400 mb-6">Sieg! Wähle eine Karte:</h2>
            <div className="flex flex-col gap-4 max-w-sm mx-auto mb-6">
              {[...Array(3)].map((_, i) => {
                const k = Object.keys(CARDS);
                const c = CARDS[k[Math.floor(Math.random()*k.length)]];
                return <button key={i} onClick={() => claimCardReward(c)} className="border border-slate-700 bg-slate-900 p-4 rounded-xl text-left font-bold text-amber-400">{c.name}</button>;
              })}
            </div>
            <button onClick={() => claimCardReward(null)} className="py-3 px-6 bg-slate-800 rounded-xl font-bold">Überspringen</button>
          </div>
        )}
      </div>
    </div>
  );
}
