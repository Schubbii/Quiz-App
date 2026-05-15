const SOUND_CONFIG = {
  buttonHover: {
    src: "./sounds/buttonHover.mp3",
    volume: 0.50,
  },
  buttonClick: {
    src: "./sounds/buttonClick.mp3",
    volume: 0.8,
  },
  buttonRelease: {
    src: "./sounds/buttonRelease.mp3",
    volume: 0,
  },
};

const MUSIC_CONFIG = {
  lobbyBackground: {
    src: "./sounds/Lobby.mp3",
    volume: 0.8,
  },
};

const pools = new Map();
const musicTracks = new Map();

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

function preloadMusic() {
  for (const [musicName, config] of Object.entries(MUSIC_CONFIG)) {
    const music = createAudio(config.src, config.volume);

    music.loop = true;

    musicTracks.set(musicName, music);
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

function playMusic(musicName) {
  const music = musicTracks.get(musicName);

  if (!music) {
    console.warn(`Unknown music: ${musicName}`);
    return;
  }

  if (!music.paused) {
    return;
  }

  music.volume = MUSIC_CONFIG[musicName].volume;
  music.loop = true;

  music.play().catch((error) => {
    console.warn(`Could not play music "${musicName}":`, error);
  });
}

function stopMusic(musicName) {
  const music = musicTracks.get(musicName);

  if (!music) {
    console.warn(`Unknown music: ${musicName}`);
    return;
  }

  music.pause();
  music.currentTime = 0;
}

function pauseMusic(musicName) {
  const music = musicTracks.get(musicName);

  if (!music) {
    console.warn(`Unknown music: ${musicName}`);
    return;
  }

  music.pause();
}

preloadSounds();
preloadMusic();

window.audioHost.onPlaySound((soundName) => {
  playSound(soundName);
});

window.audioHost.onPlayMusic((musicName) => {
  playMusic(musicName);
});

window.audioHost.onStopMusic((musicName) => {
  stopMusic(musicName);
});

window.audioHost.onPauseMusic((musicName) => {
  pauseMusic(musicName);
});