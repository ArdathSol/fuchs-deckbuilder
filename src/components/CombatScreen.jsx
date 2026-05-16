import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Swords, RefreshCw, Zap, Award } from 'lucide-react';
import { CARDS, ARTIFACTS } from '../data/gameData';
import { playClick, playHit } from '../utils/audio'; // Sound importieren

export default function CombatScreen({ character, enemy, onCombatWin, onCombatLose, playerArtifacts }) {
  const [playerHp, setPlayerHp] = useState(character.currentHp);
  const [playerBlock, setPlayerBlock] = useState(0);
  
  // Artefakt-Logik: Energie-Bonus berechnen!
  const hasEnergyRelic = playerArtifacts?.includes('stone_fox_idol') || playerArtifacts?.includes('boss_energy_core');
  const baseEnergy = hasEnergyRelic ? character.maxEnergy + 1 : character.maxEnergy;
  const [playerEnergy, setPlayerEnergy] = useState(baseEnergy);
  
  const [enemyHp, setEnemyHp] = useState(enemy.hp);
  const [enemyBlock, setEnemyBlock] = useState(enemy.block || 0);
  const [enemyIntent, setEnemyIntent] = useState({ type: 'attack', value: enemy.intentValue });
  const [enemyBurn, setEnemyBurn] = useState(0);

  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [discard, setDiscard] = useState([]);
  
  const [log, setLog] = useState([`Kampf gegen ${enemy.name} beginnt!`]);
  const [foxAnimate, setFoxAnimate] = useState('');
  const [enemyAnimate, setEnemyAnimate] = useState('');

  useEffect(() => {
    // Start-Artefakte anwenden
    if (playerArtifacts?.includes('boss_dragon_scale')) setPlayerBlock(12);
    if (playerArtifacts?.includes('shadow_charm')) { /* Gegner-Schwäche simulieren */ }

    const fullDeck = character.startingDeck.map((card, index) => ({ ...CARDS[card], uniqId: `battle-${index}` }));
    const shuffled = [...fullDeck].sort(() => Math.random() - 0.5);
    
    // Artefakt-Logik: Extra Karten ziehen?
    const startDraw = playerArtifacts?.includes('cyber_core') ? 5 : 4;
    
    setHand(shuffled.slice(0, startDraw));
    setDeck(shuffled.slice(startDraw));
    setDiscard([]);
  }, [character, enemy]);

  const addLog = (msg) => setLog(prev => [...prev.slice(-4), msg]);

  const startPlayerTurn = (currentDiscard, currentDeck) => {
    setPlayerEnergy(baseEnergy); // Nutzt berechnete Artefakt-Energie
    setPlayerBlock(0);
    
    if (enemyBurn > 0) {
      setEnemyHp(prev => {
        const nextHp = Math.max(0, prev - enemyBurn);
        if (nextHp <= 0) setTimeout(() => onCombatWin(playerHp), 800);
        return nextHp;
      });
      addLog(`🔥 Brand fügt dem Gegner ${enemyBurn} Schaden zu.`);
    }

    let newDeck = [...currentDeck];
    let newDiscard = [...currentDiscard];
    if (newDeck.length < 5) {
      newDeck = [...newDeck, ...newDiscard].sort(() => Math.random() - 0.5);
      newDiscard = [];
    }

    const drawCount = playerArtifacts?.includes('cyber_core') ? 5 : 4;
    setHand(newDeck.slice(0, drawCount));
    setDeck(newDeck.slice(drawCount));
    setDiscard(newDiscard);
    
    setEnemyIntent({ type: Math.random() > 0.5 ? 'attack' : 'defend_attack', value: enemy.intentValue });
  };

  const endTurn = () => {
    playClick();
    const nextDiscard = [...discard, ...hand];
    setHand([]);
    setDiscard(nextDiscard);

    setEnemyAnimate('animate-pulse');
    setTimeout(() => setEnemyAnimate(''), 400);

    let dmgToPlayer = enemyIntent.type.includes('attack') ? enemyIntent.value : 0;

    if (dmgToPlayer > 0) {
      playHit(); // Gegner trifft!
      setFoxAnimate('bg-red-500/30');
      setTimeout(() => setFoxAnimate(''), 300);

      const dmgAfterBlock = Math.max(0, dmgToPlayer - playerBlock);
      setPlayerBlock(Math.max(0, playerBlock - dmgToPlayer));
      
      setPlayerHp(prev => {
        const nextHp = Math.max(0, prev - dmgAfterBlock);
        if (nextHp <= 0) setTimeout(() => onCombatLose(), 800);
        return nextHp;
      });
      addLog(`${enemy.name} greift an. Du nimmst ${dmgAfterBlock} Schaden.`);
    }

    setTimeout(() => startPlayerTurn(nextDiscard, deck), 600);
  };

  const playCard = (card, index) => {
    if (playerEnergy < card.cost) return;
    playClick();
    setPlayerEnergy(prev => prev - card.cost);
    
    const newHand = [...hand];
    newHand.splice(index, 1);
    setHand(newHand);
    setDiscard(prev => [...prev, card]);

    if (card.block > 0) {
      setPlayerBlock(prev => prev + card.block);
    }
    if (card.damage > 0) {
      playHit(); // Fuchs trifft!
      setEnemyAnimate('bg-orange-500/30');
      setTimeout(() => setEnemyAnimate(''), 200);

      const dmgAfterBlock = Math.max(0, card.damage - enemyBlock);
      setEnemyBlock(Math.max(0, enemyBlock - card.damage));
      
      setEnemyHp(prev => {
        const nextHp = Math.max(0, prev - dmgAfterBlock);
        if (nextHp <= 0) setTimeout(() => onCombatWin(playerHp), 600);
        return nextHp;
      });
    }
    if (card.burn > 0) setEnemyBurn(prev => prev + card.burn);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 md:p-6 pb-24 text-white">
      {/* UI Kampf... (Rest wie gehabt, nur mit verbesserter Anzeige) */}
      <div className="flex justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
        <h2 className="font-bold text-red-400">{enemy.name} (HP: {enemyHp}/{enemy.maxHp})</h2>
        <div className="text-amber-400 font-bold">🦊 HP: {playerHp}/{character.maxHp}</div>
      </div>
      
      {/* Sprite Bereich */}
      <div className="grid grid-cols-2 gap-4 flex-1 items-center justify-items-center">
        <div className={`text-6xl animate-bounce-slow ${foxAnimate}`}>🦊<div className="text-blue-400 text-sm mt-2 font-bold text-center">🛡️ {playerBlock}</div></div>
        <div className={`text-6xl ${enemyAnimate}`}>{enemy.sprite}<div className="text-blue-400 text-sm mt-2 font-bold text-center">🛡️ {enemyBlock}</div><div className="text-red-400 text-sm mt-1 font-bold text-center">⚔️ {enemyIntent.value}</div></div>
      </div>

      {/* Hand & Mana */}
      <div className="mt-auto">
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="w-14 h-14 bg-cyan-900 border-2 border-cyan-400 rounded-full flex flex-col items-center justify-center font-bold text-xl shadow-[0_0_15px_cyan]">
            {playerEnergy}
          </div>
          <button onClick={endTurn} className="px-6 py-3 bg-orange-700 hover:bg-orange-600 font-bold rounded-xl shadow-lg border border-orange-500">Zug beenden</button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4">
          {hand.map((card, idx) => {
             const canPlay = playerEnergy >= card.cost;
             return (
               <button key={card.uniqId} disabled={!canPlay} onClick={() => playCard(card, idx)} className={`flex-shrink-0 w-28 p-3 rounded-xl border-2 text-left transition-transform ${canPlay ? 'border-amber-500 bg-slate-800 hover:-translate-y-2' : 'border-slate-700 bg-slate-900 opacity-50'}`}>
                 <div className="flex justify-between items-center text-xs mb-1 font-bold"><span className="text-slate-400 uppercase">{card.type}</span><span className="bg-cyan-900 text-cyan-300 w-5 h-5 rounded-full flex items-center justify-center">{card.cost}</span></div>
                 <div className="font-bold text-sm mb-1">{card.name}</div>
                 <div className="text-[10px] text-slate-300">{card.desc}</div>
               </button>
             );
          })}
        </div>
      </div>
    </div>
  );
}
