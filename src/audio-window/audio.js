const SOUND_CONFIG = {
  buttonHover: {
    src: "./sounds/buttonHover.mp3",
    volume: 0.10,
  },
  buttonClick: {
    src: "./sounds/buttonClick.mp3",
    volume: 0.15,
  },
  buttonRelease: {
    src: "./sounds/buttonRelease.mp3",
    volume: 0,
  },
};

const pools = new Map();

function createAudio(src, volume) {
  const audio = new Audio(src);

  audio.preload = "auto";
  audio.volume = volume;

  audio.load();

  return audio;
}

function preloadSounds() {
  for (const [soundName, config] of Object.entries(SOUND_CONFIG)) {
    const pool = [
      createAudio(config.src, config.volume),
      createAudio(config.src, config.volume),
      createAudio(config.src, config.volume),
    ];

    pools.set(soundName, pool);
  }
}

function playSound(soundName) {
  const config = SOUND_CONFIG[soundName];

  if (!config) {
    console.warn(`Unknown sound: ${soundName}`);
    return;
  }

  const pool = pools.get(soundName);

  let audio = pool.find((item) => item.paused || item.ended);

  if (!audio) {
    audio = createAudio(config.src, config.volume);
    pool.push(audio);
  }

  audio.currentTime = 0;
  audio.volume = config.volume;

  audio.play().catch((error) => {
    console.warn(`Could not play sound "${soundName}":`, error);
  });
}

preloadSounds();

window.audioHost.onPlay((soundName) => {
  playSound(soundName);
});