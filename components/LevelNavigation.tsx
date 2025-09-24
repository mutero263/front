'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const LevelNavigation = () => {
  const router = useRouter();

  const levels = [
    { id: 'primary', name: 'Primary' },
    { id: 'secondary', name: 'Secondary' },
    { id: 'tertiary', name: 'Tertiary' },
  ];

  const handleNavigate = (id: string) => {
    router.push(`/dashboard/students/level/${id}`);
  };

  return (
    <div className="level-list">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => handleNavigate(level.id)}
          className="level-item"
          aria-label={`Go to ${level.name}`}
        >
          <span className="icon">▶</span>
          <span className="level-name">{level.name}</span>
        </button>
      ))}
    </div>
  );
};

export default LevelNavigation;