export const CHARACTERS = [
  {
    id: 'normal',
    name: 'Normaler Fuchs',
    title: 'Der Abenteurer',
    unlocked: true,
    unlockCondition: 'Von Anfang an freigeschaltet',
    ascensionLevel: 0,
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
  // Normale Artefakte (Pool für Startbonus, Truhen, Elite)
  stone_fox_idol: { id: 'stone_fox_idol', name: 'Steinerner Fuchsschrein', desc: 'Jeder Kampf startet mit 1 zusätzlichem Energie.', iconName: 'Zap', effect: { type: 'energy', value: 1 } },
  shadow_charm: { id: 'shadow_charm', name: 'Schattenamulett', desc: 'Gegner starten jeden Kampf mit 2 Schwäche.', iconName: 'Moon', effect: { type: 'enemy_weak', value: 2 } },
  lava_scale: { id: 'lava_scale', name: 'Lavaschuppe', desc: 'Zu Beginn des Zuges erhält ein zufälliger Gegner 2 Brand.', iconName: 'Flame', effect: { type: 'turn_start_burn', value: 2 } },
  cyber_core: { id: 'cyber_core', name: 'Kybernetischer Kern', desc: 'Zu Beginn des Zuges wird 1 zusätzliche Karte gezogen.', iconName: 'Cpu', effect: { type: 'draw', value: 1 } },
  sacred_flame: { id: 'sacred_flame', name: 'Heilige Flamme', desc: 'Angriffskarten verursachen +2 Brandschaden.', iconName: 'Sun', effect: { type: 'burn_bonus', value: 2 } },
  golden_acorn: { id: 'golden_acorn', name: 'Goldene Eichel', desc: 'Erhöht das gefundene Gold um 20%.', iconName: 'Coins', effect: { type: 'gold_bonus', value: 1.2 } },
  
  // Boss Artefakte (Droppen NUR nach Akt-Bossen)
  boss_energy_core: { id: 'boss_energy_core', name: 'Leuchtender Golem-Kern', desc: '+1 Energie pro Zug, aber maximales Leben wird um 15 reduziert.', iconName: 'Zap', isBoss: true, effect: { type: 'energy_max_hp_down', value: 1 } },
  boss_spider_eye: { id: 'boss_spider_eye', name: 'Auge der Weberin', desc: 'Jede 3. ausgespielte Karte heilt dich um 2 HP.', iconName: 'Eye', isBoss: true, effect: { type: 'heal_on_play', value: 2 } },
  boss_dragon_scale: { id: 'boss_dragon_scale', name: 'Drachenschuppe', desc: 'Startet JEDEN Kampf sofort mit 12 Block.', iconName: 'Shield', isBoss: true, effect: { type: 'start_block', value: 12 } },
  boss_heart_fragment: { id: 'boss_heart_fragment', name: 'Herzfragment', desc: 'Heilt 20% der maximalen HP am Ende jedes Kampfes.', iconName: 'Heart', isBoss: true, effect: { type: 'heal_after_combat', value: 0.2 } },
  boss_void_cloak: { id: 'boss_void_cloak', name: 'Leerenumhang', desc: 'Immun gegen den allerersten erlittenen Schaden pro Kampf.', iconName: 'Package', isBoss: true, effect: { type: 'immune_first_hit', value: 1 } }
};

export const CARDS = {
  strike: { id: 'strike', name: 'Prankenhieb', cost: 1, type: 'Angriff', damage: 6, desc: 'Füge einem Gegner 6 Schaden zu.', color: 'border-amber-700 bg-amber-950/50' },
  defend: { id: 'defend', name: 'Einigeln', cost: 1, type: 'Verteidigung', block: 5, desc: 'Erhalte 5 Block.', color: 'border-blue-700 bg-blue-950/50' },
  tail_swipe: { id: 'tail_swipe', name: 'Schwanzfeger', cost: 2, type: 'Angriff', damage: 10, block: 4, desc: 'Füge 10 Schaden zu. Erhalte 4 Block.', color: 'border-orange-700 bg-orange-950/50' },
  ember: { id: 'ember', name: 'Funkenflug', cost: 1, type: 'Angriff', damage: 4, burn: 3, desc: 'Füge 4 Schaden zu. Verursacht 3 Brand.', color: 'border-red-700 bg-red-950/50' },
  pyro_blast: { id: 'pyro_blast', name: 'Pyroschlag', cost: 2, type: 'Angriff', damage: 14, desc: 'Füge 14 Schaden zu. +2 Schaden pro brennendem Gegner.', color: 'border-red-600 bg-red-950/60' }
};

export const ENEMIES = [
  // AKT 1
  { id: 'slime', act: 1, type: 'Normal', name: 'Wald-Schleim', hp: 32, intentValue: 6, sprite: '🧪', behavior: 'Teilt konstanten Schaden aus.' },
  { id: 'bat', act: 1, type: 'Normal', name: 'Giftfledermaus', hp: 24, intentValue: 4, poison: 2, sprite: '🦇', behavior: 'Vergiftet bei jedem Treffer.' },
  { id: 'goblin', act: 1, type: 'Normal', name: 'Diebischer Kobold', hp: 45, intentValue: 5, block: 4, sprite: '👺', behavior: 'Baut regelmäßig Schilde auf.' },
  { id: 'wolf', act: 1, type: 'Elite', name: 'Schattenwolf', hp: 65, intentValue: 12, sprite: '🐺', behavior: 'Aggressive, schwere Angriffe.' },
  // AKT 1 BOSSE
  { id: 'boss_golem', act: 1, type: 'Boss', name: 'Uralter Steingolem', hp: 130, intentValue: 15, sprite: '🗿', behavior: 'Viel Leben, langsame aber vernichtende Schläge.' },
  { id: 'boss_spider', act: 1, type: 'Boss', name: 'Weberin der Tiefen', hp: 105, intentValue: 9, summon: true, sprite: '🕷️', behavior: 'Beschwört jede Runde kleine Spinnen.' },
  { id: 'boss_shaman', act: 1, type: 'Boss', name: 'Verdorbener Schamane', hp: 115, intentValue: 10, curse: true, sprite: '🔮', behavior: 'Verflucht das Deck und nutzt Magie.' },

  // AKT 2
  { id: 'cultist', act: 2, type: 'Normal', name: 'Krähen-Kultist', hp: 55, intentValue: 8, sprite: '🐦‍⬛', behavior: 'Bufft sich jede Runde.' },
  { id: 'mimic', act: 2, type: 'Normal', name: 'Gieriger Mimic', hp: 60, intentValue: 10, sprite: '📦', behavior: 'Teilt harten Schaden aus, gibt extra Gold.' },
  { id: 'knight', act: 2, type: 'Elite', name: 'Verfluchter Ritter', hp: 100, intentValue: 14, block: 10, sprite: '🛡️', behavior: 'Starke Rüstung, kontert Angriffe.' },
  // AKT 2 BOSSE
  { id: 'boss_dragon', act: 2, type: 'Boss', name: 'Junger Aschendrache', hp: 200, intentValue: 18, burn: 3, sprite: '🐉', behavior: 'Setzt den Spieler in Brand.' },
  { id: 'boss_collector', act: 2, type: 'Boss', name: 'Der Sammler', hp: 180, intentValue: 15, sprite: '🎭', behavior: 'Stiehlt Karten aus dem Deck.' },
  { id: 'boss_hive', act: 2, type: 'Boss', name: 'Zorniger Schwarm', hp: 160, intentValue: 6, multiAttack: 3, sprite: '🐝', behavior: 'Greift mehrfach pro Runde an.' },

  // AKT 3
  { id: 'void_walker', act: 3, type: 'Normal', name: 'Leerenwandler', hp: 80, intentValue: 15, sprite: '🌌', behavior: 'Ignoriert teilweise Block.' },
  { id: 'behemoth', act: 3, type: 'Elite', name: 'Magma-Behemoth', hp: 150, intentValue: 22, sprite: '🌋', behavior: 'Steigert seinen Schaden kontinuierlich.' },
  // AKT 3 BOSSE
  { id: 'boss_time', act: 3, type: 'Boss', name: 'Zeitfresser', hp: 350, intentValue: 25, sprite: '⏳', behavior: 'Bestraft das Ausspielen von zu vielen Karten.' },
  { id: 'boss_awakened', act: 3, type: 'Boss', name: 'Die erwachte Krähe', hp: 300, intentValue: 20, sprite: '🦅', behavior: 'Heilt sich, wenn Fähigkeiten genutzt werden.' },
  { id: 'boss_heart', act: 3, type: 'Boss', name: 'Herz des Waldes', hp: 400, intentValue: 30, sprite: '❤️‍🔥', behavior: 'Der ultimative Test.' }
];

export const MAP_NODES = [
  { id: 1, type: 'Kampf', label: 'Vergessener Pfad', tier: 0, connectedTo: [5, 6] },
  { id: 2, type: 'Kampf', label: 'Einsames Dickicht', tier: 0, connectedTo: [6, 7] },
  { id: 3, type: 'Kampf', label: 'Alte Ruine', tier: 0, connectedTo: [7, 8] },
  { id: 4, type: 'Kampf', label: 'Finsterer Fels', tier: 0, connectedTo: [8] },
  { id: 5, type: 'Kampf', label: 'Ruinen-Lichtung', tier: 1, connectedTo: [9, 10] },
  { id: 6, type: 'Ereignis', label: 'Mysteriöser Schrein', tier: 1, connectedTo: [10, 11] },
  { id: 7, type: 'Lagerfeuer', label: 'Sichere Lichtung', tier: 1, connectedTo: [11, 12] },
  { id: 8, type: 'Kampf', label: 'Schlucht-Eingang', tier: 1, connectedTo: [12] },
  { id: 9, type: 'Schatztruhe', label: 'Gefundener Schatz', tier: 2, connectedTo: [13] },
  { id: 10, type: 'Elite', label: 'Revier des Feindes', tier: 2, connectedTo: [13, 14] },
  { id: 11, type: 'Shop', label: 'Händler-Wagen', tier: 2, connectedTo: [14, 15] },
  { id: 12, type: 'Kampf', label: 'Steinerne Brücke', tier: 2, connectedTo: [15, 16] },
  { id: 13, type: 'Ereignis', label: 'Verlorene Erinnerung', tier: 3, connectedTo: [17, 18] },
  { id: 14, type: 'Lagerfeuer', label: 'Geheimnisvoller Fuchsbau', tier: 3, connectedTo: [18] },
  { id: 15, type: 'Kampf', label: 'Ruinen-Marktplatz', tier: 3, connectedTo: [18, 19] },
  { id: 16, type: 'Elite', label: 'Groll der Golems', tier: 3, connectedTo: [19] },
  { id: 17, type: 'Schatztruhe', label: 'Gefallene Beute', tier: 4, connectedTo: [20, 21] },
  { id: 18, type: 'Shop', label: 'Uralter Schrein', tier: 4, connectedTo: [21, 22] },
  { id: 19, type: 'Kampf', label: 'Ruinen-Thron', tier: 4, connectedTo: [22, 23] },
  { id: 20, type: 'Elite', label: 'Gefährliche Klippe', tier: 5, connectedTo: [24] },
  { id: 21, type: 'Kampf', label: 'Verborgene Klippe', tier: 5, connectedTo: [24, 25] },
  { id: 22, type: 'Ereignis', label: 'Die große Wahl', tier: 5, connectedTo: [25, 26] },
  { id: 23, type: 'Lagerfeuer', label: 'Sichere Höhle', tier: 5, connectedTo: [26] },
  { id: 24, type: 'Kampf', label: 'Tiefes Tal', tier: 6, connectedTo: [27, 28] },
  { id: 25, type: 'Schatztruhe', label: 'Vergrabene Truhe', tier: 6, connectedTo: [28] },
  { id: 26, type: 'Kampf', label: 'Nebelpfad', tier: 6, connectedTo: [28, 29] },
  { id: 27, type: 'Ereignis', label: 'Geflüster im Wind', tier: 7, connectedTo: [30] },
  { id: 28, type: 'Elite', label: 'Wächter des Passes', tier: 7, connectedTo: [30, 31] },
  { id: 29, type: 'Shop', label: 'Händler im Nebel', tier: 7, connectedTo: [31] },
  { id: 30, type: 'Lagerfeuer', label: 'Letzte Rast vor dem Boss', tier: 8, connectedTo: [32] },
  { id: 31, type: 'Lagerfeuer', label: 'Letzte Rast vor dem Boss', tier: 8, connectedTo: [32] },
  { id: 32, type: 'Boss', label: 'Akt-Boss', tier: 9, connectedTo: [] }
];
