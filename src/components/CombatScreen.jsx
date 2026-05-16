import React, { useState, useEffect } from 'react';
import { CARDS } from '../data/gameData';
import { playClick, playHit } from '../utils/audio';

export default function CombatScreen({ character, enemy, onCombatWin, onCombatLose, playerArtifacts }) {
  const [playerHp, setPlayerHp] = useState(character.currentHp);
  const [playerBlock, setPlayerBlock] = useState(0);
  
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
  
  const [foxAnimate, setFoxAnimate] = useState('');
  const [enemyAnimate, setEnemyAnimate] = useState('');

  const getBgStyle = (act) => {
    switch (act) {
      case 1: return 'bg-gradient-to-b from-emerald-950 to-slate-950';
      case 2: return 'bg-gradient-to-b from-indigo-950 to-slate-950';
      case 3: return 'bg-gradient-to-b from-red-950 to-slate-950';
      default: return 'bg-slate-950';
    }
  };

  useEffect(() => {
    if (playerArtifacts?.includes('boss_dragon_scale')) setPlayerBlock(12);

    const fullDeck = (character.startingDeck || []).map((card, index) => {
      const cardObj = typeof card === 'string' ? CARDS[card] : card;
      return { ...cardObj, uniqId: `battle-${index}-${Date.now()}` };
    });
    
    const shuffled = [...fullDeck].sort(() => Math.random() - 0.5);
    const startDraw = playerArtifacts?.includes('cyber_core') ? 5 : 4;
    
    setHand(shuffled.slice(0, startDraw));
    setDeck(shuffled.slice(startDraw));
    setDiscard([]);
  }, [character, enemy, playerArtifacts]);

  const startPlayerTurn = (currentDiscard, currentDeck) => {
    if (playerHp <= 0) return;

    setPlayerEnergy(baseEnergy);
    setPlayerBlock(0);
    
    if (enemyBurn > 0) {
      setEnemyHp(prev => {
        const nextHp = Math.max(0, prev - enemyBurn);
        if (nextHp <= 0) setTimeout(() => onCombatWin(playerHp), 600);
        return nextHp;
      });
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
      playHit(); 
      setFoxAnimate('bg-red-500/30');
      setTimeout(() => setFoxAnimate(''), 300);

      const dmgAfterBlock = Math.max(0, dmgToPlayer - playerBlock);
      setPlayerBlock(Math.max(0, playerBlock - dmgToPlayer));
      
      setPlayerHp(prev => {
        const nextHp = Math.max(0, prev - dmgAfterBlock);
        if (nextHp <= 0) {
          setTimeout(() => onCombatLose(), 600);
          return 0;
        }
        return nextHp;
      });
    }

    setTimeout(() => {
      setPlayerHp(current => {
        if (current > 0) startPlayerTurn(nextDiscard, deck);
        return current;
      });
    }, 600);
  };

  const playCard = (card, index) => {
    if (playerEnergy < card.cost || enemyHp <= 0 || playerHp <= 0) return;
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
      playHit();
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
    <div className={`h-[calc(100dvh-68px)] flex flex-col justify-between overflow-hidden text-white ${getBgStyle(enemy.act)}`}>
      
      <div className="flex justify-between p-3 bg-slate-950/50 border-b border-slate-800 shadow-md shrink-0">
        <h2 className="font-bold text-red-400">{enemy.name} (HP: {enemyHp}/{enemy.maxHp})</h2>
        <div className="text-amber-400 font-bold">🦊 HP: {playerHp}/{character.maxHp}</div>
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-4 items-center justify-items-center">
        <div className={`text-6xl sm:text-7xl animate-bounce-slow rounded-full p-4 ${foxAnimate}`}>
          🦊
          <div className="text-blue-400 text-sm mt-2 font-bold text-center">🛡️ {playerBlock}</div>
        </div>
        <div className={`text-6xl sm:text-7xl rounded-full p-4 ${enemyAnimate}`}>
          {enemy.sprite}
          <div className="text-blue-400 text-sm mt-2 font-bold text-center">🛡️ {enemyBlock}</div>
          <div className="text-red-400 text-sm mt-1 font-bold text-center">⚔️ {enemyIntent.value}</div>
        </div>
      </div>

      <div className="shrink-0 bg-slate-950/80 border-t border-slate-800 pb-2">
        <div className="flex justify-between items-center p-3">
          <div className="w-12 h-12 bg-cyan-900 border-2 border-cyan-400 rounded-full flex items-center justify-center font-bold text-xl shadow-[0_0_10px_cyan]">
            {playerEnergy}
          </div>
          <button type="button" onClick={endTurn} disabled={playerHp <= 0 || enemyHp <= 0} className="px-6 py-3 bg-orange-700 hover:bg-orange-600 font-bold rounded-xl shadow-lg border border-orange-500 disabled:opacity-50 outline-none">
            Zug beenden
          </button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto px-3 pb-4 min-h-[140px]">
          {hand.map((card, idx) => {
             const canPlay = playerEnergy >= card.cost;
             return (
               <button 
                 type="button" 
                 key={card.uniqId} 
                 disabled={!canPlay || playerHp <= 0 || enemyHp <= 0} 
                 onClick={() => playCard(card, idx)} 
                 className={`flex-shrink-0 w-28 p-3 rounded-xl border-2 text-left transition-transform outline-none ${canPlay ? 'border-amber-500 bg-slate-800 hover:-translate-y-2' : 'border-slate-700 bg-slate-900 opacity-50'}`}
               >
                 <div className="flex justify-between items-center text-[10px] mb-1 font-bold">
                   <span className="text-slate-400 uppercase truncate pr-1">{card.type}</span>
                   <span className="bg-cyan-900 text-cyan-300 w-5 h-5 rounded-full flex items-center justify-center shrink-0">{card.cost}</span>
                 </div>
                 <div className="font-bold text-sm mb-1">{card.name}</div>
                 <div className="text-[10px] text-slate-300 leading-tight">{card.desc}</div>
               </button>
             );
          })}
        </div>
      </div>

    </div>
  );
}
