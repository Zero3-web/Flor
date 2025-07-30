window.addEventListener('DOMContentLoaded', function() {
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
  const messages = [
    'Esta flor es para ti',
    'Te quiero mucho',
    'Gracias por todo',
    '¡Eres especial!',
    '¡Feliz dia ❤️!'
  ];
  var wrapper = document.querySelector('.wrapper');
  var msg = document.querySelector('.flower-message');
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
      music.play();
    }
    setTimeout(function() {
      var galaxyCanvas = document.getElementById('galaxy-canvas');
      galaxyCanvas.style.display = '';
      galaxyCanvas.width = window.innerWidth;
      galaxyCanvas.height = window.innerHeight;
      var ctx = galaxyCanvas.getContext('2d');
      var numDots = 120;
      var dots = [];
      var dotsToAdd = 0;
      var isMobile = window.innerWidth <= 600;
      var minDotSize = isMobile ? 1.7 : 0.7;
      var maxDotSize = isMobile ? 2.7 : 1.7;
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
          setTimeout(addDot, 18);
        }
      }
      addDot();
      function animateGalaxy() {
        ctx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);
        for (let dot of dots) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.r, 0, 2*Math.PI);
          ctx.fillStyle = `rgba(255, 182, 193, ${dot.alpha})`;
          ctx.shadowColor = 'rgba(255,182,193,0.7)';
          ctx.shadowBlur = 8;
          ctx.fill();
          dot.x += dot.dx;
          dot.y += dot.dy;
          if (dot.x < 0) dot.x = galaxyCanvas.width;
          if (dot.x > galaxyCanvas.width) dot.x = 0;
          if (dot.y < 0) dot.y = galaxyCanvas.height;
          if (dot.y > galaxyCanvas.height) dot.y = 0;
        }
        requestAnimationFrame(animateGalaxy);
      }
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
        }
      }
      showNext();
    }, 300);
  });
});
