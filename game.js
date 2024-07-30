// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const cellSize = 40;
const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);
let maze = createMaze(rows, cols);
let stickmen = [];
let bullets = [];
let player = { x: canvas.width / 2, y: canvas.height / 2 };

class Stickman {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.size = 10;
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
        this.size = 20 - (this.y / canvas.height) * 10; // 거리 따라 크기 조정
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 5;
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
}

function createMaze(rows, cols) {
    // 미로 생성 알고리즘 (예: Depth-first search)
    let maze = [];
    for (let y = 0; y < rows; y++) {
        maze[y] = [];
        for (let x = 0; x < cols; x++) {
            maze[y][x] = true; // 벽으로 초기화
        }
    }

    function carvePassagesFrom(cx, cy) {
        let directions = shuffle([[1, 0], [-1, 0], [0, 1], [0, -1]]);
        for (let direction of directions) {
            let nx = cx + direction[0];
            let ny = cy + direction[1];
            let nnx = cx + direction[0] * 2;
            let nny = cy + direction[1] * 2;
            if (nnx >= 0 && nny >= 0 && nnx < cols && nny < rows && maze[nny][nnx]) {
                maze[ny][nx] = false;
                maze[nny][nnx] = false;
                carvePassagesFrom(nnx, nny);
            }
        }
    }

    carvePassagesFrom(1, 1);
    return maze;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function drawMaze() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[y][x]) {
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

function createStickmen() {
    for (let i = 0; i < 10; i++) {
        stickmen.push(new Stickman(Math.random() * canvas.width, Math.random() * canvas.height, 2));
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawMaze();
    stickmen.forEach(stickman => {
        stickman.update();
        stickman.draw();
    });

    bullets.forEach((bullet, index) => {
        bullet.update();
        bullet.draw();
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });

    requestAnimationFrame(update);
}

createStickmen();
update();

window.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        bullets.push(new Bullet(player.x, player.y));
    }
});

document.getElementById('shoot').addEventListener('click', () => {
    bullets.push(new Bullet(player.x, player.y));
});
