//© Zero - Código libre no comercial


// Cargar el SVG y animar los corazones
// Carga y anima el árbol. Se dispara al comenzar la experiencia.
function cargarArbol() {
  fetch('Img/treelove.svg')
    .then(res => res.text())
    .then(svgText => {
      const container = document.getElementById('tree-container');
      container.innerHTML = svgText;
      const svg = container.querySelector('svg');
      if (!svg) return;

      // Animación de "dibujo" para todos los paths
      const allPaths = Array.from(svg.querySelectorAll('path'));
      allPaths.forEach(path => {
        path.style.stroke = '#222';
        path.style.strokeWidth = '2.5';
        path.style.fillOpacity = '0';
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = 'none';
      });

      // Forzar reflow y luego animar
      setTimeout(() => {
        allPaths.forEach((path, i) => {
          path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
          path.style.strokeDashoffset = 0;
          setTimeout(() => {
            path.style.fillOpacity = '1';
            path.style.stroke = '';
            path.style.strokeWidth = '';
          }, 1200 + i * 80);
        });

        // Después de la animación de dibujo, mueve y agranda el SVG
        const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
        setTimeout(() => {
          svg.classList.add('move-and-scale');
          // Mostrar texto con efecto typing
          setTimeout(() => {
            showDedicationText();
            // Mostrar petalos flotando
            startFloatingObjects();
            // Mostrar cuenta regresiva
            showCountdown();
          }, 1200); //Tiempo para agrandar el SVG
        }, totalDuration);
      }, 50);

      // Selecciona los corazones (formas rojas)
      const heartPaths = allPaths.filter(el => {
        const style = el.getAttribute('style') || '';
        return style.includes('#FC6F58') || style.includes('#C1321F');
      });
      heartPaths.forEach(path => {
        path.classList.add('animated-heart');
      });
    });
}

// Efecto máquina de escribir para el texto de dedicatoria (seguidores)
function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() { //seguidores
  let text = getURLParam('text');
  if (!text) {
    text = `Para inmortalizar mis palabras:\n\nPrometo cuidarte y hacerte sentir segura, demostrandote cada día que todavía se puede confiar en el amor.\n\nAmo todo lo que conozco de vos y me encanta seguir descubriendo cada parte de quien sos.`;  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      // Al terminar el typing, mostrar la firma animada
      setTimeout(showSignature, 600);
    }
  }
  type();
}

// Firma manuscrita animada
function showSignature() {
  // Cambia para buscar la firma dentro del contenedor de dedicatoria
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Con mucho amor, Gabi de Mica";
  signature.classList.add('visible');
}



// Controlador de objetos flotantes
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    // Posición inicial
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    // Animación flotante
    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    // Eliminar después de animar
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    // Generar más objetos
    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

// Cuenta regresiva o fecha especial
function showCountdown() {
  const container = document.getElementById('countdown');
  let startParam = getURLParam('start');
  let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date('2026-06-12T18:25:00');

  function update() {
    const now = new Date();
    let diff = now - startDate;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));

    container.innerHTML =
      `Ya pasaron <b>${days}</b> días de nuestra primer merienda y sigo eligiendo compartir mi tiempo contigo <br>`;
    container.classList.add('visible');
  }
  update();
  setInterval(update, 1000);
}

// --- Música de fondo ---
// Permite elegir el archivo con ?musica=nombre.mp3
function aplicarMusicaDeURL(audio) {
  let musicaParam = getURLParam('musica');
  if (!musicaParam) return;
  // Decodifica y previene rutas maliciosas
  musicaParam = decodeURIComponent(musicaParam).replace(/[^\w\d .\-]/g, '');
  const nuevaSrc = 'Music/' + musicaParam;
  if (!audio.src.endsWith(nuevaSrc)) audio.src = nuevaSrc;
}

function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;
  // Esta función se llama al cargar y otra vez tras la animación: inicializar solo una vez
  if (audio.dataset.init) return;
  audio.dataset.init = '1';

  aplicarMusicaDeURL(audio);

  // --- Opción YouTube (solo mensaje de ayuda) ---
  let youtubeParam = getURLParam('youtube');
  if (youtubeParam) {
    // Muestra mensaje de ayuda para descargar el audio
    let helpMsg = document.getElementById('yt-help-msg');
    if (!helpMsg) {
      helpMsg = document.createElement('div');
      helpMsg.id = 'yt-help-msg';
      helpMsg.style.position = 'fixed';
      helpMsg.style.right = '18px';
      helpMsg.style.bottom = '180px';
      helpMsg.style.background = 'rgba(255,255,255,0.95)';
      helpMsg.style.color = '#e60026';
      helpMsg.style.padding = '10px 16px';
      helpMsg.style.borderRadius = '12px';
      helpMsg.style.boxShadow = '0 2px 8px #e6002633';
      helpMsg.style.fontSize = '1.05em';
      helpMsg.style.zIndex = 100;
      helpMsg.innerHTML = 'Para usar música de YouTube, descarga el audio (por ejemplo, usando y2mate, 4K Video Downloader, etc.), colócalo en la carpeta <b>Music</b> y usa la URL así:<br><br><code>?musica=nombre.mp3</code>';
      document.body.appendChild(helpMsg);
      setTimeout(() => { if(helpMsg) helpMsg.remove(); }, 15000);
    }
  }

  audio.volume = 0.7;
  audio.loop = true;

  // Aviso si el archivo de audio no se puede cargar
  audio.addEventListener('error', () => {
    console.warn('No se pudo cargar el audio:', audio.currentSrc || audio.src);
  });

  // Intentar reproducir inmediatamente
  const intentarReproducir = () => audio.play()
    .then(() => true)
    // El navegador bloquea el autoplay hasta que el usuario interactúe
    .catch(() => false);

  intentarReproducir().then(ok => {
    if (ok) return;
    // Reintentar con el primer gesto del usuario (click, toque o tecla)
    const eventos = ['pointerdown', 'touchstart', 'keydown'];
    const quitarListeners = () => eventos.forEach(ev =>
      document.removeEventListener(ev, desbloquear));
    const desbloquear = () => {
      audio.play().then(quitarListeners).catch(() => {});
    };
    eventos.forEach(ev => document.addEventListener(ev, desbloquear));
  });

}

// --- Pista de desplazamiento hacia el mapa ---
function mostrarPistaDeScroll() {
  const pista = document.getElementById('scroll-hint');
  const mapa = document.getElementById('pantalla-mapa');
  if (!pista || !mapa) return;

  // Aparece una vez terminada la animacion del arbol
  setTimeout(() => pista.classList.add('visible'), 6000);

  pista.addEventListener('click', () => mapa.scrollIntoView({ behavior: 'smooth' }));

  // Se esconde apenas se empieza a desplazar
  const alDesplazar = () => {
    if (window.scrollY > 40) {
      pista.classList.remove('visible');
      window.removeEventListener('scroll', alDesplazar);
    }
  };
  window.addEventListener('scroll', alDesplazar, { passive: true });
}

// --- Arranque ---
// Los navegadores bloquean el audio con sonido hasta que el usuario interactúa.
// Se intenta reproducir apenas carga la página; si el navegador lo permite, la
// portada desaparece sola y todo empieza solo. Si lo bloquea, el primer toque
// sobre la portada inicia la música y la animación al mismo tiempo.
window.addEventListener('DOMContentLoaded', () => {
  const portada = document.getElementById('intro-gate');
  const audio = document.getElementById('bg-music');
  let comenzado = false;

  const comenzar = () => {
    if (comenzado) return;
    comenzado = true;
    // play() va primero y de forma síncrona: iOS exige que la reproducción
    // se pida dentro del mismo gesto del usuario.
    playBackgroundMusic();
    if (portada) {
      portada.classList.add('oculto');
      setTimeout(() => portada.remove(), 600);
    }
    // Recien ahora se habilita el desplazamiento hacia el mapa
    document.body.classList.remove('sin-scroll');
    cargarArbol();
    mostrarPistaDeScroll();
  };

  if (portada) portada.addEventListener('click', comenzar);
  document.addEventListener('keydown', comenzar, { once: true });

  // Intento de autoplay: si el navegador lo permite, no hace falta tocar nada.
  if (audio) {
    audio.volume = 0.7;
    aplicarMusicaDeURL(audio);
    audio.play().then(() => {
      // Suena: se sigue reproduciendo sin cortes y arranca todo lo demás.
      comenzar();
    }).catch(() => {
      // Autoplay bloqueado: queda la portada esperando el primer toque.
    });
  }
});
