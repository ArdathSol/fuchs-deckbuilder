export const CHARACTERS = [
  {
    id: 'normal',
    name: 'Normaler Fuchs',
    title: 'Der Abenteurer',
    unlocked: true,
    unlockCondition: 'Von Anfang an freigeschaltet',
    hp: 80,
    maxHp: 80,
    energy: 3,
    maxEnergy: 3,
    color: 'from-orange-500 to-amber-600',
    borderColor: 'border-orange-500',
    bgLight: 'bg-orange-950/40',
    textColor: 'text-orange-400',
    description: 'Ein ausgeglichener Fuchs, der auf solide Angriffe und zuverlässige Verteidigung setzt.',
    ability: { name: 'Fuchsschwanz-Konter', desc: 'Jedes Mal, wenn du Block verlierst, füge dem Angreifer 2 Schaden zu.' },
    startingDeck: ['strike', 'strike', 'strike', 'defend', 'defend', 'tail_swipe']
  },
  {
    id: 'fire',
    name: 'Feuer-Fuchs',
    title: 'Die lebende Flamme',
    unlocked: false,
    unlockCondition: 'Gewinne 1 Run mit dem Normalen Fuchs',
    hp: 70,
    maxHp: 70,
    energy: 3,
    maxEnergy: 3,
    color: 'from-red-600 to-orange-600',
    borderColor: 'border-red-500',
    bgLight: 'bg-red-950/40',
    textColor: 'text-red-400',
    description: 'Verbrennt seine Gegner mit kontinuierlichem Brandschaden (Burn) und opfert manchmal eigene Verteidigung für pure Kraft.',
    ability: { name: 'Hitzewelle', desc: 'Füge zu Beginn jedes Kampfes allen Gegnern 3 Brand zu.' },
    startingDeck: ['strike', 'strike', 'ember', 'defend', 'defend', 'pyro_blast']
  },
  {
    id: 'cyber',
    name: 'Cyber-Fuchs',
    title: 'Techno-Infiltrator',
    unlocked: false,
    unlockCondition: 'Füge in einem einzigen Kampf 50+ Schaden zu',
    hp: 90,
    maxHp: 90,
    energy: 4,
    maxEnergy: 4,
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500',
    bgLight: 'bg-cyan-950/40',
    textColor: 'text-cyan-400',
    description: 'Nutzt fortschrittliche Schilde, Energie-Manipulation und Drohnen-Angriffe für taktische Überlegenheit.',
    ability: { name: 'Überladen', desc: 'Starte jeden Kampf mit 1 zusätzlichen Energie, verliere aber im 3. Zug 5 HP.' },
    startingDeck: ['strike', 'defend', 'defend', 'plasma_shield', 'laser_beam', 'overclock']
  },
  {
    id: 'shadow',
    name: 'Schatten-Fuchs',
    title: 'Avatar der Nacht',
    unlocked: false,
    unlockCondition: 'Besiege einen Elite-Gegner ohne Schaden zu nehmen',
    hp: 65,
    maxHp: 65,
    energy: 3,
    maxEnergy: 3,
    color: 'from-purple-600 to-indigo-950',
    borderColor: 'border-purple-500',
    bgLight: 'bg-purple-950/40',
    textColor: 'text-purple-400',
    description: 'Manipuliert Flüche, entzieht Gegnern Lebenskraft und agiert aus den Schatten heraus mit kritischen Multiplikatoren.',
    ability: { name: 'Seelenraub', desc: 'Wenn ein Gegner stirbt, heile dich um 4 HP.' },
    startingDeck: ['strike', 'strike', 'shadow_stab', 'defend', 'curse_bolt', 'phantom_veil']
  }
];

export const CARDS = {
  strike: { id: 'strike', name: 'Prankenhieb', cost: 1, type: 'Angriff', rarity: 'Basis', damage: 6, block: 0, desc: 'Füge einem Gegner 6 Schaden zu.', color: 'border-amber-700 bg-amber-950/50' },
  defend: { id: 'defend', name: 'Einigeln', cost: 1, type: 'Verteidigung', damage: 0, block: 5, desc: 'Erhalte 5 Block.', color: 'border-blue-700 bg-blue-950/50' },
  tail_swipe: { id: 'tail_swipe', name: 'Schwanzfeger', cost: 2, type: 'Angriff', damage: 10, block: 4, desc: 'Füge 10 Schaden zu. Erhalte 4 Block.', color: 'border-orange-700 bg-orange-950/50' },
  
  // Fire Cards
  ember: { id: 'ember', name: 'Funkenflug', cost: 1, type: 'Angriff', damage: 4, burn: 3, desc: 'Füge 4 Schaden zu. Verursacht 3 Brand (Gegner verliert jede Runde Leben).', color: 'border-red-700 bg-red-950/50' },
  pyro_blast: { id: 'pyro_blast', name: 'Pyroschlag', cost: 2, type: 'Angriff', damage: 14, desc: 'Füge 14 Schaden zu. Erhöht sich um 2 für jeden brennenden Gegner.', color: 'border-red-600 bg-red-950/60' },
  
  // Cyber Cards
  plasma_shield: { id: 'plasma_shield', name: 'Plasmaschild', cost: 1, type: 'Verteidigung', damage: 0, block: 8, desc: 'Erhalte 8 Block. Nächste Karte kostet 0.', color: 'border-cyan-700 bg-cyan-950/50' },
  laser_beam: { id: 'laser_beam', name: 'Laserstrahl', cost: 2, type: 'Angriff', damage: 12, desc: 'Füge 12 Schaden zu. Ziehe 1 Karte.', color: 'border-cyan-600 bg-cyan-950/60' },
  overclock: { id: 'overclock', name: 'Übertakten', cost: 0, type: 'Fähigkeit', damage: 0, block: 0, desc: 'Erhalte 2 Energie. Verliere am Ende des Zuges 3 HP.', color: 'border-emerald-700 bg-emerald-950/50' },
  
  // Shadow Cards
  shadow_stab: { id: 'shadow_stab', name: 'Schattendolch', cost: 1, type: 'Angriff', damage: 8, desc: 'Füge 8 Schaden zu. Ignoriert die Hälfte des gegnerischen Blocks.', color: 'border-purple-700 bg-purple-950/50' },
  curse_bolt: { id: 'curse_bolt', name: 'Fluchprojektil', cost: 1, type: 'Fähigkeit', damage: 0, desc: 'Gegner verursacht nächste Runde 25% weniger Schaden.', color: 'border-purple-600 bg-purple-950/60' },
  phantom_veil: { id: 'phantom_veil', name: 'Phantomschleier', cost: 2, type: 'Verteidigung', damage: 0, block: 12, desc: 'Erhalte 12 Block. Mische eine Schatten-Kopie in den Ablagestapel.', color: 'border-indigo-700 bg-indigo-950/50' }
};

export const ENEMIES = [
  { id: 'slime', name: 'Wald-Schleim', hp: 32, maxHp: 32, type: 'Normal', intent: 'attack', intentValue: 6, desc: 'Wabbelt aggressiv.', sprite: '🧪' },
  { id: 'goblin', name: 'Diebischer Kobold', hp: 45, maxHp: 45, type: 'Normal', intent: 'defend_attack', intentValue: 5, block: 4, desc: 'Plant einen fiesen Konter.', sprite: '👺' },
  { id: 'wolf', name: 'Schattenwolf', hp: 58, maxHp: 58, type: 'Elite', intent: 'attack', intentValue: 12, desc: 'Knurrt hasserfüllt.', sprite: '🐺' },
  { id: 'golem', name: 'Uralter Steingolem', hp: 120, maxHp: 120, type: 'Boss', intent: 'buff_attack', intentValue: 15, desc: 'Lädt einen vernichtenden Schlag auf.', sprite: '🗿' }
];

export const MAP_NODES = [
  { id: 1, type: 'Kampf', label: 'Einsamer Pfad', tier: 0, connectedTo: [4, 5] },
  { id: 2, type: 'Kampf', label: 'Dunkles Dickicht', tier: 0, connectedTo: [5, 6] },
  { id: 3, type: 'Ereignis', label: 'Mysteriöser Fuchsbau', tier: 0, connectedTo: [6] },
  
  { id: 4, type: 'Shop', label: 'Wandernder Händler', tier: 1, connectedTo: [7, 8] },
  { id: 5, type: 'Elite', label: 'Revier des Schattenwolfs', tier: 1, connectedTo: [8, 9] },
  { id: 6, type: 'Lagerfeuer', label: 'Sichere Lichtung', tier: 1, connectedTo: [9] },
  
  { id: 7, type: 'Kampf', label: 'Ruinen-Eingang', tier: 2, connectedTo: [10] },
  { id: 8, type: 'Lagerfeuer', label: 'Letzte Rast', tier: 2, connectedTo: [10] },
  { id: 9, type: 'Shop', label: 'Geheimnisvoller Schrein', tier: 2, connectedTo: [10] },
  
  { id: 10, type: 'Boss', label: 'Thron des Steingolems', tier: 3, connectedTo: [] }
];
