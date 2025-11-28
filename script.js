let inputDir = { x: 0, y: 0 };
const moveSound = new Audio("move.mp3");
const foodSound = new Audio("food.mp3");
const gameOverSound = new Audio("gameover.mp3");

let speed = 5;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let score = 0;

// --------------------- GAME LOOP ---------------------
function main(ctime) {
    window.requestAnimationFrame(main);

    // Use speed correctly (fix)
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;

    gameEngine();
}

// --------------------- COLLISION ---------------------
function collide(snake) {
    // Snake hits itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // Snake hits wall
    if (
        snake[0].x >= 18 ||
        snake[0].x <= 0 ||
        snake[0].y >= 18 ||
        snake[0].y <= 0
    ) {
        return true;
    }

    return false;
}

// --------------------- GAME ENGINE ---------------------
function gameEngine() {

    // 1) Updating the snake & food
    if (collide(snakeArr)) {
        gameOverSound.play();
        inputDir = { x: 0, y: 0 };
        console.log("Game Over (Press Ctrl + R to restart)");

        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scorebox.innerHTML = "Score: " + score;

        food = { x: 6, y: 7 };
    }

    // If snake eats food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score++;

        scorebox.innerHTML = "Score: " + score;

        // Update high score
        if (score > hiscore) {
            hiscore = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscore));
            hiscorebox.innerHTML = "Hiscore: " + hiscore;
        }

        // Add new segment
        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y
        });

        // Randomize food
        let a = 2, b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
    }

    // Move the snake body
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    // Move head
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // 2) Display snake and food
    let playArea = document.getElementById("playArea");
    playArea.innerHTML = "";

    // Draw snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? "head" : "snake");
        playArea.appendChild(snakeElement);
    });

    // Draw food
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    playArea.appendChild(foodElement);
}

// --------------------- HIGH SCORE LOGIC ---------------------
let hiscore = localStorage.getItem("hiscore");

if (hiscore === null) {
    hiscore = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscore));
} else {
    hiscore = JSON.parse(hiscore);
}

hiscorebox.innerHTML = "Hiscore: " + hiscore;

// --------------------- START GAME ---------------------
window.requestAnimationFrame(main);

// --------------------- CONTROLS ---------------------
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) {
                inputDir = { x: 0, y: -1 };
            }
            break;

        case "ArrowDown":
            if (inputDir.y !== -1) {
                inputDir = { x: 0, y: 1 };
            }
            break;

        case "ArrowRight":
            if (inputDir.x !== -1) {
                inputDir = { x: 1, y: 0 };
            }
            break;

        case "ArrowLeft":
            if (inputDir.x !== 1) {
                inputDir = { x: -1, y: 0 };
            }
            break;

        default:
            break;
    }
});
