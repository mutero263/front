'use client';

import { useParams } from 'next/navigation';
import GradeList from '@/components/GradeList';
import React from 'react';
import { useRouter } from 'next/navigation';

const LevelPage = () => {
  const { level } = useParams();
  const router = useRouter();
  const levelName = level?.toString().charAt(0).toUpperCase() + level?.toString().slice(1);
      const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard'); 
    }
  };

  const gradeData: Record<string, { label: string; degree: string }[]> = {
    primary: [
      { label: 'ECD A', degree: 'ecd-a' },
      { label: 'ECD B', degree: 'ecd-b' },
      { label: 'Grade 1', degree: 'grade-1' },
      { label: 'Grade 2', degree: 'grade-2' },
      { label: 'Grade 3', degree: 'grade-3' },
      { label: 'Grade 4', degree: 'grade-4' },
      { label: 'Grade 5', degree: 'grade-5' },
      { label: 'Grade 6', degree: 'grade-6' },
      { label: 'Grade 7', degree: 'grade-7' },
    ],
    secondary: [
      { label: 'Form 1', degree: 'form-1' },
      { label: 'Form 2', degree: 'form-2' },
      { label: 'Form 3', degree: 'form-3' },
      { label: 'Form 4', degree: 'form-4' },
      { label: 'Form 5', degree: 'form-5' },
      { label: 'Form 6', degree: 'form-6' },
    ],
    tertiary: [
      { label: 'Diploma', degree: 'diploma' },
      { label: 'Bachelor', degree: 'bachelor' },
      { label: 'Masters', degree: 'master' },
      { label: 'PhD', degree: 'phd' },
    ],
  };

  const grades = gradeData[level as string] || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">{levelName} Levels</h1>
      <GradeList grades={grades} />
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
        >
          ← Back
        </button>
      </div>
    </div>
    
  );
};

export default LevelPage;