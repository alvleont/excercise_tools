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

// Colección de sonidos de victoria
const victorySounds = {
    // Sonido por defecto - tres beeps ascendentes
    default: () => {
        createBeep(400, 660); 
        setTimeout(() => createBeep(400, 770), 500);
        setTimeout(() => createBeep(600, 880), 1000);
    },
    
    // Sonido inspirado en Super Mario
    mario: () => {
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
    },
    
    // Sonido inspirado en Legend of Zelda
    zelda: () => {
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
    },
    
    // Sonido inspirado en Pac-Man
    pacman: () => {
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
    },
    
    // Sonido inspirado en Sonic
    sonic: () => {
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
    },
    
    // Sonido inspirado en Final Fantasy
    ff: () => {
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
    },
    
    // Sonido de subida de nivel genérico
    levelup: () => {
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
    },
    
    // Sonido de estadio/multitud
    stadium: () => {
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
};

// Exportar las funciones para usar en otros archivos
export { createBeep, victorySounds };
