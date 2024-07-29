import React, { useState, useEffect } from 'react';

function AnimatedTag() {
  const messages = [
    "< code />",
    "while(coding) { coffee++ }",
    "if (brain != empty) { keepCoding() }",
    "{ life: eat() sleep() code() }",
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-pulse">
      {messages[currentMessage]}
    </div>
  );
}