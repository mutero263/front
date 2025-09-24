// components/GradeList.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface GradeItem {
  label: string;
  degree: string;
}

const GradeList = ({ grades }: { grades: GradeItem[] }) => {
  const router = useRouter();

  const handleNavigate = (degree: string) => {
    if (degree.startsWith('grade-') || degree.startsWith('ecd-')) {
      router.push(`/dashboard/students/primary/${degree}`);
    } else {
      router.push(`/dashboard/students/faculty/${degree}`);
    }
  };

  return (
    <div className="grade-list">
      {grades.map((item, index) => (
        <div
          key={index}
          onClick={() => handleNavigate(item.degree)}
          className="grade-item cursor-pointer"
          aria-label={`View details for ${item.label}`}
        >
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5,3 19,12 5,21 5,3"></polygon>
            </svg>
          </span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default GradeList;