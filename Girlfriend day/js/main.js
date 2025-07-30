window.addEventListener('DOMContentLoaded', function() {
  // Efecto typing en el botón al inicio
  var startBtn = document.getElementById('start-btn');
  var btnText = 'Presioname';
  startBtn.textContent = '';
  startBtn.disabled = true;
  let iBtn = 0;
  
  function typeBtn() {
    if (iBtn < btnText.length) {
      startBtn.textContent += btnText.charAt(iBtn);
      iBtn++;
      setTimeout(typeBtn, 90);
    } else {
      startBtn.disabled = false;
    }
  }
  typeBtn();
  
  // Followers - Cambiar mensajes
  const messages = [
    'Esta flor es para ti',
    'Te quiero mucho',
    'Gracias por todo',
    '¡Eres especial!',
    '¡Feliz dia ❤️!'
  ];
  
  var wrapper = document.querySelector('.wrapper');
  var msg = document.querySelector('.flower-message');
  
  // Centra el contenedor con JS
  var container = document.getElementById('start-btn-container');
  container.style.position = 'fixed';
  container.style.top = '50%';
  container.style.left = '50%';
  container.style.transform = 'translate(-50%,-50%)';
  container.style.zIndex = '100';

  startBtn.addEventListener('click', function() {
    container.style.display = 'none';
    wrapper.style.display = '';
    msg.style.display = '';
    // Reproducir música
    var music = document.getElementById('bg-music');
    if (music) {
      music.currentTime = 0;
      var playPromise = music.play();
      if (playPromise !== undefined) {
        playPromise.catch(function(error) {
          alert('No se pudo reproducir la música. Verifica el archivo o permisos del navegador.');
        });
      }
    }
    // Mostrar el canvas de galaxia después de 2 segundos
    setTimeout(function() {
      var galaxyCanvas = document.getElementById('galaxy-canvas');
      galaxyCanvas.style.display = '';
      galaxyCanvas.width = window.innerWidth;
      galaxyCanvas.height = window.innerHeight;
      var ctx = galaxyCanvas.getContext('2d');
      var numDots = 120;
      var dots = [];
      var dotsToAdd = 0;
      // Detect mobile (screen width <= 600px)
      var isMobile = window.innerWidth <= 600;
      var minDotSize = isMobile ? 0.5 : 0.7;
      var maxDotSize = isMobile ? 1.1 : 1.7;

      // Web Audio API para analizar el volumen
      var audio = document.getElementById('bg-music');
      var audioCtx, analyser, dataArray;
      if (window.AudioContext && audio) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var source = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 64;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
      }

      function addDot() {
        if (dotsToAdd < numDots) {
          let angle = Math.random() * 2 * Math.PI;
          let radius = Math.random() * (galaxyCanvas.width/2.2);
          let x = galaxyCanvas.width/2 + Math.cos(angle) * radius;
          let y = galaxyCanvas.height/2 + Math.sin(angle) * radius;
          let speed = 0.2 + Math.random() * 0.7;
          let dir = Math.random() * 2 * Math.PI;
          let dotSize = minDotSize + Math.random() * (maxDotSize - minDotSize);
          dots.push({x, y, r: dotSize, dx: Math.cos(dir)*speed, dy: Math.sin(dir)*speed, alpha: 0.5+Math.random()*0.5});
          dotsToAdd++;
          setTimeout(addDot, 18); // speed of appearance
        }
      }
      addDot();
      function animateGalaxy() {
        ctx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);
        let hue = 55; // amarillo
        let speedFactor = 1;
        if (analyser && dataArray) {
          analyser.getByteFrequencyData(dataArray);
          // Calcula el volumen promedio
          let avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          // Cambia el color según el volumen (más volumen = más rojo)
          // Si quieres que el amarillo varíe, puedes usar:
          // hue = 55 + Math.min(40, avg);
          // Ajusta la velocidad según el volumen (más volumen = más rápido)
          speedFactor = 0.7 + (avg / 255) * 2.5; // rango de velocidad
        }
        for (let dot of dots) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.r, 0, 2*Math.PI);
          ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${dot.alpha})`;
          ctx.shadowColor = `hsla(${hue},80%,70%,0.7)`;
          ctx.shadowBlur = 8;
          ctx.fill();
          dot.x += dot.dx * speedFactor;
          dot.y += dot.dy * speedFactor;
          // wrap around edges
          if (dot.x < 0) dot.x = galaxyCanvas.width;
          if (dot.x > galaxyCanvas.width) dot.x = 0;
          if (dot.y < 0) dot.y = galaxyCanvas.height;
          if (dot.y > galaxyCanvas.height) dot.y = 0;
        }
        requestAnimationFrame(animateGalaxy);
      }
      // Fade in suavemente
      setTimeout(function() {
        galaxyCanvas.style.opacity = '1';
      }, 50);
      animateGalaxy();
    }, 2000);
    
    setTimeout(function() {
      msg.style.opacity = 1;
      let current = 0;
      
      function typeText(text, cb) {
        msg.textContent = '';
        let i = 0;
        function type() {
          if (i < text.length) {
            msg.textContent += text.charAt(i);
            i++;
            setTimeout(type, 90);
          } else if (cb) {
            setTimeout(cb, 1000);
          }
        }
        type();
      }
      
      function showNext() {
        if (current < messages.length) {
          typeText(messages[current], function() {
            current++;
            showNext();
          });
        } else {
          // Animar los puntitos para formar un corazón
          if (typeof animateHeart === 'function') animateHeart();
        }
      }
      showNext();
      // Animación para formar un corazón con los puntitos
      function animateHeart() {
        // Posición del corazón debajo del texto
        var heartCenterX = galaxyCanvas.width / 2;
        var heartCenterY = msg.getBoundingClientRect().bottom - galaxyCanvas.getBoundingClientRect().top + 80;
        var heartSize = Math.min(galaxyCanvas.width, galaxyCanvas.height) / 7;
        // Generar posiciones de corazón (paramétricas)
        var heartPositions = [];
        for (let i = 0; i < dots.length; i++) {
          let t = Math.PI * 2 * (i / dots.length);
          // Fórmula paramétrica de corazón
          let x = heartCenterX + heartSize * 16 * Math.pow(Math.sin(t), 3);
          let y = heartCenterY - heartSize * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          heartPositions.push({x, y});
        }
        // Animar cada puntito hacia su posición de corazón
        let steps = 60;
        let step = 0;
        function moveDotsToHeart() {
          for (let i = 0; i < dots.length; i++) {
            let dot = dots[i];
            let target = heartPositions[i];
            dot.x += (target.x - dot.x) / (steps - step + 1);
            dot.y += (target.y - dot.y) / (steps - step + 1);
          }
          step++;
          if (step < steps) {
            requestAnimationFrame(moveDotsToHeart);
          }
        }
        moveDotsToHeart();
      }
    }, 300);
  });
});
