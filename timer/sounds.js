/**
 * Biblioteca de sonidos para el Cronómetro Interválico
 * Contiene una colección de sonidos sintetizados inspirados en juegos clásicos
 * y sonidos de victoria para usar al final del entrenamiento.
 */

// Función básica para crear un beep simple 
const createBeep = (duration=150, freq=880) => {
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = 'sine';  // Using sine instead of square for a smoother beep
    osc.frequency.value = freq;
    gain.gain.value = 0.2;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration/1000);
};

// Objeto que define todos los sonidos disponibles
// Esto permite generar el selector dinámicamente
const soundLibrary = {
    default: {
        name: "Por defecto",
        description: "Tres beeps ascendentes simples",
        play: () => {
            createBeep(400, 660); 
            setTimeout(() => createBeep(400, 770), 500);
            setTimeout(() => createBeep(600, 880), 1000);
        }
    },
    mario: {
        name: "Super Mario",
        description: "Inspirado en sonido de completar nivel",
        play: () => {
            const ctx = new (window.AudioContext||window.webkitAudioContext)();
            const gain = ctx.createGain();
            gain.gain.value = 0.2;
            gain.connect(ctx.destination);
            
            // Secuencia de notas ascendentes
            const notes = [
                { freq: 523.25, dur: 0.1 },  // C5
                { freq: 587.33, dur: 0.1 },  // D5
                { freq: 659.25, dur: 0.1 },  // E5
                { freq: 698.46, dur: 0.1 },  // F5
                { freq: 783.99, dur: 0.1 },  // G5
                { freq: 880.00, dur: 0.1 },  // A5
                { freq: 987.77, dur: 0.3 },  // B5
                { freq: 1046.50, dur: 0.5 }  // C6
            ];
            
            let time = ctx.currentTime;
            notes.forEach(note => {
                const osc = ctx.createOscillator();
                osc.type = 'square';
                osc.frequency.value = note.freq;
                osc.connect(gain);
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
            const ctx = new (window.AudioContext||window.webkitAudioContext)();
            const gain = ctx.createGain();
            gain.gain.value = 0.2;
            gain.connect(ctx.destination);
            
            // Secuencia "descubrimiento"
            const notes = [
                { freq: 587.33, dur: 0.15 },  // D5
                { freq: 659.25, dur: 0.15 },  // E5
                { freq: 698.46, dur: 0.45 },  // F5
            ];
            
            let time = ctx.currentTime;
            notes.forEach(note => {
                const osc = ctx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.value = note.freq;
                osc.connect(gain);
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
            const ctx = new (window.AudioContext||window.webkitAudioContext)();
            const gain = ctx.createGain();
            gain.gain.value = 0.2;
            gain.connect(ctx.destination);
            
            // Sonido "waka-waka" rápido
            const notes = [
                { freq: 440, dur: 0.05 },  // A4
                { freq: 330, dur: 0.05 },  // E4
                { freq: 440, dur: 0.05 },  // A4
                { freq: 330, dur: 0.05 },  // E4
                { freq: 440, dur: 0.05 },  // A4
                { freq: 659.25, dur: 0.3 }  // E5
            ];
            
            let time = ctx.currentTime;
            notes.forEach(note => {
                const osc = ctx.createOscillator();
                osc.type = 'square';
                osc.frequency.value = note.freq;
                osc.connect(gain);
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
            const ctx = new (window.AudioContext||window.webkitAudioContext)();
            const gain = ctx.createGain();
            gain.gain.value = 0.2;
            gain.connect(ctx.destination);
            
            // Arpeggio ascendente que suena similar al sonido de anillos
            const notes = [
                { freq: 784, dur: 0.05 },   // G5
                { freq: 987.77, dur: 0.05 }, // B5
                { freq: 1174.66, dur: 0.05 }, // D6
                { freq: 1318.51, dur: 0.05 }, // E6
                { freq: 1567.98, dur: 0.05 }, // G6
                { freq: 1975.53, dur: 0.3 }  // B6
            ];
            
            let time = ctx.currentTime;
            notes.forEach(note => {
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = note.freq;
                osc.connect(gain);
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
            const ctx = new (window.AudioContext||window.webkitAudioContext)();
            const gain = ctx.createGain();
            gain.gain.value = 0.2;
            gain.connect(ctx.destination);
            
            // Fanfarria simple ascendente
            const notes = [
                { freq: 523.25, dur: 0.2 },  // C5
                { freq: 659.25, dur: 0.2 },  // E5
                { freq: 783.99, dur: 0.2 },  // G5
                { freq: 1046.50, dur: 0.6 }  // C6
            ];
            
            let time = ctx.currentTime;
            notes.forEach(note => {
                const osc = ctx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.value = note.freq;
                osc.connect(gain);
                osc.start(time);
                osc.stop(time + note.dur);
                time += note.dur;
            });
        }
    },
    levelup: {
        name: "Level Up",
        description: "Sonido de subida de nivel genérico",
        play: () => {
            const ctx = new (window.AudioContext||window.webkitAudioContext)();
            const gain = ctx.createGain();
            gain.gain.value = 0.2;
            gain.connect(ctx.destination);
            
            // Sonido ascendente rápido tipo "level-up"
            const notes = [
                { freq: 330, dur: 0.1 },    // E4
                { freq: 392, dur: 0.1 },    // G4
                { freq: 494, dur: 0.1 },    // B4
                { freq: 523, dur: 0.1 },    // C5
                { freq: 659, dur: 0.25 },   // E5
                { freq: 880, dur: 0.45 }    // A5
            ];
            
            let time = ctx.currentTime;
            notes.forEach(note => {
                const osc = ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.value = note.freq;
                osc.connect(gain);
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
            const ctx = new (window.AudioContext||window.webkitAudioContext)();
            const gain = ctx.createGain();
            gain.gain.value = 0.15;
            gain.connect(ctx.destination);
            
            // Sonido de "carga" de estadio
            const notes = [
                { freq: 440, dur: 0.12 },   // A4
                { freq: 440, dur: 0.12 },   // A4
                { freq: 440, dur: 0.12 },   // A4
                { freq: 659, dur: 0.6 }     // E5
            ];
            
            let time = ctx.currentTime;
            notes.forEach((note, index) => {
                const osc = ctx.createOscillator();
                osc.type = 'square';
                osc.frequency.value = note.freq;
                
                // Añadir un poco de ruido para simular multitud
                if (index === 3) {
                    const noise = ctx.createOscillator();
                    noise.type = 'sawtooth';
                    
                    // Modulación para simular ruido
                    const modulator = ctx.createOscillator();
                    modulator.type = 'sawtooth';
                    modulator.frequency.value = 20;
                    
                    const modulatorGain = ctx.createGain();
                    modulatorGain.gain.value = 20;
                    
                    modulator.connect(modulatorGain);
                    modulatorGain.connect(noise.frequency);
                    
                    noise.frequency.value = 100;
                    
                    const noiseGain = ctx.createGain();
                    noiseGain.gain.value = 0.04;
                    
                    noise.connect(noiseGain);
                    noiseGain.connect(ctx.destination);
                    
                    noise.start(time);
                    modulator.start(time);
                    noise.stop(time + note.dur + 0.2);
                    modulator.stop(time + note.dur + 0.2);
                }
                
                osc.connect(gain);
                osc.start(time);
                osc.stop(time + note.dur);
                time += note.dur;
            });
        }
    },
    chiptune: {
        name: "Chiptune",
        description: "Melodía estilo 8-bit",
        play: () => {
            const ctx = new (window.AudioContext||window.webkitAudioContext)();
            const gain = ctx.createGain();
            gain.gain.value = 0.15;
            gain.connect(ctx.destination);
            
            // Melodía estilo videojuego 8-bit
            const notes = [
                { freq: 440, dur: 0.1 },    // A4
                { freq: 494, dur: 0.1 },    // B4
                { freq: 523, dur: 0.1 },    // C5
                { freq: 587, dur: 0.1 },    // D5
                { freq: 659, dur: 0.1 },    // E5
                { freq: 698, dur: 0.1 },    // F5
                { freq: 784, dur: 0.2 },    // G5
                { freq: 880, dur: 0.4 }     // A5
            ];
            
            let time = ctx.currentTime;
            notes.forEach(note => {
                const osc = ctx.createOscillator();
                // Cambiar entre diferentes formas de onda para efecto 8-bit
                osc.type = time % 0.3 < 0.15 ? 'square' : 'triangle';
                osc.frequency.value = note.freq;
                
                // Añadir un poco de distorsión
                const distortion = ctx.createWaveShaper();
                function makeDistortionCurve(amount) {
                    const k = amount;
                    const n_samples = 44100;
                    const curve = new Float32Array(n_samples);
                    const deg = Math.PI / 180;
                    
                    for (let i = 0; i < n_samples; ++i) {
                        const x = i * 2 / n_samples - 1;
                        curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
                    }
                    return curve;
                }
                
                distortion.curve = makeDistortionCurve(5);
                distortion.oversample = '4x';
                
                osc.connect(distortion);
                distortion.connect(gain);
                
                osc.start(time);
                osc.stop(time + note.dur);
                time += note.dur;
            });
        }
    }
};

// Función para generar dinámicamente el selector de sonidos en HTML
function generateSoundSelector(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return false;
    
    // Limpiar opciones existentes
    select.innerHTML = '';
    
    // Crear y añadir las opciones basadas en la biblioteca de sonidos
    Object.keys(soundLibrary).forEach(soundKey => {
        const option = document.createElement('option');
        option.value = soundKey;
        option.textContent = soundLibrary[soundKey].name;
        option.title = soundLibrary[soundKey].description || '';
        select.appendChild(option);
    });
    
    return true;
}

// Crear un objeto victorySounds que use las funciones 'play' de la biblioteca
const victorySounds = {};
Object.keys(soundLibrary).forEach(soundKey => {
    victorySounds[soundKey] = soundLibrary[soundKey].play;
});

// Exportar las funciones y objetos
export { createBeep, victorySounds, soundLibrary, generateSoundSelector };
