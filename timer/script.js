// Importamos las funciones de sonido desde el archivo sounds.js
import { createBeep, victorySounds } from './sounds.js';

// IIFE para encapsular el código
(() => {
    // ---------- helpers ----------
    const qs = s => document.querySelector(s);

    // ---------- dynamic table ----------
    const tbody = qs('#intervalTable tbody');
    
    qs('#addRow').onclick = () => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><input type="text" value="Nuevo intervalo" placeholder="Nombre del intervalo"></td>
          <td><input type="number" value="60" min="1" placeholder="Duración"></td>
          <td>
            <button class="btn-icon delBtn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5252" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </td>`;
        tbody.appendChild(row);
    };
    
    tbody.addEventListener('click', e => {
        if(e.target.closest('.delBtn')) {
            e.target.closest('tr').remove();
        }
    });
    
    // Test sound functionality
    qs('#testSoundBtn').addEventListener('click', () => {
        const soundType = qs('#victorySound').value;
        if (victorySounds[soundType]) {
            victorySounds[soundType]();
        } else {
            victorySounds.default();
        }
    });

    // ---------- timer logic ----------
    let intervals = [], current = 0, remainingSec = 0, timerId = null, running = false;
    let totalSec = 0, originalSec = 0, userRating = 0;
    const progressBar = qs('#progressBar');
    
    // Check for shared routine in URL
    function parseSharedRoutine() {
        try {
            const hash = window.location.hash.substring(1);
            if (hash) {
                const decodedData = decodeURIComponent(atob(hash));
                const parsedData = JSON.parse(decodedData);
                if (parsedData && parsedData.intervals && Array.isArray(parsedData.intervals)) {
                    // Clear existing rows
                    while (tbody.children.length > 0) {
                        tbody.removeChild(tbody.lastChild);
                    }
                    
                    // Set routine name if available
                    if (parsedData.name) {
                        qs('#routineName').value = parsedData.name;
                    }
                    
                    // Set sound if available
                    if (parsedData.sound && qs('#victorySound').querySelector(`option[value="${parsedData.sound}"]`)) {
                        qs('#victorySound').value = parsedData.sound;
                    }
                    
                    // Add rows from shared data
                    parsedData.intervals.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                          <td><input type="text" value="${item.name || 'Intervalo'}" placeholder="Nombre del intervalo"></td>
                          <td><input type="number" value="${item.secs || 60}" min="1" placeholder="Duración"></td>
                          <td>
                            <button class="btn-icon delBtn">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5252" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </td>`;
                        tbody.appendChild(row);
                    });
                    return true;
                }
            }
        } catch (e) {
            console.log('Error al cargar rutina compartida:', e);
        }
        return false;
    }
    
    // Try to load shared routine on page load
    window.addEventListener('DOMContentLoaded', parseSharedRoutine);
    
    // Generate share link from setup page
    qs('#shareSetupBtn').addEventListener('click', () => {
        generateShareFromSetup();
    });
    
    function generateShareFromSetup() {
        const routineData = {
            name: qs('#routineName').value || 'Rutina personalizada',
            sound: qs('#victorySound').value || 'default',
            intervals: [...tbody.querySelectorAll('tr')].map(tr => {
                const name = tr.children[0].querySelector('input').value || 'Intervalo';
                const secs = parseInt(tr.children[1].querySelector('input').value, 10) || 60;
                return {name, secs};
            }).filter(i => i.secs > 0)
        };
        
        if (!routineData.intervals.length) {
            alert('Añade al menos un intervalo para compartir la rutina 😉');
            return;
        }
        
        const jsonData = JSON.stringify(routineData);
        const base64Data = btoa(encodeURIComponent(jsonData));
        const shareUrl = `${window.location.origin}${window.location.pathname}#${base64Data}`;
        
        const shareLinkInput = qs('#setupShareLink');
        shareLinkInput.value = shareUrl;
        qs('#shareSetupContainer').classList.remove('hidden');
        
        // Set up copy button
        qs('#setupCopyBtn').addEventListener('click', () => {
            shareLinkInput.select();
            document.execCommand('copy');
            
            // Show notification
            const notification = qs('#copyNotification');
            notification.style.opacity = '1';
            setTimeout(() => {
                notification.style.opacity = '0';
            }, 2000);
        });
    }
    
    // Generate share link at the end of workout
    function generateShareLink() {
        const routineData = {
            name: qs('#routineName').value || 'Rutina personalizada',
            sound: qs('#victorySound').value || 'default',
            intervals: intervals.map(i => ({name: i.name, secs: i.secs}))
        };
        
        const jsonData = JSON.stringify(routineData);
        const base64Data = btoa(encodeURIComponent(jsonData));
        const shareUrl = `${window.location.origin}${window.location.pathname}#${base64Data}`;
        
        const shareLinkInput = qs('#shareLink');
        shareLinkInput.value = shareUrl;
        qs('#shareContainer').classList.remove('hidden');
        
        // Set up copy button
        qs('#copyBtn').addEventListener('click', () => {
            shareLinkInput.select();
            document.execCommand('copy');
            
            // Show notification
            const notification = qs('#copyNotification');
            notification.style.opacity = '1';
            setTimeout(() => {
                notification.style.opacity = '0';
            }, 2000);
        });
    }
    
    // Rating system
    const setupRating = () => {
        const stars = document.querySelectorAll('.star-btn');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                userRating = parseInt(star.dataset.value);
                // Reset all stars
                stars.forEach(s => s.classList.remove('active'));
                // Highlight selected stars
                stars.forEach(s => {
                    if (parseInt(s.dataset.value) <= userRating) {
                        s.classList.add('active');
                    }
                });
                console.log(`Valoración del usuario: ${userRating}/5`);
                
                // Show share rating button
                qs('#shareRatingBtn').classList.remove('hidden');
            });
        });
        
        // Share Rating via Screenshot/Native Share API
        qs('#shareRatingBtn').addEventListener('click', () => {
            createRatingImage();
        });
    };
    
    // Create shareable rating card
    function createRatingImage() {
        // First check if Web Share API is available
        if (navigator.share && navigator.canShare) {
            // Create a canvas to draw the rating card
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            
            // Background
            ctx.fillStyle = '#1e1e1e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Title
            ctx.fillStyle = '#f8f8f8';
            ctx.font = 'bold 28px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${qs('#routineName').value}`, canvas.width/2, 70);
            
            // Completion message
            ctx.fillStyle = '#00c37a';
            ctx.font = 'bold 36px sans-serif';
            ctx.fillText('¡Entrenamiento completado!', canvas.width/2, 140);
            
            // Rating stars
            ctx.fillStyle = '#ffb142';
            ctx.font = '48px sans-serif';
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                stars += i <= userRating ? '★' : '☆';
            }
            ctx.fillText(stars, canvas.width/2, 220);
            
            // Date
            const now = new Date();
            ctx.fillStyle = '#aaaaaa';
            ctx.font = '20px sans-serif';
            ctx.fillText(now.toLocaleDateString(), canvas.width/2, 280);
            
            // Footer
            ctx.fillStyle = '#777777';
            ctx.font = '16px sans-serif';
            ctx.fillText('Cronómetro Interválico', canvas.width/2, 350);
            
            // Convert canvas to blob
            canvas.toBlob(async (blob) => {
                // Create file from blob
                const file = new File([blob], 'mi-entrenamiento.png', { type: 'image/png' });
                
                // Check if we can share this file
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: 'Mi Entrenamiento',
                            text: `¡Completé "${qs('#routineName').value}" con una calificación de ${userRating}/5!`,
                            files: [file]
                        });
                        console.log('Compartido con éxito');
                    } catch (err) {
                        console.log('Error al compartir', err);
                        // Fallback: download the image
                        downloadRatingImage(canvas);
                    }
                } else {
                    // Fallback: download the image
                    downloadRatingImage(canvas);
                }
            });
        } else {
            // Fallback for browsers without Web Share API
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            
            // Fill with similar content
            ctx.fillStyle = '#1e1e1e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#f8f8f8';
            ctx.font = 'bold 28px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${qs('#routineName').value}`, canvas.width/2, 70);
            
            ctx.fillStyle = '#00c37a';
            ctx.font = 'bold 36px sans-serif';
            ctx.fillText('¡Entrenamiento completado!', canvas.width/2, 140);
            
            ctx.fillStyle = '#ffb142';
            ctx.font = '48px sans-serif';
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                stars += i <= userRating ? '★' : '☆';
            }
            ctx.fillText(stars, canvas.width/2, 220);
            
            const now = new Date();
            ctx.fillStyle = '#aaaaaa';
            ctx.font = '20px sans-serif';
            ctx.fillText(now.toLocaleDateString(), canvas.width/2, 280);
            
            ctx.fillStyle = '#777777';
            ctx.font = '16px sans-serif';
            ctx.fillText('Cronómetro Interválico', canvas.width/2, 350);
            
            downloadRatingImage(canvas);
        }
    }
    
    // Fallback function to download the rating image
    function downloadRatingImage(canvas) {
        const link = document.createElement('a');
        link.download = 'mi-entrenamiento.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
    
    // Initialize rating system
    setupRating();

    qs('#startBtn').onclick = async() => {
        // collect data
        intervals = [...tbody.querySelectorAll('tr')].map(tr => {
            const name = tr.children[0].querySelector('input').value || 'Intervalo';
            const secs = parseInt(tr.children[1].querySelector('input').value, 10) || 60;
            return {name, secs};
        }).filter(i => i.secs > 0);
        
        if(!intervals.length) return alert('Añade al menos un intervalo 😉');

        // enter fullscreen (ignora si falla)
        if(document.documentElement.requestFullscreen) {
            try {
                await document.documentElement.requestFullscreen();
            } catch(e) {
                console.log('No se pudo activar pantalla completa', e);
            }
        }

        qs('#setup').classList.add('hidden');
        qs('#timerScreen').classList.remove('hidden');
        qs('#pauseBtn').innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
            Pausar`;
            
        // Set workout title from name input
        qs('#workoutTitle').textContent = qs('#routineName').value || 'Mi rutina';

        current = -1;
        running = true;
        nextInterval();
    };
    
    function nextInterval() {
        current++;
        if(current >= intervals.length) {
            finishWorkout();
            return;
        }
        
        remainingSec = intervals[current].secs;
        originalSec = remainingSec;
        
        // Actualizar información actual
        qs('#workoutTitle').textContent = qs('#routineName').value || 'Mi rutina';
        qs('#exerciseName').textContent = intervals[current].name;
        qs('#currentInterval').textContent = `${current + 1}/${intervals.length}`;
        qs('#remaining').textContent = intervals.length - current - 1;
        
        // Actualizar información del próximo ejercicio
        const nextExerciseContainer = qs('#nextExerciseContainer');
        const nextExerciseName = qs('#nextExerciseName');
        
        if (current + 1 < intervals.length) {
            nextExerciseName.textContent = intervals[current + 1].name;
            nextExerciseContainer.classList.remove('hidden');
        } else {
            nextExerciseName.textContent = 'Fin';
            nextExerciseContainer.classList.remove('hidden');
        }
        
        // Sonido inicial
        createBeep(300, 660);
        
        // Reset progress
        progressBar.style.width = '0%';
        
        // Timer cycle
        tick();
        timerId = setInterval(tick, 1000);
        
        // Add pulse animation to the timer display
        const timeDisplay = qs('#timeDisplay');
        timeDisplay.classList.add('pulse');
        setTimeout(() => timeDisplay.classList.remove('pulse'), 1000);
    }
    
    function tick() {
        if(!running) return;
        
        // Update display time
        qs('#timeDisplay').textContent = String(remainingSec).padStart(2, '0');
        
        // Update progress bar
        const progress = 100 - ((remainingSec / originalSec) * 100);
        progressBar.style.width = `${progress}%`;
        
        // Beep countdown
        if([5, 4, 3, 2, 1].includes(remainingSec) && remainingSec > 0) {
            createBeep(120, remainingSec <= 3 ? 980 : 880);
            qs('#timeDisplay').classList.add('pulse');
            setTimeout(() => qs('#timeDisplay').classList.remove('pulse'), 500);
        }
        
        remainingSec--;
        
        if(remainingSec < 0) {
            clearInterval(timerId);
            nextInterval();
        }
    }

    qs('#pauseBtn').onclick = () => {
        if(!running) {  // resume
            running = true;
            qs('#pauseBtn').innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                Pausar`;
            createBeep(200, 660);
            timerId = setInterval(tick, 1000);
        } else {  // pause
            running = false;
            qs('#pauseBtn').innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Reanudar`;
            clearInterval(timerId);
        }
    };
    
    qs('#stopBtn').onclick = finishWorkout;
    
    function finishWorkout() {
        clearInterval(timerId);
        running = false;
        
        // Update UI
        qs('#workoutTitle').textContent = `¡${qs('#routineName').value || 'Rutina'} completada!`;
        qs('#workoutTitle').classList.add('pulse');
        qs('#timeDisplay').textContent = '00';
        qs('#status').innerHTML = '¡Buen trabajo! <span style="font-size:1.5rem">🏆</span>';
        qs('#exerciseName').textContent = 'Completado';
        qs('#currentInterval').textContent = `${intervals.length}/${intervals.length}`;
        
        // Hide next exercise
        qs('#nextExerciseContainer').classList.add('hidden');
        
        // Complete progress bar
        progressBar.style.width = '100%';
        
        // Disable pause button
        qs('#pauseBtn').disabled = true;
        
        // Sound notification - usar el sonido seleccionado
        const soundType = qs('#victorySound').value;
        if (victorySounds[soundType]) {
            victorySounds[soundType]();
        } else {
            victorySounds.default();
        }
        
        // Show rating container
        qs('#ratingContainer').classList.remove('hidden');
        
        // Generate share link for this routine
        generateShareLink();
    }
    
    // ---------- exit fullscreen on unload or escape ----------
    window.addEventListener('keydown', e => {
        if(e.key === 'Escape' && document.fullscreenElement) document.exitFullscreen();
    });
    
    // Prevent screen from sleeping on mobile devices
    if (navigator.wakeLock) {
        let wakeLock = null;
        const requestWakeLock = async () => {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
            } catch (err) {
                console.log(`Error al mantener la pantalla activa: ${err.name}, ${err.message}`);
            }
        };
        
        qs('#startBtn').addEventListener('click', requestWakeLock);
        
        // Release wake lock when document visibility changes
        document.addEventListener('visibilitychange', () => {
            if (wakeLock !== null && document.visibilityState === 'visible') {
                requestWakeLock();
            }
        });
    }
})();
