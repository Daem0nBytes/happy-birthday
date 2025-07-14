const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let clouds = [];
let shootingStars = [];

const starCount = 150;
const cloudImages = ["assets/cloud1.png", "assets/cloud2.png", "assets/cloud2.png"];
const loadedClouds = [];

// Load cloud images
let imagesLoaded = 0;

for (let src of cloudImages) {
  const img = new Image();
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === cloudImages.length) {
      init(); // only run once all images are loaded
    }
  };
  img.src = src;
  loadedClouds.push(img);
}


// ========== STARS ==========
function createStars() {
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
      blinkSpeed: Math.random() * 0.02 + 0.005,
      fadeDirection: 1
    });
  }
}

function drawStars() {
  for (let star of stars) {
    star.alpha += star.blinkSpeed * star.fadeDirection;
    if (star.alpha > 1) {
      star.fadeDirection = -1;
      star.alpha = 1;
    } else if (star.alpha < 0.1) {
      star.fadeDirection = 1;
      star.alpha = 0.1;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.fill();
  }
}

// ========== CLOUDS ==========
function spawnCloud() {
  const img = loadedClouds[Math.floor(Math.random() * loadedClouds.length)];
  const scale = Math.random() * 1 + 0.4;
  const width = img.width * scale;
  const height = img.height * scale;

  clouds.push({
    img,
    x: -width,
    y: Math.random() * (canvas.height - height),
    speed: .225 + Math.random() * 0.3,
    width,
    height,
    // flipped: Math.random() < 0.5 Not functional
  });
}

function spawnInitialClouds(count1 = 0, count2 = 0) {
  const spawnCloudType = (imgIndex, count) => {
    for (let i = 0; i < count; i++) {
      const img = loadedClouds[imgIndex];
      const scale = Math.random() * 1 + 0.4;
      const width = img.width * scale;
      const height = img.height * scale;

      clouds.push({
        img,
        x: Math.random() * (canvas.width - width) - 500,
        y: Math.random() * (canvas.height - height),
        speed: .2 + Math.random() * 0.3,
        width,
        height,
        // flipped: Math.random() < 0.5 Not functional
      });
    }
  };

  spawnCloudType(0, count1); // spawn cloud1.png
  spawnCloudType(1, count2); // spawn cloud2.png
}


function drawClouds() {
  clouds.forEach((cloud, index) => {
    ctx.globalAlpha = 0.2;
    ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
    ctx.globalAlpha = 1;

    cloud.x += cloud.speed;
    if (cloud.x > canvas.width + cloud.width) {
      clouds.splice(index, 1);
    }
  });
}


// ========== SHOOTING STARS ==========
function spawnShootingStar() {
  const size = 4 + Math.random() * 3;
  const startX = -100;
  const startY = Math.random() * canvas.height * 0.4;

  shootingStars.push({
    x: startX,
    y: startY,
    vx: 7 + Math.random() * 3,
    vy: 3 + Math.random() * 2,
    size,
    trail: [],
    life: 0
  });

  scheduleNextShootingStar(); // for randomized timing
}

function drawShootingStars() {
  shootingStars.forEach((star, index) => {
    star.trail.unshift({ x: star.x, y: star.y, life: star.life });
    if (star.trail.length > 40) star.trail.pop();

    star.x += star.vx;
    star.y += star.vy;
    star.life += 1;

    for (let i = 0; i < star.trail.length; i++) {
      const t = star.trail[i];
      const fade = 1 - i / star.trail.length;
      const glow = fade * 25;

      ctx.beginPath();
      ctx.arc(t.x, t.y, star.size * fade, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${fade * 0.5})`;
      ctx.shadowBlur = glow;
      ctx.shadowColor = 'rgba(255,255,255,0.8)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (star.x > canvas.width + 150 || star.y > canvas.height + 100) {
      shootingStars.splice(index, 1);
    }
  });
}

// Randomized shooting star every 5–10 seconds
function scheduleNextShootingStar() {
  const nextIn = Math.random() * 10000 + 7500; // 10s-15s
  setTimeout(spawnShootingStar, nextIn);
}

// ========== ANIMATION ==========
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStars();
  drawClouds();
  drawShootingStars();
  requestAnimationFrame(animate);
  console.log(clouds);
}

function init() {
  createStars();  // draw the flashing stars. Note: maybe change the 150 value
  // spawnInitialClouds(2, 3); // creating initial clouds
  animate();
  setInterval(spawnCloud, 17500); // cloud every 17.5 seconds
  scheduleNextShootingStar();    // start shooting stars
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = [];
  clouds = [];
  shootingStars = [];
  createStars();
});
