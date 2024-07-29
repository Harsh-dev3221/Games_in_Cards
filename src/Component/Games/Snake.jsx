import React, { useState, useEffect, useCallback } from 'react';

const INITIAL_SNAKE = [{ x: 100, y: 100 }];
const INITIAL_FOOD = { x: 50, y: 50 };
const DIRECTIONS = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3 };
const SNAKE_SIZE = 10;
const MOVE_INTERVAL = 100;

function SnakeGame({ onGameOver, width, height }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [gameOver, setGameOver] = useState(false);

  const moveSnake = useCallback(() => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case DIRECTIONS.UP: head.y -= SNAKE_SIZE; break;
      case DIRECTIONS.RIGHT: head.x += SNAKE_SIZE; break;
      case DIRECTIONS.DOWN: head.y += SNAKE_SIZE; break;
      case DIRECTIONS.LEFT: head.x -= SNAKE_SIZE; break;
    }

    // Check if snake hits the card borders
    if (head.x < 0 || head.x + SNAKE_SIZE > width || head.y < 0 || head.y + SNAKE_SIZE > height) {
      setGameOver(true);
      return;
    }

    // Check if snake hits itself
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);
    if (Math.abs(head.x - food.x) < SNAKE_SIZE && Math.abs(head.y - food.y) < SNAKE_SIZE) {
      setFood({
        x: Math.floor(Math.random() * (width - SNAKE_SIZE)),
        y: Math.floor(Math.random() * (height - SNAKE_SIZE)),
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, width, height]);

  useEffect(() => {
    if (gameOver) {
      onGameOver();
      return;
    }

    const interval = setInterval(moveSnake, MOVE_INTERVAL);
    return () => clearInterval(interval);
  }, [gameOver, moveSnake, onGameOver]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      e.preventDefault(); // Prevent default scrolling behavior
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

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {snake.map((segment, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: segment.x,
          top: segment.y,
          width: SNAKE_SIZE,
          height: SNAKE_SIZE,
          backgroundColor: '#bca6c6',
          borderRadius: '50%',
        }} />
      ))}
      <div style={{
        position: 'absolute',
        left: food.x,
        top: food.y,
        width: SNAKE_SIZE,
        height: SNAKE_SIZE,
        backgroundColor: '#ff0000',
        borderRadius: '50%',
      }} />
    </div>
  );
}

export default SnakeGame;