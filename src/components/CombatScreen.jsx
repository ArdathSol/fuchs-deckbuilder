import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Swords, RefreshCw, Zap, Award } from 'lucide-react';
import { CARDS } from '../data/gameData';

export default function CombatScreen({ character, enemy, onCombatWin, onCombatLose }) {
  // Game states
  const [playerHp, setPlayerHp] = useState(character.hp);
  const [playerBlock, setPlayerBlock] = useState(0);
  const [playerEnergy, setPlayerEnergy] = useState(character.energy);
  
  const [enemyHp, setEnemyHp] = useState(enemy.hp);
  const [enemyBlock, setEnemyBlock] = useState(enemy.block || 0);
  const [enemyIntent, setEnemyIntent] = useState({ type: enemy.intent, value: enemy.intentValue });
  const [enemyBurn, setEnemyBurn] = useState(0);

  // Deck mechanics
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [discard, setDiscard] = useState([]);
  
  // Animation/Feedback logs
  const [log, setLog] = useState([`Kampf gegen ${enemy.name} beginnt!`]);
  const [foxAnimate, setFoxAnimate] = useState('');
  const [enemyAnimate, setEnemyAnimate] = useState('');

  // Initialize deck on mount
  useEffect(() => {
    const fullDeck = character.startingDeck.map((cardId, index) => ({
      ...CARDS[cardId],
      uniqId: `${cardId}-${index}`
    }));
    
    // Quick shuffle
    const shuffled = [...fullDeck].sort(() => Math.random() - 0.5);
    const initialHand = shuffled.slice(0, 4);
    const initialDeck = shuffled.slice(4);

    setDeck(initialDeck);
    setHand(initialHand);
    setDiscard([]);

    // Character passive effect
    if (character.id === 'fire') {
      setEnemyBurn(3);
      setLog(prev => [...prev, "Passiv 'Hitzewelle' ausgelöst: Gegner brennt!"]);
    }
  }, [character, enemy]);

  const addLog = (msg) => setLog(prev => [...prev.slice(-4), msg]);

  // Turn management: Draw cards
  const startPlayerTurn = (currentDiscard, currentDeck) => {
    setPlayerEnergy(character.maxEnergy);
    setPlayerBlock(0); // Block resets at start of turn Slay-the-Spire-style
    
    // Apply burn damage to enemy at start of turn
    if (enemyBurn > 0) {
      setEnemyHp(prev => {
        const nextHp = Math.max(0, prev - enemyBurn);
        if (nextHp <= 0) setTimeout(() => onCombatWin(), 800);
        return nextHp;
      });
      addLog(`🔥 Brand fügt dem Gegner ${enemyBurn} Schaden zu.`);
    }

    // Combine and reshuffle if deck is low
    let newDeck = [...currentDeck];
    let newDiscard = [...currentDiscard];
    
    if (newDeck.length < 4) {
      newDeck = [...newDeck, ...newDiscard].sort(() => Math.random() - 0.5);
      newDiscard = [];
    }

    const newHand = newDeck.slice(0, 4);
    newDeck = newDeck.slice(4);

    setHand(newHand);
    setDeck(newDeck);
    setDiscard(newDiscard);
    
    // Cycle enemy intents randomly for dynamic play
    const intents = ['attack', 'defend_attack', 'buff_attack'];
    const nextIntent = intents[Math.floor(Math.random() * intents.length)];
    const nextVal = enemy.intentValue + (Math.random() > 0.5 ? 2 : -1);
    setEnemyIntent({ type: nextIntent, value: Math.max(4, nextVal) });
  };

  const endTurn = () => {
    // 1. Discard remaining cards
    const nextDiscard = [...discard, ...hand];
    setHand([]);
    setDiscard(nextDiscard);

    // 2. Enemy turn action execution
    setEnemyAnimate('animate-wiggle');
    setTimeout(() => setEnemyAnimate(''), 400);

    let dmgToPlayer = 0;
    if (enemyIntent.type === 'attack' || enemyIntent.type === 'defend_attack' || enemyIntent.type === 'buff_attack') {
      dmgToPlayer = enemyIntent.value;
    }

    if (enemyIntent.type === 'defend_attack') {
      setEnemyBlock(prev => prev + 5);
      addLog(`${enemy.name} schützt sich für 5 Block.`);
    }

    if (dmgToPlayer > 0) {
      setFoxAnimate('bg-red-500/30');
      setTimeout(() => setFoxAnimate(''), 300);

      const damageAfterBlock = Math.max(0, dmgToPlayer - playerBlock);
      const remainingBlock = Math.max(0, playerBlock - dmgToPlayer);
      
      setPlayerBlock(remainingBlock);
      
      // Character passive check for normal fox
      if (character.id === 'normal' && remainingBlock < playerBlock) {
        setEnemyHp(prev => Math.max(0, prev - 2));
        addLog("🛡️ Passiv 'Schwanz-Konter': 2 Konterschaden reflektiert.");
      }

      setPlayerHp(prev => {
        const nextHp = Math.max(0, prev - damageAfterBlock);
        if (nextHp <= 0) {
          setTimeout(() => onCombatLose(), 800);
        }
        return nextHp;
      });

      addLog(`${enemy.name} greift für ${dmgToPlayer} an. Du nimmst ${damageAfterBlock} Schaden.`);
    }

    // 3. Start next player turn
    setTimeout(() => {
      startPlayerTurn(nextDiscard, deck);
    }, 600);
  };

  const playCard = (card, index) => {
    if (playerEnergy < card.cost) return;

    // Deduct cost
    setPlayerEnergy(prev => prev - card.cost);
    
    // Remove from hand, put to discard
    const newHand = [...hand];
    newHand.splice(index, 1);
    setHand(newHand);
    setDiscard(prev => [...prev, card]);

    // Apply effects
    if (card.block > 0) {
      setPlayerBlock(prev => prev + card.block);
      addLog(`Du spielst ${card.name}: Gewinne ${card.block} Block.`);
    }

    if (card.damage > 0) {
      setEnemyAnimate('bg-orange-500/20');
      setTimeout(() => setEnemyAnimate(''), 200);

      const dmg = card.damage;
      const damageAfterBlock = Math.max(0, dmg - enemyBlock);
      setEnemyBlock(prev => Math.max(0, prev - dmg));
      
      setEnemyHp(prev => {
        const nextHp = Math.max(0, prev - damageAfterBlock);
        if (nextHp <= 0) {
          setTimeout(() => onCombatWin(), 600);
        }
        return nextHp;
      });
      addLog(`Du spielst ${card.name}: Fügt ${dmg} Schaden zu.`);
    }

    if (card.burn > 0) {
      setEnemyBurn(prev => prev + card.burn);
      addLog(`🔥 ${card.name} erhöht Brand-Effekt um +${card.burn}.`);
    }

    if (card.id === 'overclock') {
      setPlayerEnergy(prev => prev + 2);
    }
    if (card.id === 'plasma_shield') {
      // Logic simulation helper
    }
  };

  return (
    <div class="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 md:p-6 select-none">
      
      {/* Top Header - Combat Stats */}
      <div class="flex justify-between items-center bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-lg">
        <div class="flex items-center gap-2">
          <span class="text-xs px-2 py-1 bg-red-950 text-red-400 font-bold border border-red-900/60 rounded">GEGNER</span>
          <h2 class="font-extrabold text-base md:text-lg">{enemy.name}</h2>
        </div>
        <div class="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div>Karten im Deck: <span class="text-amber-400">{deck.length}</span></div>
          <div>Ablagestapel: <span class="text-slate-300">{discard.length}</span></div>
        </div>
      </div>

      {/* Main Battle Field Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-auto max-w-5xl w-full mx-auto py-4">
        
        {/* Left Side: Player Fox */}
        <div class={`p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur transition-all duration-300 flex flex-col items-center ${foxAnimate}`}>
          <div class="relative w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-600/20 border-2 border-orange-500/40 flex items-center justify-center text-6xl mb-4 shadow-inner animate-bounce-slow">
            🦊
            {playerBlock > 0 && (
              <div class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full border border-blue-400 shadow-md flex items-center gap-0.5 animate-pulse">
                <Shield size={12} fill="currentColor" /> {playerBlock}
              </div>
            )}
          </div>
          
          <h3 class="font-bold text-lg text-orange-400 mb-1">{character.name}</h3>
          
          {/* Health Bar */}
          <div class="w-full max-w-xs bg-slate-950 rounded-full h-4 border border-slate-800 overflow-hidden relative shadow-inner">
            <div 
              class="bg-gradient-to-r from-red-600 to-rose-500 h-full transition-all duration-300"
              style={{ width: `${(playerHp / character.maxHp) * 100}%` }}
            ></div>
            <span class="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold">
              {playerHp} / {character.maxHp} HP
            </span>
          </div>

          <div class="mt-3 flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-900/40">
            <Award size={13} /> {character.ability.name} aktiv
          </div>
        </div>

        {/* Right Side: Enemy Monster */}
        <div class={`p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur transition-all duration-300 flex flex-col items-center ${enemyAnimate}`}>
          <div class="relative w-32 h-32 rounded-full bg-gradient-to-br from-red-950/30 to-slate-900 border-2 border-red-900/40 flex items-center justify-center text-6xl mb-4 shadow-inner">
            <span class="text-6xl">{enemy.sprite}</span>
            {enemyBlock > 0 && (
              <div class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full border border-blue-400 shadow-md">
                🛡️ {enemyBlock}
              </div>
            )}

            {/* Slay the Spire intent icon indicator above monster */}
            <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 border border-red-900/60 rounded-lg px-2 py-1 text-xs text-red-400 flex items-center gap-1 shadow-xl whitespace-nowrap animate-pulse">
              ⚔️ Absicht: {enemyIntent.type === 'attack' ? `Angriff (${enemyIntent.value})` : `Taktik (${enemyIntent.value})`}
            </div>
          </div>
          
          <h3 class="font-bold text-lg text-red-400 mb-1">{enemy.name}</h3>
          
          {/* Enemy Health Bar */}
          <div class="w-full max-w-xs bg-slate-950 rounded-full h-4 border border-slate-800 overflow-hidden relative shadow-inner">
            <div 
              class="bg-gradient-to-r from-red-700 to-red-500 h-full transition-all duration-300"
              style={{ width: `${(enemyHp / enemy.maxHp) * 100}%` }}
            ></div>
            <span class="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold">
              {enemyHp} / {enemy.maxHp} HP
            </span>
          </div>

          {enemyBurn > 0 && (
            <div class="mt-2 text-xs font-bold text-orange-400 bg-orange-950/50 px-2 py-0.5 rounded border border-orange-900 animate-pulse">
              🔥 Brennt: {enemyBurn} Runden
            </div>
          )}
        </div>
      </div>

      {/* Action Combat Event Logs */}
      <div class="w-full max-w-xl mx-auto bg-slate-950/90 border border-slate-800/80 p-2 rounded-lg my-2 text-center text-xs font-mono text-slate-400 min-h-[64px] flex flex-col justify-center">
        {log.map((l, i) => (
          <div key={i} class={i === log.length - 1 ? "text-amber-400 font-semibold scale-102" : ""}>{l}</div>
        ))}
      </div>

      {/* Bottom Bar: Cards in Hand & Mana Counter */}
      <div class="w-full max-w-4xl mx-auto flex flex-col items-center gap-4 mt-auto">
        
        {/* Mana Circle and End Turn Button */}
        <div class="w-full flex justify-between items-center px-4">
          <div class="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 border-2 border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse">
            <Zap size={16} class="text-cyan-200" fill="currentColor" />
            <span class="text-sm font-black font-mono">{playerEnergy} / {character.maxEnergy}</span>
          </div>
          
          <button
            onClick={endTurn}
            class="bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 border border-orange-500 text-white font-bold px-6 py-2 rounded-xl text-sm tracking-wide shadow transition flex items-center gap-2"
          >
            Zug Beenden <RefreshCw size={14} />
          </button>
        </div>

        {/* Dynamic Interactive Hand Component */}
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pb-2">
          {hand.map((card, idx) => {
            const canPlay = playerEnergy >= card.cost;
            return (
              <div
                key={card.uniqId}
                onClick={() => canPlay && playCard(card, idx)}
                class={`border-2 rounded-xl p-3 flex flex-col justify-between min-h-[140px] cursor-pointer transition-all duration-300 transform hover:-translate-y-3 hover:shadow-2xl relative select-none ${card.color} ${
                  canPlay ? 'border-amber-500 shadow-md scale-100 opacity-100' : 'border-slate-800 opacity-50 scale-95 cursor-not-allowed'
                }`}
              >
                {/* Top layout */}
                <div class="flex justify-between items-center mb-1">
                  <span class="text-[10px] uppercase font-mono font-bold tracking-wider opacity-70 px-1 py-0.2 bg-black/40 rounded">
                    {card.type}
                  </span>
                  <span class="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center justify-center font-bold text-xs">
                    {card.cost}
                  </span>
                </div>

                {/* Body / Graphic Symbol */}
                <div class="text-center font-bold text-sm text-slate-100 my-1 py-1 bg-black/20 rounded">
                  {card.name}
                </div>

                {/* Subtext description rules */}
                <p class="text-[11px] text-slate-300 leading-tight text-center">
                  {card.desc}
                </p>

                {/* Hover trigger light highlight aura */}
                {canPlay && <div class="absolute inset-0 rounded-xl bg-amber-500/5 hover:bg-transparent pointer-events-none"></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}