import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '~/components/theme-provider';
import { readBestScore, writeBestScore } from './storage';
import styles from './developer-terminal-quest.module.css';

const COLUMNS = 20;
const ROWS = 16;
const CELL_SIZE = 20;
const ACHIEVEMENT_SCORE = 50;

const initialSnake = () => [
  { x: 7, y: 8 },
  { x: 6, y: 8 },
  { x: 5, y: 8 },
];

function createFood(snake) {
  const available = [];
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLUMNS; x += 1) {
      if (!snake.some(segment => segment.x === x && segment.y === y)) {
        available.push({ x, y });
      }
    }
  }
  return available.length
    ? available[Math.floor(Math.random() * available.length)]
    : null;
}

export function CodeSnake({ active, onExit, onBugSlayer }) {
  const { theme, design } = useTheme();
  const boardRef = useRef(null);
  const canvasRef = useRef(null);
  const startRef = useRef(null);
  const resumeRef = useRef(null);
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(() => createFood(initialSnake()));
  const [direction, setDirection] = useState('right');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(readBestScore);
  const [gameStatus, setGameStatus] = useState('ready');
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

  const resetGame = useCallback(() => {
    const freshSnake = initialSnake();
    setSnake(freshSnake);
    setFood(createFood(freshSnake));
    setDirection('right');
    setScore(0);
    setGameStatus('ready');
  }, []);

  useEffect(() => {
    if (!active) {
      setGameStatus(status => (status === 'running' ? 'paused' : status));
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    if (gameStatus === 'ready') startRef.current?.focus();
    if (gameStatus === 'paused') resumeRef.current?.focus();
  }, [active, gameStatus]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return undefined;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBoardSize(current =>
        current.width === width && current.height === height
          ? current
          : { width, height }
      );
    });

    resizeObserver.observe(board);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        setGameStatus(status => (status === 'running' ? 'paused' : status));
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  useEffect(() => {
    if (gameStatus !== 'running' || !active) return undefined;

    const timer = window.setTimeout(() => {
      const head = snake[0];
      const delta = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      }[direction];
      const nextHead = { x: head.x + delta.x, y: head.y + delta.y };
      const eating = nextHead.x === food.x && nextHead.y === food.y;
      const occupied = eating ? snake : snake.slice(0, -1);
      const hitWall =
        nextHead.x < 0 || nextHead.x >= COLUMNS || nextHead.y < 0 || nextHead.y >= ROWS;

      if (
        hitWall ||
        occupied.some(segment => segment.x === nextHead.x && segment.y === nextHead.y)
      ) {
        setGameStatus('over');
        return;
      }

      const nextSnake = [nextHead, ...snake];
      if (!eating) nextSnake.pop();
      setSnake(nextSnake);

      if (eating) {
        const nextScore = score + 10;
        setScore(nextScore);
        if (nextScore > bestScore) {
          setBestScore(nextScore);
          writeBestScore(nextScore);
        }
        if (nextScore >= ACHIEVEMENT_SCORE) onBugSlayer();
        const nextFood = createFood(nextSnake);
        setFood(nextFood);
        if (!nextFood) setGameStatus('won');
      }
    }, 135);

    return () => window.clearTimeout(timer);
  }, [active, bestScore, direction, food, gameStatus, onBugSlayer, score, snake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const { width, height } = boardSize;
    if (!context || !width || !height) return;

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const palette = getComputedStyle(canvas);
    const color = (property, fallback) => {
      context.fillStyle = fallback;
      context.fillStyle = palette.getPropertyValue(property).trim() || fallback;
      return context.fillStyle;
    };
    const boardColor = color('--snake-board-color', '#0b1110');
    const gridColor = color('--snake-grid-color', 'rgba(138, 176, 145, 0.08)');
    const bodyColor = color('--snake-body-color', '#72d53d');
    const headColor = color('--snake-head-color', '#c3ff75');
    const foodColor = color('--snake-food-color', '#f1b86a');
    const foodDetailColor = color('--snake-food-detail', '#5c3d25');

    context.fillStyle = boardColor;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = gridColor;
    context.lineWidth = 1;
    const cellWidth = width / COLUMNS;
    const cellHeight = height / ROWS;
    for (let x = 0; x <= COLUMNS; x += 1) {
      context.beginPath();
      context.moveTo(x * cellWidth, 0);
      context.lineTo(x * cellWidth, height);
      context.stroke();
    }
    for (let y = 0; y <= ROWS; y += 1) {
      context.beginPath();
      context.moveTo(0, y * cellHeight);
      context.lineTo(width, y * cellHeight);
      context.stroke();
    }

    snake.forEach((segment, index) => {
      context.fillStyle = index === 0 ? headColor : bodyColor;
      const insetX = Math.max(1, cellWidth * 0.1);
      const insetY = Math.max(1, cellHeight * 0.1);
      context.fillRect(
        segment.x * cellWidth + insetX,
        segment.y * cellHeight + insetY,
        cellWidth - insetX * 2,
        cellHeight - insetY * 2
      );
    });
    if (food) {
      const foodSize = Math.min(cellWidth, cellHeight) * 0.6;
      const foodX = food.x * cellWidth + (cellWidth - foodSize) / 2;
      const foodY = food.y * cellHeight + (cellHeight - foodSize) / 2;
      context.fillStyle = foodColor;
      context.fillRect(foodX, foodY, foodSize, foodSize);
      context.fillStyle = foodDetailColor;
      context.fillRect(
        foodX + foodSize * 0.25,
        foodY - foodSize * 0.16,
        foodSize * 0.5,
        Math.max(2, foodSize * 0.2)
      );
    }
  }, [boardSize, design, food, snake, theme]);

  useEffect(() => {
    const onKeyDown = event => {
      const controls = {
        ArrowUp: 'up',
        w: 'up',
        W: 'up',
        ArrowDown: 'down',
        s: 'down',
        S: 'down',
        ArrowLeft: 'left',
        a: 'left',
        A: 'left',
        ArrowRight: 'right',
        d: 'right',
        D: 'right',
      };
      const nextDirection = controls[event.key];
      if (
        !nextDirection ||
        gameStatus !== 'running' ||
        !active ||
        !boardRef.current?.contains(document.activeElement)
      )
        return;

      event.preventDefault();
      const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };
      setDirection(current =>
        opposite[current] === nextDirection ? current : nextDirection
      );
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, gameStatus]);

  const changeDirection = nextDirection => {
    const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };
    setDirection(current =>
      opposite[current] === nextDirection ? current : nextDirection
    );
  };

  const startGame = () => {
    if (gameStatus === 'over' || gameStatus === 'won') resetGame();
    setGameStatus('running');
    boardRef.current?.focus();
  };

  return (
    <section
      className={styles.arcade}
      data-theme={theme}
      data-design={design}
      aria-labelledby="code-snake-title"
    >
      <div className={styles.arcadeHeader}>
        <div>
          <p className={styles.arcadeEyebrow}>SECRET ARCADE / JAVA EDITION</p>
          <h3 id="code-snake-title">CODE SNAKE</h3>
        </div>
        <button className={styles.textButton} type="button" onClick={onExit}>
          Exit arcade
        </button>
      </div>

      <div className={styles.gameStats} aria-live="polite">
        <span>
          Score <strong>{score}</strong>
        </span>
        <span>
          Best <strong>{bestScore}</strong>
        </span>
        <span>
          Status <strong>{gameStatus.toUpperCase()}</strong>
        </span>
      </div>

      <button
        type="button"
        className={styles.gameBoard}
        ref={boardRef}
        aria-label={`Code Snake game board. Score ${score}. Use arrow keys or WASD to move.`}
        onKeyDown={event => {
          if (event.key === ' ') {
            event.preventDefault();
            setGameStatus(status =>
              status === 'running' ? 'paused' : status === 'paused' ? 'running' : status
            );
          }
        }}
      >
        <canvas
          ref={canvasRef}
          width={COLUMNS * CELL_SIZE}
          height={ROWS * CELL_SIZE}
          aria-hidden="true"
        />
        {(gameStatus === 'ready' || gameStatus === 'over' || gameStatus === 'won') && (
          <span className={styles.gameOverlay}>
            <strong>
              {gameStatus === 'over'
                ? 'RUN ENDED'
                : gameStatus === 'won'
                ? 'BOARD CLEARED'
                : 'READY WHEN YOU ARE'}
            </strong>
            <span>
              {gameStatus === 'ready'
                ? 'Collect the coffee. Avoid walls and your own code.'
                : `Final score: ${score}`}
            </span>
          </span>
        )}
        {gameStatus === 'paused' && (
          <span className={styles.gameOverlay}>
            <strong>PAUSED</strong>
            <span>Take a breath, then resume the run.</span>
          </span>
        )}
      </button>

      <div className={styles.gameActions}>
        {gameStatus === 'ready' && (
          <button ref={startRef} type="button" onClick={startGame}>
            Start
          </button>
        )}
        {gameStatus === 'running' && (
          <button type="button" onClick={() => setGameStatus('paused')}>
            Pause
          </button>
        )}
        {gameStatus === 'paused' && (
          <button ref={resumeRef} type="button" onClick={() => setGameStatus('running')}>
            Resume
          </button>
        )}
        {(gameStatus === 'over' || gameStatus === 'won') && (
          <button type="button" onClick={startGame}>
            Play Again
          </button>
        )}
        <button type="button" onClick={resetGame}>
          Restart
        </button>
      </div>

      <div className={styles.touchControls} aria-label="Touch controls">
        <button type="button" aria-label="Move up" onClick={() => changeDirection('up')}>
          ↑
        </button>
        <div>
          <button
            type="button"
            aria-label="Move left"
            onClick={() => changeDirection('left')}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Move down"
            onClick={() => changeDirection('down')}
          >
            ↓
          </button>
          <button
            type="button"
            aria-label="Move right"
            onClick={() => changeDirection('right')}
          >
            →
          </button>
        </div>
      </div>
      <p className={styles.gameHint}>
        Focus the board and use Arrow Keys or WASD. Space pauses. Each coffee is worth 10
        points;
        {` `}
        {ACHIEVEMENT_SCORE} points earns Bug Slayer.
      </p>
    </section>
  );
}
