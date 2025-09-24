'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface FacultyItem {
  name: string;
  slug: string;
}

const FacultyList = ({ faculties }: { faculties: FacultyItem[] }) => {
  const router = useRouter();

  const handleNavigate = (slug: string) => {
    router.push(`/dashboard/students/faculty/${slug}`);
  };

  return (
    <div className="faculty-list">
      {faculties.map((faculty, index) => (
        <div
          key={index}
          onClick={() => handleNavigate(faculty.slug)}
          className="faculty-item cursor-pointer"
          aria-label={`View details for ${faculty.name}`}
        >
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5,3 19,12 5,21 5,3"></polygon>
            </svg>
          </span>
          <span>{faculty.name}</span>
        </div>
      ))}
    </div>
  );
};

export default FacultyList;