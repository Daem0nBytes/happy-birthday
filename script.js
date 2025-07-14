const greetingText = document.getElementById("greetingText");
const arrowDown = document.querySelector("#section-1 .arrow.down");

// ✨ Adjust fade speed here
const fadeSpeed = 200; // milliseconds per letter

const greeting = "Happy Birthday, ";
const lovePart = "My Love ♥";

function createFadingGreeting() {
  let delay = 1250;
  // Add greeting part
  for (let char of greeting) {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char; // Non-breaking space to preserve spacing
    span.style.animationDelay = `${delay / 1000}s`;
    greetingText.appendChild(span);
    delay += fadeSpeed;
  }

  // Add love part with red style
  for (let char of lovePart) {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.classList.add("my-love");
    span.style.animationDelay = `${delay / 1000}s`;
    greetingText.appendChild(span);
    delay += fadeSpeed;
  }

  setTimeout(() => {
    arrowDown.style.opacity = 1;
    musicToggle.style.opacity = 1;

  }, delay + 1000);
}

function startLoveSequence(delay = 3000) {
  const words = ["eyes", "smile", "voice", "laugh", "cuteness", "kindness", "heart", "love", "energy", "soul", "Everything!"];
  const wordEl = document.getElementById("loveWord");
  const prefixEl = document.getElementById("lovePrefix");

  let index = 0;

  prefixEl.style.opacity = 0;
  wordEl.style.opacity = 0;

  // Fade in prefix slowly starting at 1s
  setTimeout(() => {
    prefixEl.style.opacity = 1;
  }, 1000);

  // Start first word fade-in at 3s (1s fade-in prefix + 2s pause)
  setTimeout(() => {
    const showNextWord = () => {
      wordEl.style.opacity = 0;

      setTimeout(() => {
        wordEl.textContent = words[index];
        wordEl.style.opacity = 1;
        index++;

        if (index < words.length) {
          setTimeout(showNextWord, delay);
        } else {
          enableSec3DownArrow();
        }
      }, 500);
    };

    showNextWord();
  }, 3000);
}

// start sequence only when #section-3 is at least 50% visible
const section3 = document.getElementById("section-3");
let loveSequenceStarted = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !loveSequenceStarted) {
      loveSequenceStarted = true;
      startLoveSequence(3000); // 3 sec delay between words
      observer.unobserve(section3);
    }
  });
}, {
  root: null,
  threshold: 0.5,
});

observer.observe(section3);



function enableSec3DownArrow() {
  const arrow = document.getElementById("sec-3-love-words-arrow");
  if (arrow) {
    arrow.style.opacity = "1";
  } else {
    console.warn("Element with ID 'sec-3-love-words-arrow' not found.");
  }
}

function scrollToSection(n, duration = 2500) {
  const target = document.getElementById(`section-${n}`);
  if (!target) {
    console.warn(`No section found with id section-${n}`);
    return;
  }
  console.log(`Scrolling to section-${n}`);

  const targetY = target.offsetTop;
  const startY = window.scrollY || window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutQuad(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function enableScrollWheel() {
  window.removeEventListener("wheel", preventScroll, { passive: false });
}

function preventScroll(e) {
  e.preventDefault();
}

window.addEventListener("wheel", preventScroll, { passive: false });




function startHeartRain(sectionId) {
  const section = document.getElementById(sectionId);
  const heartContainer = document.createElement("div");
  heartContainer.className = "heart-container";
  section.appendChild(heartContainer);

  const maxHearts = 20; // upper limit to prevent lag
  let activeHearts = [];

  function createHeart() {
    if (activeHearts.length >= maxHearts) return;

    const heart = document.createElement("div");
    heart.className = "heart-particle";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDuration = 4 + Math.random() * 3 + "s";
    heart.style.fontSize = (16 + Math.random() * 12) + "px";
    heart.style.opacity = Math.random() * 0.5 + 0.5;

    heart.innerHTML = `<i class="fa-solid fa-heart"></i>`;
    heartContainer.appendChild(heart);
    activeHearts.push(heart);

    // Remove after animation
    heart.addEventListener("animationend", () => {
      heart.remove();
      activeHearts = activeHearts.filter(h => h !== heart);
    });
  }

  // Spawn new hearts continuously
  setInterval(createHeart, 400); // every 0.4s (tweak as needed)
}



const section4 = document.getElementById("section-4");
let heartRainStarted = false;

const observer4 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !heartRainStarted) {
      heartRainStarted = true;
      startHeartRain("section-4");
      enableScrollWheel(); // 🔓 Allow scroll again!
    }
  });
}, {
  root: null,
  threshold: 0.5,
});

observer4.observe(section4);








// ---------------- BG AUDIO PART ----------------

const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = musicToggle.querySelector("i");

let isMuted = false;
let volumeStep = 0.05;
let fadeInterval = null;

// Fade in audio
function fadeInAudio(audio, targetVolume = 1, step = volumeStep, interval = 100) {
  clearInterval(fadeInterval);
  audio.volume = 0;
  audio.play();
  fadeInterval = setInterval(() => {
    if (audio.volume < targetVolume) {
      audio.volume = Math.min(audio.volume + step, targetVolume);
    } else {
      clearInterval(fadeInterval);
    }
  }, interval);
}

// Fade out audio
function fadeOutAudio(audio, step = volumeStep, interval = 100) {
  clearInterval(fadeInterval);
  fadeInterval = setInterval(() => {
    if (audio.volume > 0) {
      audio.volume = Math.max(audio.volume - step, 0);
    } else {
      audio.pause();
      clearInterval(fadeInterval);
    }
  }, interval);
}

// Toggle icon + fade
musicToggle.addEventListener("click", () => {
  if (isMuted) {
    fadeInAudio(bgMusic);
    musicIcon.classList.remove("fa-volume-mute");
    musicIcon.classList.add("fa-volume-up");
  } else {
    fadeOutAudio(bgMusic);
    musicIcon.classList.remove("fa-volume-up");
    musicIcon.classList.add("fa-volume-mute");
  }
  isMuted = !isMuted;
});




// Prevent browser from restoring previous scroll position
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// TODO: nothing to do, just a PyCharm reminder :)
// MAIN LISTENER - ONLY UPDATES REQUESTED TIMINGS
window.addEventListener("load", () => {
  window.scrollTo(0, 0);

  const giftCover = document.getElementById("gift-cover");
  const openBtn = document.getElementById("open-gift-btn");

  openBtn.addEventListener("click", () => {
    // 1. Start music (your existing implementation)
    bgMusic.volume = 0;
    bgMusic.play().then(() => {
      fadeInAudio(bgMusic, 1);
    }).catch((err) => {
      console.warn("Autoplay blocked:", err);
    });

    // 2. Apply 3-second fade (your requested duration)
    giftCover.style.transition = "opacity 3s ease"; // Explicit transition
    giftCover.style.opacity = "0";

    // 3. Hide after fade (your existing flow)
    setTimeout(() => {
      giftCover.style.display = "none";
      createFadingGreeting();
    }, 3000); // Matches CSS transition
  });
});

const section2 = document.getElementById("section-2");
let section2ArrowShown = false;

const observer2 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !section2ArrowShown) {
      section2ArrowShown = true;
      setTimeout(() => {
        const arrow = document.getElementById("sec-2-arrow");
        if (arrow) arrow.style.opacity = 1;
      }, 20000); // 5 second delay after becoming visible
      observer2.unobserve(section2);
    }
  });
}, {
  root: null,
  threshold: 0.5,
});

observer2.observe(section2);
