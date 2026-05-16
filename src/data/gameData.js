export const CHARACTERS = [
  {
    id: 'normal',
    name: 'Normaler Fuchs',
    title: 'Der Abenteurer',
    unlocked: true,
    unlockCondition: 'Von Anfang an freigeschaltet',
    ascensionLevel: 0, // Neues Meta-Progressions-System
    hp: 80,
    maxHp: 80,
    energy: 3,
    maxEnergy: 3,
    color: 'from-orange-500 to-amber-600',
    borderColor: 'border-orange-500',
    bgLight: 'bg-orange-950/40',
    textColor: 'text-orange-400',
    description: 'Ein ausgeglichener Fuchs, der auf solide Angriffe und zuverlässige Verteidigung setzt.',
    ability: { name: 'Fuchsschwanz-Konter', desc: 'Jedes Mal, wenn Block verloren wird, füge dem Angreifer 2 Schaden zu.' },
    startingDeck: ['strike', 'strike', 'strike', 'defend', 'defend', 'tail_swipe']
  },
  {
    id: 'fire',
    name: 'Feuer-Fuchs',
    title: 'Die lebende Flamme',
    unlocked: false,
    unlockCondition: 'Gewinne 1 Run mit dem Normalen Fuchs',
    ascensionLevel: 0,
    hp: 70,
    maxHp: 70,
    energy: 3,
    maxEnergy: 3,
    color: 'from-red-600 to-orange-600',
    borderColor: 'border-red-500',
    bgLight: 'bg-red-950/40',
    textColor: 'text-red-400',
    description: 'Verbrennt die Gegner mit kontinuierlichem Brandschaden (Burn).',
    ability: { name: 'Hitzewelle', desc: 'Füge zu Beginn jedes Kampfes allen Gegnern 3 Brand zu.' },
    startingDeck: ['strike', 'strike', 'ember', 'defend', 'defend', 'pyro_blast']
  }
];

export const ARTIFACTS = {
  stone_fox_idol: { id: 'stone_fox_idol', name: 'Steinerner Fuchsschrein', desc: 'Jeder Kampf startet mit 1 zusätzlichem Energie.', effect: { type: 'energy', value: 1 } },
  shadow_charm: { id: 'shadow_charm', name: 'Schattenamulett', desc: 'Gegner starten jeden Kampf mit 2 Schwäche.', effect: { type: 'enemy_weak', value: 2 } },
  lava_scale: { id: 'lava_scale', name: 'Lavaschuppe', desc: 'Zu Beginn des Zuges erhält ein zufälliger Gegner 2 Brand.', effect: { type: 'turn_start_burn', value: 2 } },
  cyber_core: { id: 'cyber_core', name: 'Kybernetischer Kern', desc: 'Zu Beginn des Zuges wird 1 zusätzliche Karte gezogen.', effect: { type: 'draw', value: 1 } },
  sacred_flame: { id: 'sacred_flame', name: 'Heilige Flamme', desc: 'Angriffskarten verursachen +2 Brandschaden.', effect: { type: 'burn_bonus', value: 2 } }
};

export const CARDS = {
  strike: { id: 'strike', name: 'Prankenhieb', cost: 1, type: 'Angriff', damage: 6, desc: 'Füge einem Gegner 6 Schaden zu.', color: 'border-amber-700 bg-amber-950/50' },
  defend: { id: 'defend', name: 'Einigeln', cost: 1, type: 'Verteidigung', block: 5, desc: 'Erhalte 5 Block.', color: 'border-blue-700 bg-blue-950/50' },
  tail_swipe: { id: 'tail_swipe', name: 'Schwanzfeger', cost: 2, type: 'Angriff', damage: 10, block: 4, desc: 'Füge 10 Schaden zu. Erhalte 4 Block.', color: 'border-orange-700 bg-orange-950/50' },
  ember: { id: 'ember', name: 'Funkenflug', cost: 1, type: 'Angriff', damage: 4, burn: 3, desc: 'Füge 4 Schaden zu. Verursacht 3 Brand.', color: 'border-red-700 bg-red-950/50' },
  pyro_blast: { id: 'pyro_blast', name: 'Pyroschlag', cost: 2, type: 'Angriff', damage: 14, desc: 'Füge 14 Schaden zu. +2 Schaden pro brennendem Gegner.', color: 'border-red-600 bg-red-950/60' }
};

export const ENEMIES = [
  { id: 'slime', name: 'Wald-Schleim', hp: 32, type: 'Normal', intentValue: 6, sprite: '🧪' },
  { id: 'goblin', name: 'Diebischer Kobold', hp: 45, type: 'Normal', intentValue: 5, sprite: '👺' },
  { id: 'wolf', name: 'Schattenwolf', hp: 58, type: 'Elite', intentValue: 12, sprite: '🐺' },
  { id: 'golem', name: 'Uralter Steingolem', hp: 120, type: 'Boss', intentValue: 15, sprite: '🗿' }
];

// 10 Ebenen (Tiers 0 bis 9). Sauber verknüpft, um Sackgassen zu vermeiden.
export const MAP_NODES = [
  // Tier 0
  { id: 1, type: 'Kampf', label: 'Vergessener Pfad', tier: 0, connectedTo: [5, 6] },
  { id: 2, type: 'Kampf', label: 'Einsames Dickicht', tier: 0, connectedTo: [6, 7] },
  { id: 3, type: 'Kampf', label: 'Alte Ruine', tier: 0, connectedTo: [7, 8] },
  { id: 4, type: 'Kampf', label: 'Finsterer Fels', tier: 0, connectedTo: [8] },
  
  // Tier 1
  { id: 5, type: 'Kampf', label: 'Ruinen-Lichtung', tier: 1, connectedTo: [9, 10] },
  { id: 6, type: 'Ereignis', label: 'Mysteriöser Schrein', tier: 1, connectedTo: [10, 11] },
  { id: 7, type: 'Lagerfeuer', label: 'Sichere Lichtung', tier: 1, connectedTo: [11, 12] },
  { id: 8, type: 'Kampf', label: 'Schlucht-Eingang', tier: 1, connectedTo: [12] },
  
  // Tier 2
  { id: 9, type: 'Schatztruhe', label: 'Gefundener Schatz', tier: 2, connectedTo: [13] },
  { id: 10, type: 'Elite', label: 'Revier des Schattenwolfs', tier: 2, connectedTo: [13, 14] },
  { id: 11, type: 'Shop', label: 'Fuchshändler-Wagen', tier: 2, connectedTo: [14, 15] },
  { id: 12, type: 'Kampf', label: 'Steinerne Brücke', tier: 2, connectedTo: [15, 16] },
  
  // Tier 3
  { id: 13, type: 'Ereignis', label: 'Verlorene Erinnerung', tier: 3, connectedTo: [17, 18] },
  { id: 14, type: 'Lagerfeuer', label: 'Geheimnisvoller Fuchsbau', tier: 3, connectedTo: [18] },
  { id: 15, type: 'Kampf', label: 'Ruinen-Marktplatz', tier: 3, connectedTo: [18, 19] },
  { id: 16, type: 'Elite', label: 'Groll der Golems', tier: 3, connectedTo: [19] },
  
  // Tier 4
  { id: 17, type: 'Schatztruhe', label: 'Gefallene Beute', tier: 4, connectedTo: [20, 21] },
  { id: 18, type: 'Shop', label: 'Uralter Schrein', tier: 4, connectedTo: [21, 22] },
  { id: 19, type: 'Kampf', label: 'Ruinen-Thron', tier: 4, connectedTo: [22, 23] },
  
  // Tier 5
  { id: 20, type: 'Elite', label: 'Schattenwolf-Alphatier', tier: 5, connectedTo: [24] },
  { id: 21, type: 'Kampf', label: 'Verborgene Klippe', tier: 5, connectedTo: [24, 25] },
  { id: 22, type: 'Ereignis', label: 'Die große Wahl', tier: 5, connectedTo: [25, 26] },
  { id: 23, type: 'Lagerfeuer', label: 'Sichere Höhle', tier: 5, connectedTo: [26] },

  // Tier 6
  { id: 24, type: 'Kampf', label: 'Tiefes Tal', tier: 6, connectedTo: [27, 28] },
  { id: 25, type: 'Schatztruhe', label: 'Vergrabene Truhe', tier: 6, connectedTo: [28] },
  { id: 26, type: 'Kampf', label: 'Nebelpfad', tier: 6, connectedTo: [28, 29] },

  // Tier 7
  { id: 27, type: 'Ereignis', label: 'Geflüster im Wind', tier: 7, connectedTo: [30] },
  { id: 28, type: 'Elite', label: 'Wächter des Passes', tier: 7, connectedTo: [30, 31] },
  { id: 29, type: 'Shop', label: 'Händler im Nebel', tier: 7, connectedTo: [31] },

  // Tier 8
  { id: 30, type: 'Lagerfeuer', label: 'Letzte Rast vor dem Boss', tier: 8, connectedTo: [32] },
  { id: 31, type: 'Lagerfeuer', label: 'Letzte Rast vor dem Boss', tier: 8, connectedTo: [32] },

  // Tier 9 (Boss - Ebene 10)
  { id: 32, type: 'Boss', label: 'Gebiets-Boss', tier: 9, connectedTo: [] }
];
