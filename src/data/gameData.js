export const CHARACTERS = [
  {
    id: 'normal', name: 'Normaler Fuchs', title: 'Der Abenteurer', unlocked: true, unlockCondition: 'Von Anfang an freigeschaltet', ascensionLevel: 0, hp: 80, maxHp: 80, energy: 3, maxEnergy: 3, color: 'from-orange-500 to-amber-600', borderColor: 'border-orange-500', bgLight: 'bg-orange-950/40', textColor: 'text-orange-400', description: 'Ein ausgeglichener Fuchs, der auf solide Angriffe und zuverlässige Verteidigung setzt.', ability: { name: 'Fuchsschwanz-Konter', desc: 'Jedes Mal, wenn Block verloren wird, füge dem Angreifer 2 Schaden zu.' }, startingDeck: ['strike', 'strike', 'strike', 'defend', 'defend', 'tail_swipe']
  },
  {
    id: 'fire', name: 'Feuer-Fuchs', title: 'Die lebende Flamme', unlocked: false, unlockCondition: 'Gewinne 1 Run mit dem Normalen Fuchs', ascensionLevel: 0, hp: 70, maxHp: 70, energy: 3, maxEnergy: 3, color: 'from-red-600 to-orange-600', borderColor: 'border-red-500', bgLight: 'bg-red-950/40', textColor: 'text-red-400', description: 'Verbrennt die Gegner mit kontinuierlichem Brandschaden (Burn).', ability: { name: 'Hitzewelle', desc: 'Füge zu Beginn jedes Kampfes allen Gegnern 3 Brand zu.' }, startingDeck: ['strike', 'strike', 'ember', 'defend', 'defend', 'pyro_blast']
  }
];

export const ARTIFACTS = {
  stone_fox_idol: { id: 'stone_fox_idol', name: 'Steinerner Fuchsschrein', desc: 'Jeder Kampf startet mit 1 zusätzlichem Energie (+1 Mana dauerhaft in jedem Zug).', iconName: 'Zap', effect: { type: 'energy', value: 1 } },
  shadow_charm: { id: 'shadow_charm', name: 'Schattenamulett', desc: 'Gegner starten jeden Kampf mit 2 Schwäche.', iconName: 'Moon', effect: { type: 'enemy_weak', value: 2 } },
  lava_scale: { id: 'lava_scale', name: 'Lavaschuppe', desc: 'Zu Beginn des Zuges erhält ein zufälliger Gegner 2 Brand.', iconName: 'Flame', effect: { type: 'turn_start_burn', value: 2 } },
  cyber_core: { id: 'cyber_core', name: 'Kybernetischer Kern', desc: 'Du ziehst jede Runde 1 Karte extra.', iconName: 'Cpu', effect: { type: 'draw', value: 1 } },
  sacred_flame: { id: 'sacred_flame', name: 'Heilige Flamme', desc: 'Angriffskarten verursachen +2 Brandschaden.', iconName: 'Sun', effect: { type: 'burn_bonus', value: 2 } },
  golden_acorn: { id: 'golden_acorn', name: 'Goldene Eichel', desc: 'Du startest sofort mit 100 Bonus-Gold.', iconName: 'Coins', effect: { type: 'gold_instant', value: 100 } },
  boss_energy_core: { id: 'boss_energy_core', name: 'Leuchtender Golem-Kern', desc: '+1 Basis-Energie für den Rest des Runs!', iconName: 'Zap', isBoss: true, effect: { type: 'base_energy_up', value: 1 } },
  boss_dragon_scale: { id: 'boss_dragon_scale', name: 'Drachenschuppe', desc: 'Startet JEDEN Kampf sofort mit 12 Block.', iconName: 'Shield', isBoss: true, effect: { type: 'start_block', value: 12 } }
};

export const EVENTS = [
  { title: 'Die verfluchte Klinge', text: 'Vor dir im Dreck steckt ein schwarz leuchtendes Schwert. Es flüstert deinen Namen und verlangt Blut.', options: [ { text: 'Blut opfern (-15 HP, Erhalte "Schwanzfeger" Karte)', action: (state) => { state.hurt(15); state.addCard('tail_swipe'); } }, { text: 'Ignorieren', action: () => {} } ] },
  { title: 'Der verrückte Bettler', text: 'Ein zerlumpter Fuchs hält dir die Hand hin. "Gib mir Gold, und das Schicksal wird dir lächeln!"', options: [ { text: '50 Gold geben (Erhalte zufälliges Artefakt)', action: (state) => { if(state.gold >= 50) { state.spend(50); state.giveRandomArtifact(); } } }, { text: 'Wegtreten (-5 HP aus Scham)', action: (state) => state.hurt(5) } ] },
  { title: 'Giftige Sporen', text: 'Du betrittst ein Feld mit purpurnen Pilzen. Sie platzen auf und versprühen giftigen Staub!', options: [ { text: 'Durchrennen (-10 HP)', action: (state) => state.hurt(10) }, { text: 'Vorsichtig atmen (Verliere 30 Gold, kein HP-Verlust)', action: (state) => state.spend(30) } ] },
  { title: 'Vergessener Schrein', text: 'Ein leuchtender Schrein. Er ist uralt.', options: [ { text: 'Beten (Heile 30 HP)', action: (state) => state.heal(30) }, { text: 'Plündern (+80 Gold, 50% Chance auf -10 HP)', action: (state) => { state.gainGold(80); if(Math.random() < 0.5) state.hurt(10); } } ] }
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
  { id: 'boss_spider', act: 1, type: 'Boss', name: 'Weberin', hp: 105, intentValue: 12, sprite: '🕷️' }
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
