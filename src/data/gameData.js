export const CHARACTERS = [
  {
    id: 'normal', name: 'Normaler Fuchs', title: 'Der Abenteurer', unlocked: true, unlockCondition: 'Von Anfang an freigeschaltet', ascensionLevel: 0, hp: 80, maxHp: 80, energy: 3, maxEnergy: 3, color: 'from-orange-500 to-amber-600', borderColor: 'border-orange-500', bgLight: 'bg-orange-950/40', textColor: 'text-orange-400', description: 'Ein ausgeglichener Fuchs, der auf solide Angriffe und zuverlässige Verteidigung setzt.', ability: { name: 'Fuchsschwanz-Konter', desc: 'Jedes Mal, wenn Block verloren wird, füge dem Angreifer 2 Schaden zu.' }, startingDeck: ['strike', 'strike', 'strike', 'defend', 'defend', 'tail_swipe']
  },
  {
    id: 'fire', name: 'Feuer-Fuchs', title: 'Die lebende Flamme', unlocked: false, unlockCondition: 'Gewinne 1 Run mit dem Normalen Fuchs', ascensionLevel: 0, hp: 70, maxHp: 70, energy: 3, maxEnergy: 3, color: 'from-red-600 to-orange-600', borderColor: 'border-red-500', bgLight: 'bg-red-950/40', textColor: 'text-red-400', description: 'Verbrennt die Gegner mit kontinuierlichem Brandschaden.', ability: { name: 'Hitzewelle', desc: 'Füge zu Beginn jedes Kampfes allen Gegnern 3 Brand zu.' }, startingDeck: ['strike', 'strike', 'ember', 'defend', 'defend', 'pyro_blast']
  }
];

export const ARTIFACTS = {
  // Normale Artefakte (15)
  stone_fox_idol: { id: 'stone_fox_idol', name: 'Steinerner Schrein', desc: '+1 Energie in jedem Zug.', iconName: 'Zap', effect: { type: 'energy', value: 1 } },
  cyber_core: { id: 'cyber_core', name: 'Kybernetischer Kern', desc: 'Jede Runde wird 1 zusätzliche Karte gezogen.', iconName: 'Cpu', effect: { type: 'draw', value: 1 } },
  sacred_flame: { id: 'sacred_flame', name: 'Heilige Flamme', desc: 'Angriffskarten verursachen +2 Brandschaden.', iconName: 'Sun', effect: { type: 'burn_bonus', value: 2 } },
  golden_acorn: { id: 'golden_acorn', name: 'Goldene Eichel', desc: 'Belohnungen bringen mehr Gold.', iconName: 'Coins', effect: { type: 'gold_bonus', value: 1.2 } },
  rusty_sword: { id: 'rusty_sword', name: 'Rostiges Schwert', desc: 'Jeder Angriff verursacht +2 Schaden.', iconName: 'Swords', effect: { type: 'attack_bonus', value: 2 } },
  thick_fur: { id: 'thick_fur', name: 'Dickes Fell', desc: 'Gibt zu Beginn jedes Zuges +3 Block.', iconName: 'Shield', effect: { type: 'turn_block', value: 3 } },
  vampire_fang: { id: 'vampire_fang', name: 'Vampirzahn', desc: 'Heilt 2 HP nach jedem gewonnenen Kampf.', iconName: 'Heart', effect: { type: 'heal_combat', value: 2 } },
  swift_boots: { id: 'swift_boots', name: 'Flinke Stiefel', desc: 'Im allerersten Zug eines Kampfes gibt es +2 Energie.', iconName: 'Zap', effect: { type: 'first_turn_energy', value: 2 } },
  ancient_coin: { id: 'ancient_coin', name: 'Uralte Münze', desc: 'Alle Karten im Shop sind billiger.', iconName: 'Coins', effect: { type: 'discount', value: 0.8 } },
  toxic_gland: { id: 'toxic_gland', name: 'Giftsekret', desc: 'Jeder Angriff vergiftet den Gegner (1 Gift).', iconName: 'Moon', effect: { type: 'poison_attacks', value: 1 } },
  regeneration_ring: { id: 'regeneration_ring', name: 'Regenerationsring', desc: 'Heilt 1 HP zu Beginn jedes eigenen Zuges.', iconName: 'Heart', effect: { type: 'turn_heal', value: 1 } },
  iron_tail: { id: 'iron_tail', name: 'Eisenschweif', desc: 'Schwanz-Angriffe machen +4 Schaden.', iconName: 'Swords', effect: { type: 'tail_bonus', value: 4 } },
  magic_pouch: { id: 'magic_pouch', name: 'Magischer Beutel', desc: 'Man startet jeden Kampf mit 10 Rüstung.', iconName: 'Package', effect: { type: 'start_block', value: 10 } },
  lava_scale: { id: 'lava_scale', name: 'Lavaschuppe', desc: 'Gegner erhalten jede Runde 2 Brand.', iconName: 'Flame', effect: { type: 'turn_start_burn', value: 2 } },
  shadow_charm: { id: 'shadow_charm', name: 'Schattenamulett', desc: 'Gegner starten Kämpfe mit Schwäche.', iconName: 'Eye', effect: { type: 'enemy_weak', value: 2 } },
  
  // Boss Artefakte (6)
  boss_energy_core: { id: 'boss_energy_core', name: 'Leuchtender Golem-Kern', desc: '+1 Basis-Energie für den Rest des Runs!', iconName: 'Zap', isBoss: true, effect: { type: 'base_energy_up', value: 1 } },
  boss_dragon_scale: { id: 'boss_dragon_scale', name: 'Drachenschuppe', desc: 'Startet JEDEN Kampf sofort mit 15 Block.', iconName: 'Shield', isBoss: true, effect: { type: 'start_block', value: 15 } },
  boss_heart_fragment: { id: 'boss_heart_fragment', name: 'Herzfragment', desc: 'Erhöht die maximalen HP sofort um 20.', iconName: 'Heart', isBoss: true, effect: { type: 'max_hp_up', value: 20 } },
  boss_cursed_bell: { id: 'boss_cursed_bell', name: 'Verfluchte Glocke', desc: '+2 Karten pro Zug, aber Gegner machen +2 Schaden.', iconName: 'Eye', isBoss: true, effect: { type: 'double_edged', value: 1 } },
  boss_void_cloak: { id: 'boss_void_cloak', name: 'Leerenumhang', desc: 'Vollständige Heilung nach Bosskämpfen.', iconName: 'Moon', isBoss: true, effect: { type: 'boss_heal', value: 1 } },
  boss_golden_crown: { id: 'boss_golden_crown', name: 'Goldene Krone', desc: 'Man startet Kämpfe mit doppelter Energie, danach normal.', iconName: 'Sun', isBoss: true, effect: { type: 'burst_start', value: 1 } }
};

export const EVENTS = [
  { title: 'Die verfluchte Klinge', text: 'Ein schwarz leuchtendes Schwert verlangt nach Blut.', options: [ { text: 'Blut opfern (-15 HP, Erhalte mächtige Karte)', action: (api) => { api.hurt(15); api.addCard('tail_swipe'); } }, { text: 'Ignorieren', action: () => {} } ] },
  { title: 'Der verrückte Bettler', text: '"Gib mir Gold, und das Schicksal wird lächeln!"', options: [ { text: '50 Gold geben (Zufälliges Artefakt)', action: (api) => { if(api.gold >= 50) { api.spend(50); api.giveRandomArtifact(); } } }, { text: 'Wegtreten (-5 HP)', action: (api) => api.hurt(5) } ] },
  { title: 'Vergessener Schrein', text: 'Ein uralter, leuchtender Schrein.', options: [ { text: 'Beten (Heile 30 HP)', action: (api) => api.heal(30) }, { text: 'Plündern (+80 Gold, 50% Chance auf -10 HP)', action: (api) => { api.gainGold(80); if(Math.random() < 0.5) api.hurt(10); } } ] }
];

export const CARDS = {
  strike: { id: 'strike', name: 'Prankenhieb', cost: 1, type: 'Angriff', damage: 6, desc: 'Füge 6 Schaden zu.', color: 'border-amber-700 bg-amber-950/50' },
  defend: { id: 'defend', name: 'Einigeln', cost: 1, type: 'Verteidigung', block: 5, desc: 'Erhalte 5 Block.', color: 'border-blue-700 bg-blue-950/50' },
  tail_swipe: { id: 'tail_swipe', name: 'Schwanzfeger', cost: 2, type: 'Angriff', damage: 10, block: 4, desc: 'Füge 10 Schaden zu. Erhalte 4 Block.', color: 'border-orange-700 bg-orange-950/50' },
  ember: { id: 'ember', name: 'Funkenflug', cost: 1, type: 'Angriff', damage: 4, burn: 3, desc: 'Füge 4 Schaden zu. Verursacht 3 Brand.', color: 'border-red-700 bg-red-950/50' },
  pyro_blast: { id: 'pyro_blast', name: 'Pyroschlag', cost: 2, type: 'Angriff', damage: 14, desc: 'Füge 14 Schaden zu. +2 Schaden pro brennendem Gegner.', color: 'border-red-600 bg-red-950/60' }
};

export const ENEMIES = [
  { id: 'slime', act: 1, type: 'Normal', name: 'Wald-Schleim', hp: 32, intentValue: 6, sprite: '🧪' },
  { id: 'goblin', act: 1, type: 'Normal', name: 'Kobold', hp: 45, intentValue: 5, sprite: '👺' },
  { id: 'wolf', act: 1, type: 'Elite', name: 'Schattenwolf', hp: 65, intentValue: 12, sprite: '🐺' },
  { id: 'boss_golem', act: 1, type: 'Boss', name: 'Uralter Steingolem', hp: 130, intentValue: 15, sprite: '🗿' },
  { id: 'boss_spider', act: 1, type: 'Boss', name: 'Weberin', hp: 105, intentValue: 12, sprite: '🕷️' },
  
  { id: 'cultist', act: 2, type: 'Normal', name: 'Krähen-Kultist', hp: 55, intentValue: 8, sprite: '🐦‍⬛' },
  { id: 'mimic', act: 2, type: 'Normal', name: 'Gieriger Mimic', hp: 60, intentValue: 10, sprite: '📦' },
  { id: 'knight', act: 2, type: 'Elite', name: 'Verfluchter Ritter', hp: 100, intentValue: 14, sprite: '🛡️' },
  { id: 'boss_dragon', act: 2, type: 'Boss', name: 'Junger Aschendrache', hp: 200, intentValue: 18, sprite: '🐉' },
  
  { id: 'void_walker', act: 3, type: 'Normal', name: 'Leerenwandler', hp: 80, intentValue: 15, sprite: '🌌' },
  { id: 'behemoth', act: 3, type: 'Elite', name: 'Magma-Behemoth', hp: 150, intentValue: 22, sprite: '🌋' },
  { id: 'boss_time', act: 3, type: 'Boss', name: 'Zeitfresser', hp: 350, intentValue: 25, sprite: '⏳' }
];

export const MAP_NODES = [
  { id: 1, type: 'Kampf', label: 'Weg', tier: 0, connectedTo: [5, 6] },
  { id: 2, type: 'Kampf', label: 'Weg', tier: 0, connectedTo: [6, 7] },
  { id: 3, type: 'Kampf', label: 'Ruine', tier: 0, connectedTo: [7, 8] },
  { id: 4, type: 'Kampf', label: 'Fels', tier: 0, connectedTo: [8] },
  { id: 5, type: 'Kampf', label: 'Kampf', tier: 1, connectedTo: [9, 10] },
  { id: 6, type: 'Ereignis', label: 'Event', tier: 1, connectedTo: [10, 11] },
  { id: 7, type: 'Lagerfeuer', label: 'Rast', tier: 1, connectedTo: [11, 12] },
  { id: 8, type: 'Kampf', label: 'Kampf', tier: 1, connectedTo: [12] },
  { id: 9, type: 'Schatztruhe', label: 'Truhe', tier: 2, connectedTo: [13] },
  { id: 10, type: 'Elite', label: 'Elite', tier: 2, connectedTo: [13, 14] },
  { id: 11, type: 'Shop', label: 'Shop', tier: 2, connectedTo: [14, 15] },
  { id: 12, type: 'Kampf', label: 'Kampf', tier: 2, connectedTo: [15, 16] },
  { id: 13, type: 'Ereignis', label: 'Event', tier: 3, connectedTo: [17, 18] },
  { id: 14, type: 'Lagerfeuer', label: 'Rast', tier: 3, connectedTo: [18] },
  { id: 15, type: 'Kampf', label: 'Kampf', tier: 3, connectedTo: [18, 19] },
  { id: 16, type: 'Elite', label: 'Elite', tier: 3, connectedTo: [19] },
  { id: 17, type: 'Schatztruhe', label: 'Truhe', tier: 4, connectedTo: [20, 21] },
  { id: 18, type: 'Shop', label: 'Shop', tier: 4, connectedTo: [21, 22] },
  { id: 19, type: 'Kampf', label: 'Kampf', tier: 4, connectedTo: [22, 23] },
  { id: 20, type: 'Elite', label: 'Elite', tier: 5, connectedTo: [24] },
  { id: 21, type: 'Kampf', label: 'Kampf', tier: 5, connectedTo: [24, 25] },
  { id: 22, type: 'Ereignis', label: 'Event', tier: 5, connectedTo: [25, 26] },
  { id: 23, type: 'Lagerfeuer', label: 'Rast', tier: 5, connectedTo: [26] },
  { id: 24, type: 'Kampf', label: 'Kampf', tier: 6, connectedTo: [27, 28] },
  { id: 25, type: 'Schatztruhe', label: 'Truhe', tier: 6, connectedTo: [28] },
  { id: 26, type: 'Kampf', label: 'Kampf', tier: 6, connectedTo: [28, 29] },
  { id: 27, type: 'Ereignis', label: 'Event', tier: 7, connectedTo: [30] },
  { id: 28, type: 'Elite', label: 'Elite', tier: 7, connectedTo: [30, 31] },
  { id: 29, type: 'Shop', label: 'Shop', tier: 7, connectedTo: [31] },
  { id: 30, type: 'Lagerfeuer', label: 'Rast', tier: 8, connectedTo: [32] },
  { id: 31, type: 'Lagerfeuer', label: 'Rast', tier: 8, connectedTo: [32] },
  { id: 32, type: 'Boss', label: 'Boss', tier: 9, connectedTo: [] }
];
