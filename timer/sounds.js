/**
 * Biblioteca de sonidos optimizados para el Cronómetro Interválico
 */

// Utilidad para crear contexto de audio
const createAudioContext = () => new (window.AudioContext || window.webkitAudioContext)();

// Función para crear un beep simple con opciones mejoradas
const createBeep = (duration = 150, freq = 880) => {
  const ctx = createAudioContext();
  const startTime = ctx.currentTime;
  const endTime = startTime + duration / 1000;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
  gain.gain.setValueAtTime(0.2, endTime - 0.01);
  gain.gain.linearRampToValueAtTime(0, endTime);

  filter.type = 'lowpass';
  filter.frequency.value = 1500;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(endTime);
};

// Biblioteca completa de sonidos (definiciones completas incluidas aquí)
const soundLibrary = {
  default: {
    name: "Por defecto",
    description: "Tres beeps ascendentes suaves",
    play: () => {
      createBeep(400, 660);
      setTimeout(() => createBeep(400, 770), 500);
      setTimeout(() => createBeep(600, 880), 1000);
    }
  },
  suave: {
    name: "Suave",
    description: "Notificación suave y elegante",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1800;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const notes = [
        { freq: 440, dur: 0.15 },
        { freq: 587, dur: 0.15 },
        { freq: 659, dur: 0.3 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + 0.05);
        noteGain.gain.setValueAtTime(0.2, time + note.dur - 0.05);
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  campana: {
    name: "Campana",
    description: "Sonido de campana suave",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      filter.Q.value = 3;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 784;
      const noteGain = ctx.createGain();
      const startTime = ctx.currentTime;
      const duration = 0.6;
      noteGain.gain.setValueAtTime(0, startTime);
      noteGain.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(noteGain);
      noteGain.connect(gain);
      osc.start(startTime);
      osc.stop(startTime + duration);
    }
  },
  mario: {
    name: "Super Mario",
    description: "Inspirado en sonido de completar nivel",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const notes = [
        { freq: 523.25, dur: 0.08 },
        { freq: 587.33, dur: 0.08 },
        { freq: 659.25, dur: 0.08 },
        { freq: 698.46, dur: 0.08 },
        { freq: 783.99, dur: 0.08 },
        { freq: 880.00, dur: 0.08 },
        { freq: 987.77, dur: 0.2 },
        { freq: 1046.50, dur: 0.4 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + Math.min(note.dur * 0.3, 0.02));
        noteGain.gain.setValueAtTime(0.2, time + note.dur - Math.min(note.dur * 0.3, 0.02));
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  zelda: {
    name: "Legend of Zelda",
    description: "Inspirado en sonido de descubrimiento",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      gain.connect(ctx.destination);
      const notes = [
        { freq: 587.33, dur: 0.15 },
        { freq: 659.25, dur: 0.15 },
        { freq: 698.46, dur: 0.45 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + 0.05);
        noteGain.gain.setValueAtTime(0.2, time + note.dur - 0.05);
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  pacman: {
    name: "Pac-Man",
    description: "Inspirado en sonido de comer fantasma",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1800;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const notes = [
        { freq: 440, dur: 0.05 },
        { freq: 330, dur: 0.05 },
        { freq: 440, dur: 0.05 },
        { freq: 330, dur: 0.05 },
        { freq: 440, dur: 0.05 },
        { freq: 659.25, dur: 0.3 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + Math.min(note.dur * 0.3, 0.01));
        noteGain.gain.setValueAtTime(0.2, time + note.dur - Math.min(note.dur * 0.3, 0.01));
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  sonic: {
    name: "Sonic",
    description: "Inspirado en sonido de anillo",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.1;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2500;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const notes = [
        { freq: 784, dur: 0.05 },
        { freq: 987.77, dur: 0.05 },
        { freq: 1174.66, dur: 0.05 },
        { freq: 1318.51, dur: 0.05 },
        { freq: 1567.98, dur: 0.05 },
        { freq: 1975.53, dur: 0.2 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + Math.min(note.dur * 0.3, 0.01));
        noteGain.gain.setValueAtTime(0.2, time + note.dur - Math.min(note.dur * 0.3, 0.01));
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  ff: {
    name: "Final Fantasy",
    description: "Inspirado en fanfarria de victoria",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      gain.connect(ctx.destination);
      const notes = [
        { freq: 523.25, dur: 0.2 },
        { freq: 659.25, dur: 0.2 },
        { freq: 783.99, dur: 0.2 },
        { freq: 1046.50, dur: 0.6 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + 0.05);
        noteGain.gain.setValueAtTime(0.2, time + note.dur - 0.05);
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  levelup: {
    name: "Level Up",
    description: "Sonido de subida de nivel suavizado",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2200;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const notes = [
        { freq: 330, dur: 0.1 },
        { freq: 392, dur: 0.1 },
        { freq: 494, dur: 0.1 },
        { freq: 523, dur: 0.1 },
        { freq: 659, dur: 0.2 },
        { freq: 880, dur: 0.4 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + 0.03);
        noteGain.gain.setValueAtTime(0.2, time + note.dur - 0.03);
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  stadium: {
    name: "Estadio",
    description: "Multitud celebrando en estadio",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      gain.connect(ctx.destination);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1500;
      const notes = [
        { freq: 440, dur: 0.12 },
        { freq: 440, dur: 0.12 },
        { freq: 440, dur: 0.12 },
        { freq: 659, dur: 0.6 }
      ];
      let time = ctx.currentTime;
      notes.forEach((note, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + 0.04);
        noteGain.gain.setValueAtTime(0.2, time + note.dur - 0.04);
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        if (i === 3) {
          const noise = ctx.createOscillator();
          noise.type = 'sawtooth';
          const mod = ctx.createOscillator();
          mod.type = 'sawtooth';
          mod.frequency.value = 20;
          const modGain = ctx.createGain();
          modGain.gain.value = 20;
          mod.connect(modGain);
          modGain.connect(noise.frequency);
          noise.frequency.value = 100;
          const noiseGain = ctx.createGain();
          noiseGain.gain.value = 0.03;
          const noiseFilter = ctx.createBiquadFilter();
          noiseFilter.type = 'lowpass';
          noiseFilter.frequency.value = 800;
          noise.connect(noiseGain);
          noiseGain.connect(noiseFilter);
          noiseFilter.connect(ctx.destination);
          noise.start(time);
          mod.start(time);
          noise.stop(time + note.dur + 0.2);
          mod.stop(time + note.dur + 0.2);
        }
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  chiptune: {
    name: "Chiptune",
    description: "Melodía estilo 8-bit suavizada",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.12;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1500;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const notes = [
        { freq: 440, dur: 0.1 },
        { freq: 494, dur: 0.1 },
        { freq: 523, dur: 0.1 },
        { freq: 587, dur: 0.1 },
        { freq: 659, dur: 0.1 },
        { freq: 698, dur: 0.1 },
        { freq: 784, dur: 0.2 },
        { freq: 880, dur: 0.3 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = time % 0.3 < 0.15 ? 'square' : 'triangle';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + Math.min(note.dur * 0.3, 0.02));
        noteGain.gain.setValueAtTime(0.2, time + note.dur - Math.min(note.dur * 0.3, 0.02));
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  mellow: {
    name: "Mellow",
    description: "Sonido suave y relajante",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.12;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const notes = [
        { freq: 392, dur: 0.2 },
        { freq: 493.88, dur: 0.2 },
        { freq: 587.33, dur: 0.6 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + 0.1);
        noteGain.gain.setValueAtTime(0.2, time + note.dur - 0.1);
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  digital: {
    name: "Digital",
    description: "Bip digital moderno",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.12;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const notes = [
        { freq: 1200, dur: 0.1 },
        { freq: 800, dur: 0.3 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        const modulator = ctx.createOscillator();
        modulator.type = 'sine';
        modulator.frequency.value = 8;
        const modGain = ctx.createGain();
        modGain.gain.value = 50;
        modulator.connect(modGain);
        modGain.connect(osc.frequency);
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + 0.05);
        noteGain.gain.setValueAtTime(0.2, time + note.dur - 0.05);
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        modulator.start(time);
        osc.stop(time + note.dur);
        modulator.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  marimba: {
    name: "Marimba",
    description: "Sonido de marimba",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 700;
      filter.Q.value = 3;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const notes = [
        { freq: 523.25, dur: 0.1 },
        { freq: 659.25, dur: 0.1 },
        { freq: 783.99, dur: 0.3 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + note.dur);        time += note.dur;
      });
    }
  },
  crystal: {
    name: "Cristal",
    description: "Sonido de cristal delicado",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.08;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1000;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const notes = [
        { freq: 1318.51, dur: 0.1 },
        { freq: 1567.98, dur: 0.1 },
        { freq: 2093.00, dur: 0.4 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.001, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  agua: {
    name: "Agua",
    description: "Sonido líquido y refrescante",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.12;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      filter.Q.value = 1.5;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const notes = [
        { freq: 1200, dur: 0.05 },
        { freq: 900, dur: 0.15 },
        { freq: 600, dur: 0.25 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        const modulator = ctx.createOscillator();
        modulator.type = 'sine';
        modulator.frequency.value = 20 - note.dur * 40;
        const modGain = ctx.createGain();
        modGain.gain.value = 200 - note.freq / 10;
        modulator.connect(modGain);
        modGain.connect(osc.frequency);
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        modulator.start(time);
        osc.stop(time + note.dur);
        modulator.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  brisa: {
    name: "Brisa",
    description: "Sonido suave como el viento",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.12;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 587.33;
      const modulator = ctx.createOscillator();
      modulator.type = 'sine';
      modulator.frequency.value = 6;
      const modGain = ctx.createGain();
      modGain.gain.value = 20;
      modulator.connect(modGain);
      modGain.connect(osc.frequency);
      const time = ctx.currentTime;
      const duration = 0.8;
      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0, time);
      noteGain.gain.linearRampToValueAtTime(0.2, time + 0.2);
      noteGain.gain.linearRampToValueAtTime(0, time + duration);
      osc.connect(noteGain);
      noteGain.connect(gain);
      osc.start(time);
      modulator.start(time);
      osc.stop(time + duration);
      modulator.stop(time + duration);
    }
  },
  retro: {
    name: "Retro",
    description: "Sonido retro arcade suavizado",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.1;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const notes = [
        { freq: 880, dur: 0.05 },
        { freq: 587.33, dur: 0.05 },
        { freq: 659.25, dur: 0.05 },
        { freq: 783.99, dur: 0.15 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + Math.min(note.dur * 0.3, 0.01));
        noteGain.gain.setValueAtTime(0.2, time + note.dur - Math.min(note.dur * 0.3, 0.01));
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  bamboo: {
    name: "Bambú",
    description: "Sonido de tubo de bambú",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 400;
      filter.Q.value = 5;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 440;
      const time = ctx.currentTime;
      const duration = 0.25;
      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0, time);
      noteGain.gain.linearRampToValueAtTime(0.2, time + 0.01);
      noteGain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.connect(noteGain);
      noteGain.connect(gain);
      osc.start(time);
      osc.stop(time + duration);
    }
  },
  pulso: {
    name: "Pulso",
    description: "Pulso electrónico suave",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const notes = [
        { freq: 220, dur: 0.15 },
        { freq: 330, dur: 0.15 },
        { freq: 440, dur: 0.3 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + 0.05);
        noteGain.gain.setValueAtTime(0.2, time + note.dur - 0.05);
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
      });
    }
  },
  espacial: {
    name: "Espacial",
    description: "Atmósfera espacial envolvente",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.12;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 500;
      filter.Q.value = 2;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 400;
      const modulator = ctx.createOscillator();
      modulator.type = 'triangle';
      modulator.frequency.value = 4;
      const modGain = ctx.createGain();
      modGain.gain.value = 30;
      modulator.connect(modGain);
      modGain.connect(osc.frequency);
      const time = ctx.currentTime;
      const duration = 0.7;
      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0, time);
      noteGain.gain.linearRampToValueAtTime(0.2, time + 0.2);
      noteGain.gain.linearRampToValueAtTime(0, time + duration);
      osc.connect(noteGain);
      noteGain.connect(gain);
      osc.start(time);
      modulator.start(time);
      osc.stop(time + duration);
      modulator.stop(time + duration);
    }
  },
  completo: {
    name: "Completo",
    description: "Sonido de confirmación profesional",
    play: () => {
      const ctx = createAudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      gain.connect(filter);
      filter.connect(ctx.destination);
      const notes = [
        { freq: 587.33, dur: 0.15 },
        { freq: 783.99, dur: 0.5 }
      ];
      let time = ctx.currentTime;
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.2, time + 0.05);
        noteGain.gain.setValueAtTime(0.2, time + note.dur - 0.05);
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
      });
    }
  }
};


// Función para generar dinámicamente el selector de sonidos en HTML
const generateSoundSelector = (selectId) => {
  const select = document.getElementById(selectId);
  if (!select) return false;

  select.innerHTML = '';

  Object.keys(soundLibrary).forEach((key) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = soundLibrary[key].name;
    option.title = soundLibrary[key].description;
    select.appendChild(option);
  });

  return true;
};

// Crear un objeto victorySounds con las funciones play
const victorySounds = {};
Object.keys(soundLibrary).forEach((key) => {
  victorySounds[key] = soundLibrary[key].play;
});

// Exportar funciones y objetos
export { createBeep, victorySounds, soundLibrary, generateSoundSelector };
