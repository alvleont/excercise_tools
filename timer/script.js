// script.js

import { createBeep, victorySounds, soundLibrary, generateSoundSelector } from './sounds.js';

(() => {
  // ---------- helpers ----------
  const qs  = s => document.querySelector(s);
  const qsa = s => document.querySelectorAll(s);

  // ---------- state ----------
  let intervals = [], current = 0, remainingSec = 0, timerId = null, running = false;
  let originalSec = 0, userRating = 0, skippedIntervals = 0;
  let tbody;  // asignado en DOMContentLoaded
  const progressBar = { get el() { return qs('#progressBar'); } };

  // ---------- interval table ----------
  function addIntervalRow(name = 'Nuevo intervalo', secs = 60) {
    if (!tbody) return;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" value="${name}" placeholder="Nombre del intervalo"></td>
      <td><input type="number" value="${secs}" min="1" placeholder="Duración"></td>
      <td>
        <button class="btn-icon delBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5252" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </td>`;
    row.querySelector('.delBtn').onclick = () => row.remove();
    tbody.appendChild(row);
  }

  function parseSharedRoutine() {
    try {
      const hash = window.location.hash.substring(1);
      if (!hash || !tbody) return false;
      const decoded = JSON.parse(decodeURIComponent(atob(hash)));
      if (!decoded.intervals || !Array.isArray(decoded.intervals)) return false;
      // limpiar tabla
      tbody.innerHTML = '';
      // nombre de rutina
      if (decoded.name) {
        const rn = qs('#routineName');
        if (rn) rn.value = decoded.name;
      }
      // sonido seleccionado
      if (decoded.sound) {
        const vs = qs('#victorySound');
        if (vs && vs.querySelector(`option[value="${decoded.sound}"]`)) {
          vs.value = decoded.sound;
        }
      }
      // cargar filas
      decoded.intervals.forEach(item => {
        addIntervalRow(item.name || 'Intervalo', item.secs || 60);
      });
      return true;
    } catch (e) {
      console.log('Error al cargar rutina compartida:', e);
      return false;
    }
  }

  // ---------- share setup ----------
  function generateShareFromSetup() {
    if (!tbody) return;
    const rn = qs('#routineName');
    const vs = qs('#victorySound');
    const data = {
      name: rn ? rn.value : 'Rutina personalizada',
      sound: vs ? vs.value : 'default',
      intervals: Array.from(tbody.querySelectorAll('tr')).map(tr => {
        return {
          name: tr.children[0].querySelector('input').value || 'Intervalo',
          secs: parseInt(tr.children[1].querySelector('input').value, 10) || 60
        };
      }).filter(i => i.secs > 0)
    };
    if (!data.intervals.length) {
      alert('Añade al menos un intervalo para compartir la rutina 😉');
      return;
    }
    const json = JSON.stringify(data);
    const b64  = btoa(encodeURIComponent(json));
    const url  = `${window.location.origin}${window.location.pathname}#${b64}`;
    const input = qs('#setupShareLink');
    if (input) {
      input.value = url;
      const container = qs('#shareSetupContainer');
      if (container) container.classList.remove('hidden');
      const copyBtn = qs('#setupCopyBtn');
      if (copyBtn) copyBtn.onclick = () => {
        input.select();
        document.execCommand('copy');
        const note = qs('#copyNotification');
        if (note) {
          note.style.opacity = '1';
          setTimeout(() => note.style.opacity = '0', 2000);
        }
      };
    }
  }

  // ---------- share result ----------
  function generateShareLink() {
    const rn = qs('#routineName');
    const vs = qs('#victorySound');
    const data = {
      name: rn ? rn.value : 'Rutina personalizada',
      sound: vs ? vs.value : 'default',
      intervals
    };
    const json = JSON.stringify(data);
    const b64  = btoa(encodeURIComponent(json));
    const url  = `${window.location.origin}${window.location.pathname}#${b64}`;
    const input = qs('#shareLink');
    if (input) {
      input.value = url;
      const container = qs('#shareContainer');
      if (container) container.classList.remove('hidden');
      const copyBtn = qs('#copyBtn');
      if (copyBtn) copyBtn.onclick = () => {
        input.select();
        document.execCommand('copy');
        const note = qs('#copyNotification');
        if (note) {
          note.style.opacity = '1';
          setTimeout(() => note.style.opacity = '0', 2000);
        }
      };
    }
  }

  // ---------- rating ----------
  function setupRating() {
    const stars = qsa('.star-btn');
    stars.forEach(star => {
      star.onclick = () => {
        userRating = parseInt(star.dataset.value, 10);
        stars.forEach(s => s.classList.remove('active'));
        stars.forEach(s => {
          if (parseInt(s.dataset.value, 10) <= userRating) {
            s.classList.add('active');
          }
        });
        const shareBtn = qs('#shareRatingBtn');
        if (shareBtn) shareBtn.classList.remove('hidden');
      };
    });
    const shareBtn = qs('#shareRatingBtn');
    if (shareBtn) shareBtn.onclick = createRatingImage;
  }

  function createRatingImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 600; canvas.height = 400;
    const ctx = canvas.getContext('2d');
    // fondo
    ctx.fillStyle = '#1e1e1e'; ctx.fillRect(0, 0, 600, 400);
    // título
    ctx.fillStyle = '#f8f8f8'; ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(qs('#routineName')?.value || 'Rutina', 300, 70);
    // mensaje
    ctx.fillStyle = '#00c37a'; ctx.font = 'bold 36px sans-serif';
    ctx.fillText('¡Entrenamiento completado!', 300, 140);
    // estrellas
    ctx.fillStyle = '#ffb142'; ctx.font = '48px sans-serif';
    let stars = '';
    for (let i = 1; i <= 5; i++) stars += i <= userRating ? '★' : '☆';
    ctx.fillText(stars, 300, 220);
    // fecha
    ctx.fillStyle = '#aaaaaa'; ctx.font = '20px sans-serif';
    ctx.fillText(new Date().toLocaleDateString(), 300, 280);
    // pie
    ctx.fillStyle = '#777777'; ctx.font = '16px sans-serif';
    ctx.fillText('Cronómetro Interválico', 300, 350);

    canvas.toBlob(async blob => {
      const file = new File([blob], 'mi-entrenamiento.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: 'Mi Entrenamiento',
            text: `¡Completé "${qs('#routineName')?.value}" con una calificación de ${userRating}/5!`,
            files: [file]
          });
          return;
        } catch (err) {
          console.log('Error al compartir', err);
        }
      }
      downloadRatingImage(canvas);
    });
  }

  function downloadRatingImage(canvas) {
    const link = document.createElement('a');
    link.download = 'mi-entrenamiento.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // ---------- timer flow ----------
  function nextInterval() {
    current++;
    if (current >= intervals.length) {
      finishWorkout();
      return;
    }
    remainingSec = intervals[current].secs;
    originalSec  = remainingSec;

    qs('#workoutTitle').textContent = qs('#routineName')?.value || 'Mi rutina';
    qs('#exerciseName').textContent = intervals[current].name;
    qs('#currentInterval').textContent = `${current + 1}/${intervals.length}`;
    qs('#remaining').textContent = intervals.length - current - 1;

    const nextC = qs('#nextExerciseContainer');
    const nextN = qs('#nextExerciseName');
    if (current + 1 < intervals.length) {
      nextN.textContent = intervals[current + 1].name;
      nextC.classList.remove('hidden');
    } else {
      nextN.textContent = 'Fin';
      nextC.classList.remove('hidden');
    }

    createBeep(300, 660);
    if (progressBar.el) progressBar.el.style.width = '0%';

    tick();
    timerId = setInterval(tick, 1000);

    // animación de pulso
    const disp = qs('#timeDisplay');
    disp?.classList.add('pulse');
    setTimeout(() => disp?.classList.remove('pulse'), 1000);
  }

  function tick() {
    if (!running) return;
    const disp = qs('#timeDisplay');
    if (disp) disp.textContent = String(remainingSec).padStart(2, '0');

    if (progressBar.el) {
      const pct = 100 - ((remainingSec / originalSec) * 100);
      progressBar.el.style.width = `${pct}%`;
    }

    if ([5,4,3,2,1].includes(remainingSec)) {
      createBeep(120, remainingSec <= 3 ? 980 : 880);
      const d = qs('#timeDisplay');
      d?.classList.add('pulse');
      setTimeout(() => d?.classList.remove('pulse'), 500);
    }

    remainingSec--;
    if (remainingSec < 0) {
      clearInterval(timerId);
      nextInterval();
    }
  }

  function finishWorkout() {
    clearInterval(timerId);
    running = false;

    qs('#workoutTitle').textContent = `¡${qs('#routineName')?.value || 'Rutina'} completada!`;
    qs('#workoutTitle')?.classList.add('pulse');
    qs('#timeDisplay').textContent = '00';
    qs('#status').innerHTML = '¡Buen trabajo! <span style="font-size:1.5rem">🏆</span>';
    qs('#exerciseName').textContent = 'Completado';
    qs('#currentInterval').textContent = `${intervals.length}/${intervals.length}`;

    const completed = intervals.length - skippedIntervals;
    const pct = ((completed / intervals.length) * 100).toFixed(2);
    qs('#statistics').innerHTML = `
      <p>Intervalos completados: ${completed}</p>
      <p>Intervalos omitidos: ${skippedIntervals}</p>
      <p>Porcentaje de finalización: ${pct}%</p>
    `;

    qs('#nextExerciseContainer')?.classList.add('hidden');
    if (progressBar.el) progressBar.el.style.width = '100%';
    qs('#pauseBtn').disabled = true;

    const soundVal = qs('#victorySound')?.value;
    (victorySounds[soundVal] || victorySounds.default)();

    qs('#ratingContainer')?.classList.remove('hidden');
    generateShareLink();
  }

  // ---------- wake lock ----------
  let wakeLock = null;
  async function requestWakeLock() {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
    } catch (err) {
      console.log(`WakeLock error: ${err.name}, ${err.message}`);
    }
  }

  // ---------- init on load ----------
  document.addEventListener('DOMContentLoaded', () => {
    // sonido
    generateSoundSelector('victorySound');

    // tabla de intervalos
    tbody = qs('#intervalTable tbody');
    parseSharedRoutine();

    // add row
    qs('#addRow')?.addEventListener('click', () => addIntervalRow());

    // remove row (delegado)
    tbody?.addEventListener('click', e => {
      if (e.target.closest('.delBtn')) e.target.closest('tr').remove();
    });

    // probar sonido
    qs('#testSoundBtn')?.addEventListener('click', () => {
      const val = qs('#victorySound')?.value;
      (victorySounds[val] || victorySounds.default)();
    });

    // compartir setup
    qs('#shareSetupBtn')?.addEventListener('click', generateShareFromSetup);

    // iniciar rutina
    qs('#startBtn')?.addEventListener('click', async () => {
      intervals = Array.from(tbody.querySelectorAll('tr')).map(tr => ({
        name: tr.children[0].querySelector('input').value || 'Intervalo',
        secs: parseInt(tr.children[1].querySelector('input').value, 10) || 60
      })).filter(i => i.secs > 0);

      if (!intervals.length) {
        alert('Añade al menos un intervalo 😉');
        return;
      }

      if (document.documentElement.requestFullscreen) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (e) {
          console.log('Fullscreen failed:', e);
        }
      }

      qs('#setup')?.classList.add('hidden');
      qs('#timerScreen')?.classList.remove('hidden');
      qs('#pauseBtn')?.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        Pausar`;

      qs('#workoutTitle').textContent = qs('#routineName')?.value || 'Mi rutina';

      current = -1; running = true; skippedIntervals = 0;
      nextInterval();

      // wake lock
      if (navigator.wakeLock) {
        requestWakeLock();
        document.addEventListener('visibilitychange', () => {
          if (wakeLock !== null && document.visibilityState === 'visible') {
            requestWakeLock();
          }
        });
      }
    });

    // pausar/reanudar
    qs('#pauseBtn')?.addEventListener('click', () => {
      if (!running) {
        running = true;
        qs('#pauseBtn').innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
          Pausar`;
        createBeep(200, 660);
        timerId = setInterval(tick, 1000);
      } else {
        running = false;
        qs('#pauseBtn').innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Reanudar`;
        clearInterval(timerId);
      }
    });

    // detener
    qs('#stopBtn')?.addEventListener('click', finishWorkout);

    // omitir
    qs('#skipBtn')?.addEventListener('click', () => {
      if (current < intervals.length) {
        skippedIntervals++;
        nextInterval();
      }
    });

    // sistema de rating
    setupRating();

    // salir de pantalla completa con Escape
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
      }
    });
  });
})();
