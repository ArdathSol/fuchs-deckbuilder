const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let bgmOscillator = null;
let bgmInterval = null;

export const playClick = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
};

export const playHit = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
};

export const playReward = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(400, audioCtx.currentTime);
  osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
  osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.4);
};

export const startBGM = () => {
  if (bgmOscillator) return; 
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  // Verschiedene Melodien/Tonleitern für mehr Abwechslung
  const melodies = [
    [220.00, 261.63, 329.63, 392.00], // A Moll Pentatonisch (mystisch)
    [261.63, 329.63, 392.00, 523.25], // C Dur (heldenhaft)
    [146.83, 174.61, 220.00, 293.66], // D Moll (düster)
    [196.00, 246.94, 293.66, 392.00]  // G Dur (fröhlich)
  ];
  
  // Zufällige Auswahl pro Start
  const notes = melodies[Math.floor(Math.random() * melodies.length)];
  const tempo = 300 + Math.floor(Math.random() * 200); // Zufälliges Tempo zwischen 300ms und 500ms
  let step = 0;

  bgmInterval = setInterval(() => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    // Zufällige Wellenform für Retro-Feeling
    osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
    osc.frequency.value = notes[step % notes.length] / 2; // Bass-Note
    
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (tempo / 1000) * 0.8);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + (tempo / 1000) * 0.8);
    
    step++;
  }, tempo);
  
  bgmOscillator = true;
};

export const stopBGM = () => {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
    bgmOscillator = null;
  }
};
