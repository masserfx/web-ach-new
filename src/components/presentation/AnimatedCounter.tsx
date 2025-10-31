'use client';

import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration: number; // in seconds
}

export default function AnimatedCounter({ from, to, duration }: AnimatedCounterProps) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTime: number | null = null;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const current = from + (to - from) * progress;
      setCount(Math.round(current * 10) / 10);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [from, to, duration]);

  return <span>{count}</span>;
}
