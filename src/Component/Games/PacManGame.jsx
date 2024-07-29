import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

const CELL_SIZE = 20;
const PAC_MAN_SIZE = 16;
const GHOST_SIZE = 14;
const PELLET_SIZE = 4;
const MOVE_INTERVAL = 200;
const COUNTDOWN_TIME = 3;

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  RIGHT: { x: 1, y: 0 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
};

const GHOST_COLORS = ['#FF0000', '#00FFFF', '#FFB8FF', '#FFB852'];

const MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];



const eat = keyframes`
  0% { clip-path: polygon(100% 74%, 44% 48%, 100% 21%); }
  25% { clip-path: polygon(100% 60%, 44% 48%, 100% 40%); }
  50% { clip-path: polygon(100% 50%, 44% 48%, 100% 50%); }
  75% { clip-path: polygon(100% 59%, 44% 48%, 100% 35%); }
  100% { clip-path: polygon(100% 74%, 44% 48%, 100% 21%); }
`;

const food = keyframes`
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(-50px); opacity: 0; }
`;

const PacManWrapper = styled.div`
  width: ${PAC_MAN_SIZE}px;
  height: ${PAC_MAN_SIZE}px;
  border-radius: 50%;
  background: #F2D648;
  position: absolute;
  transition: all 0.2s;
  transform: ${props => `rotate(${props.angle}deg)`};
`;

const PacManEye = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  top: 4px;
  right: 8px;
  background: #333333;
`;

const PacManMouth = styled.div`
  background: #000;
  position: absolute;
  width: 100%;
  height: 100%;
  clip-path: polygon(100% 74%, 44% 48%, 100% 21%);
  animation: ${eat} 0.7s infinite;
`;

const Food = styled.div`
  position: absolute;
  width: ${PELLET_SIZE}px;
  height: ${PELLET_SIZE}px;
  background: #FFF;
  border-radius: 50%;
`;



function PacManGame({ onGameOver, width, height }) {
    const rows = MAP.length;
    const cols = MAP[0].length;
  
    const [pacMan, setPacMan] = useState({ x: 1, y: 1 });
    const [ghosts, setGhosts] = useState([]);
    const [pellets, setPellets] = useState([]);
    const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
    const [score, setScore] = useState(0);
    const [countdown, setCountdown] = useState(COUNTDOWN_TIME);
    const [gameStarted, setGameStarted] = useState(false);
  
    const initializeGame = useCallback(() => {
      const newPellets = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (MAP[y][x] === 0) {
            newPellets.push({ x, y });
          }
        }
      }
      setPellets(newPellets);
  
      const newGhosts = GHOST_COLORS.map((_, index) => ({
        x: cols - 2,
        y: rows - 2,
        direction: DIRECTIONS.UP
      }));
      setGhosts(newGhosts);
  
      setPacMan({ x: 1, y: 1 });
      setDirection(DIRECTIONS.RIGHT);
      setScore(0);
    }, [rows, cols]);
  

  useEffect(() => {
    initializeGame();
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setGameStarted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [initializeGame]);

  const moveCharacter = useCallback((character, dir) => {
    let newX = character.x + dir.x;
    let newY = character.y + dir.y;

    if (MAP[newY] && MAP[newY][newX] === 0) {
      return { x: newX, y: newY };
    }
    return character;
  }, []);

  const movePacMan = useCallback(() => {
    const newPacMan = moveCharacter(pacMan, direction);
    setPacMan(newPacMan);

    const eatenPelletIndex = pellets.findIndex(p => p.x === newPacMan.x && p.y === newPacMan.y);
    if (eatenPelletIndex !== -1) {
      setPellets(pellets.filter((_, index) => index !== eatenPelletIndex));
      setScore(score + 10);
    }

    if (ghosts.some(ghost => 
      Math.abs(ghost.x - newPacMan.x) < 0.5 && 
      Math.abs(ghost.y - newPacMan.y) < 0.5
    )) {
      onGameOver();
    }
  }, [pacMan, direction, pellets, ghosts, moveCharacter, score, onGameOver]);

  const moveGhosts = useCallback(() => {
    setGhosts(ghosts.map(ghost => {
      const possibleDirections = Object.values(DIRECTIONS).filter(dir => {
        const newX = ghost.x + dir.x;
        const newY = ghost.y + dir.y;
        return MAP[newY] && MAP[newY][newX] === 0;
      });
      const newDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
      return moveCharacter(ghost, newDirection);
    }));
  }, [ghosts, moveCharacter]);
  useEffect(() => {
    if (!gameStarted) return;

    const gameInterval = setInterval(() => {
      movePacMan();
      moveGhosts();
    }, MOVE_INTERVAL);

    return () => clearInterval(gameInterval);
  }, [gameStarted, movePacMan, moveGhosts]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      e.preventDefault();
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w': setDirection(DIRECTIONS.UP); break;
        case 'arrowright':
        case 'd': setDirection(DIRECTIONS.RIGHT); break;
        case 'arrowdown':
        case 's': setDirection(DIRECTIONS.DOWN); break;
        case 'arrowleft':
        case 'a': setDirection(DIRECTIONS.LEFT); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getAngle = () => {
    switch (direction) {
      case DIRECTIONS.UP: return -90;
      case DIRECTIONS.RIGHT: return 0;
      case DIRECTIONS.DOWN: return 90;
      case DIRECTIONS.LEFT: return 180;
      default: return 0;
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative', 
      backgroundColor: '#000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {countdown > 0 ? (
        <div style={{
          color: '#ffffff',
          fontSize: '48px',
          fontWeight: 'bold',
        }}>
          {countdown}
        </div>
      ) : (
        <div style={{
          position: 'relative',
          width: cols * CELL_SIZE,
          height: rows * CELL_SIZE,
        }}>
          {MAP.map((row, y) => 
            row.map((cell, x) => 
              cell === 1 && (
                <div key={`wall-${x}-${y}`} style={{
                  position: 'absolute',
                  left: x * CELL_SIZE,
                  top: y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: '#2121DE',
                }} />
              )
            )
          )}
          {pellets.map((pellet, i) => (
            <Food key={i} style={{
              left: pellet.x * CELL_SIZE + (CELL_SIZE - PELLET_SIZE) / 2,
              top: pellet.y * CELL_SIZE + (CELL_SIZE - PELLET_SIZE) / 2,
            }} />
          ))}
          <PacManWrapper style={{
            left: pacMan.x * CELL_SIZE + (CELL_SIZE - PAC_MAN_SIZE) / 2,
            top: pacMan.y * CELL_SIZE + (CELL_SIZE - PAC_MAN_SIZE) / 2,
          }} angle={getAngle()}>
            <PacManEye />
            <PacManMouth />
          </PacManWrapper>
          {ghosts.map((ghost, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: ghost.x * CELL_SIZE + (CELL_SIZE - GHOST_SIZE) / 2,
              top: ghost.y * CELL_SIZE + (CELL_SIZE - GHOST_SIZE) / 2,
              width: GHOST_SIZE,
              height: GHOST_SIZE,
              backgroundColor: GHOST_COLORS[i],
              borderRadius: '40% 40% 0 0',
            }} />
          ))}
          <div style={{
            position: 'absolute',
            top: -20,
            left: 0,
            color: '#ffffff',
            fontSize: '14px',
          }}>
            Score: {score}
          </div>
        </div>
      )}
    </div>
  );
}

export default PacManGame;