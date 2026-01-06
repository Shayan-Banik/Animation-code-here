const player = document.getElementById("player");
      const gameCanvas = document.getElementById("gameCanvas");
      const scoreDisplay = document.getElementById("score");
      const startOverlay = document.getElementById("startOverlay");
      const startButton = document.getElementById("startButton");

      let playerY = 0;
      let velocityY = 0;
      let isJumping = false;
      let score = 0;
      let gameStarted = false;
      let gameOver = false;
      let gameSpeed = 3;
      let obstacleInterval;
      let coinInterval;
      let scoreInterval;
      let jumpCount = 0;
      let maxJumps = 5;

      const gravity = 0.6;
      const jumpStrength = -12;
      const groundLevel = 100;

      const obstacles = [];
      const coins = [];

      // Create clouds
      for (let i = 0; i < 3; i++) {
        const cloud = document.createElement("div");
        cloud.className = "cloud";
        cloud.style.width = 80 + Math.random() * 40 + "px";
        cloud.style.height = 40 + Math.random() * 20 + "px";
        cloud.style.left = Math.random() * 100 + "%";
        cloud.style.top = Math.random() * 30 + "%";
        cloud.style.animationDuration = 15 + Math.random() * 10 + "s";
        cloud.style.animationDelay = Math.random() * 5 + "s";
        gameCanvas.appendChild(cloud);
      }

      // Create ground decorations
      for (let i = 0; i < 5; i++) {
        const decoration = document.createElement("div");
        decoration.className = "ground-decoration";
        decoration.textContent = "🌿";
        decoration.style.left = Math.random() * 100 + "%";
        decoration.style.animationDelay = Math.random() * 4 + "s";
        gameCanvas.appendChild(decoration);
      }

      startButton.addEventListener("click", () => {
        startGame();
      });

      function startGame() {
        gameStarted = true;
        gameOver = false;
        score = 0;
        playerY = 0;
        velocityY = 0;
        isJumping = false;
        jumpCount = 0;
        gameSpeed = 3;
        scoreDisplay.textContent = "Score: 0";
        startOverlay.classList.add("hidden");

        // Clear existing obstacles and coins
        obstacles.forEach((obs) => obs.element.remove());
        coins.forEach((coin) => coin.element.remove());
        obstacles.length = 0;
        coins.length = 0;

        // Start spawning
        spawnObstacle();
        spawnCoin();

        obstacleInterval = setInterval(spawnObstacle, 2500);
        coinInterval = setInterval(spawnCoin, 2000);
        scoreInterval = setInterval(() => {
          if (gameStarted && !gameOver) {
            score += 1;
            scoreDisplay.textContent = "Score: " + score;

            // Increase difficulty
            if (score % 50 === 0 && gameSpeed < 6) {
              gameSpeed += 0.3;
            }
          }
        }, 200);

        gameLoop();
      }

      function spawnObstacle() {
        if (!gameStarted || gameOver) return;

        const obstacle = document.createElement("div");
        obstacle.className = "obstacle";
        obstacle.style.animationDuration = gameSpeed + "s";
        gameCanvas.appendChild(obstacle);

        obstacles.push({
          element: obstacle,
          x: window.innerWidth,
          y: groundLevel,
          width: 40,
          height: 60,
        });
      }

      function spawnCoin() {
        if (!gameStarted || gameOver) return;

        const coin = document.createElement("div");
        coin.className = "coin";
        coin.style.animationDuration = gameSpeed + "s";
        coin.style.bottom = 150 + Math.random() * 100 + "px";
        gameCanvas.appendChild(coin);

        coins.push({
          element: coin,
          x: window.innerWidth,
          y: 150 + Math.random() * 100,
          width: 30,
          height: 30,
          collected: false,
        });
      }

      function showGameOver() {
        gameOver = true;
        gameStarted = false;
        clearInterval(obstacleInterval);
        clearInterval(coinInterval);
        clearInterval(scoreInterval);

        startOverlay.innerHTML = `
        <div id="gameOverText">GAME OVER!</div>
        <div id="finalScore">Final Score: ${score}</div>
        <button id="restartButton">🔄 PLAY AGAIN</button>
      `;
        startOverlay.classList.remove("hidden");

        document
          .getElementById("restartButton")
          .addEventListener("click", () => {
            startOverlay.innerHTML =
              '<button id="startButton">🎮 START GAME</button>';
            const newStartButton = document.getElementById("startButton");
            newStartButton.addEventListener("click", startGame);
            startGame();
          });
      }

      let keyPressed = false;

      document.addEventListener("keydown", (e) => {
        if (!gameStarted || gameOver) return;

        if (
          (e.key === "ArrowUp" || e.key === " ") &&
          !keyPressed &&
          jumpCount < maxJumps
        ) {
          e.preventDefault();
          velocityY = jumpStrength;
          isJumping = true;
          keyPressed = true;
          jumpCount++;
        }
      });

      document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowUp" || e.key === " ") {
          keyPressed = false;
        }
      });

      function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
      }

      function gameLoop() {
        if (!gameStarted || gameOver) return;

        // Gravity
        velocityY += gravity;
        playerY -= velocityY;

        // Ground collision
        if (playerY <= 0) {
          playerY = 0;
          velocityY = 0;
          isJumping = false;
          jumpCount = 0; // Reset jump count when landing
        }

        // Update player position
        player.style.bottom = groundLevel + playerY + "px";

        // Update and check obstacles
        obstacles.forEach((obstacle, index) => {
          const rect = obstacle.element.getBoundingClientRect();
          obstacle.x = rect.left;

          // Check collision with player
          const playerRect = player.getBoundingClientRect();
          if (
            checkCollision(
              playerRect.left,
              playerRect.top,
              playerRect.width,
              playerRect.height,
              rect.left,
              rect.top,
              rect.width,
              rect.height
            )
          ) {
            showGameOver();
          }

          // Remove if off screen
          if (obstacle.x < -100) {
            obstacle.element.remove();
            obstacles.splice(index, 1);
          }
        });

        // Update and check coins
        coins.forEach((coin, index) => {
          if (coin.collected) return;

          const rect = coin.element.getBoundingClientRect();
          coin.x = rect.left;

          // Check collection
          const playerRect = player.getBoundingClientRect();
          if (
            checkCollision(
              playerRect.left,
              playerRect.top,
              playerRect.width,
              playerRect.height,
              rect.left,
              rect.top,
              rect.width,
              rect.height
            )
          ) {
            coin.element.remove();
            coin.collected = true;
            score += 10;
            scoreDisplay.textContent = "Score: " + score;
          }

          // Remove if off screen
          if (coin.x < -100) {
            coin.element.remove();
            coins.splice(index, 1);
          }
        });

        requestAnimationFrame(gameLoop);
      }