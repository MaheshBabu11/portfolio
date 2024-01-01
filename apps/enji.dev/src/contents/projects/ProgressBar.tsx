/* eslint-disable */
import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  const totalDots = 10;
  const filledDots = Math.round((progress / 100) * totalDots);

  const getColor = (index) => {
    if (index < filledDots) {
      if (progress > 80) {
        return 'bg-green-500';
      } else if (progress > 50) {
        return 'bg-yellow-500';
      } else {
        return 'bg-red-500';
      }
    } else {
      return 'bg-gray-300';
    }
  };

  return (
    <div className={`mt-2 flex ${className} `}>
      {[...Array(totalDots)].map((_, i) => (
        <div
          key={`dot-${i}`}
          className={`mx-1 h-2 w-2 rounded-full ${getColor(i)}`}
        />
      ))}
    </div>
  );
}

export default ProgressBar;
