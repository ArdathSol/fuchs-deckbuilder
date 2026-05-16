// src/utils/audio.js

let bgmAudio = null;

// Versucht eine Sound-Datei abzuspielen, fängt Fehler ab, falls die Datei (noch) fehlt
const playSoundEffect = (filename) => {
  try {
    const audio = new Audio(`/sounds/${filename}.mp3`);
    audio.volume = 0.6;
    audio.play().catch(() => {}); // Fehler ignorieren, falls Datei nicht existiert
  } catch (error) {
    // Stilles Scheitern
  }
};

export const playClick = () => playSoundEffect('click');
export const playHit = () => playSoundEffect('hit');
export const playReward = () => playSoundEffect('reward');

export const startBGM = (act = 1) => {
  stopBGM();
  try {
    bgmAudio = new Audio(`/sounds/bgm_act${act}.mp3`);
    bgmAudio.loop = true;
    bgmAudio.volume = 0.4; // Etwas leiser für Hintergrundmusik
    bgmAudio.play().catch(() => {
      bgmAudio = null; // Falls keine MP3 gefunden wurde
    });
  } catch (error) {
    bgmAudio = null;
  }
};

export const stopBGM = () => {
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
    bgmAudio = null;
  }
};
