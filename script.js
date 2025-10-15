const card = document.querySelector('.card');
const confettiCanvas = document.getElementById('confetti');
const confettiCtx = confettiCanvas.getContext('2d');
let pieces = [];
let numberOfPieces = 150;
let lastUpdateTime = 0;
let animationRunning = false;

function setCanvasSize() {
    confettiCanvas.width = confettiCanvas.offsetWidth;
    confettiCanvas.height = confettiCanvas.offsetHeight;
}

function randomColor() {
    let colors = ['#667eea', '#764ba2', '#f093fb', '#ff6b6b', '#ffd166', '#4facfe', '#00f2fe', '#ff9a9e', '#fad0c4'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function randomShape() {
    return Math.floor(Math.random() * 3); // 0: square, 1: circle, 2: heart
}

function update() {
    let now = Date.now(),
        dt = now - lastUpdateTime;

    for (let i = pieces.length - 1; i >= 0; i--) {
        let p = pieces[i];

        if (p.y > confettiCanvas.height) {
            pieces.splice(i, 1);
            continue;
        }

        p.y += p.gravity * dt;
        p.x += Math.sin(p.y / 50) * p.drift;
        p.rotation += p.rotationSpeed * dt;
        p.opacity = Math.max(0, Math.min(1, 1 - (p.y / confettiCanvas.height) * 0.5));
    }

    lastUpdateTime = now;

    if (animationRunning && pieces.length < numberOfPieces) {
        for (let i = pieces.length; i < numberOfPieces; i++) {
            pieces.push(createPiece(Math.random() * confettiCanvas.width, -20));
        }
    }
}

function draw() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    pieces.forEach(p => {
        confettiCtx.save();
        confettiCtx.globalAlpha = p.opacity;
        confettiCtx.fillStyle = p.color;
        confettiCtx.translate(p.x + p.size / 2, p.y + p.size / 2);
        confettiCtx.rotate(p.rotation);

        if (p.shape === 0) {
            // Square
            confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === 1) {
            // Circle
            confettiCtx.beginPath();
            confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            confettiCtx.fill();
        } else {
            // Heart
            drawHeart(confettiCtx, 0, 0, p.size);
        }

        confettiCtx.restore();
    });
}

function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.2, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.fill();
}

function createPiece(x, y) {
    return {
        x: x,
        y: y,
        size: (Math.random() * 0.5 + 0.75) * 12,
        gravity: (Math.random() * 0.3 + 0.6) * 0.08,
        rotation: (Math.random() * 360) * Math.PI / 180,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        drift: (Math.random() - 0.5) * 0.5,
        opacity: 1,
        color: randomColor(),
        shape: randomShape()
    };
}

function animate() {
    requestAnimationFrame(animate);
    update();
    draw();
}

// Reveal message on click
card.addEventListener('click', () => {
    const hiddenMessage = document.getElementById('hidden-message');

    if (!hiddenMessage.classList.contains('visible')) {
        hiddenMessage.classList.add('visible');

        if (!animationRunning) {
            animationRunning = true;
            setCanvasSize();
            lastUpdateTime = Date.now();
            for (let i = 0; i < numberOfPieces; i++) {
                pieces.push(createPiece(Math.random() * confettiCanvas.width, Math.random() * confettiCanvas.height));
            }
            animate();
        }
    }
});


// Create sparkle effect on background
function createSparkles() {
    const sparkleContainer = document.createElement('div');
    sparkleContainer.className = 'sparkles';
    document.body.appendChild(sparkleContainer);

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 2 + 's';
            sparkle.style.animationDuration = (Math.random() * 2 + 1) + 's';
            sparkleContainer.appendChild(sparkle);
        }, i * 50);
    }
}

createSparkles();


window.addEventListener('resize', setCanvasSize);
setCanvasSize();