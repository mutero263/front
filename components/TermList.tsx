// components/TermList.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface TermItem {
  name: string;
  slug: string;
}

const TermList = ({ terms }: { terms: TermItem[] }) => {
  const router = useRouter();

  const handleNavigate = (slug: string) => {
    router.push(`/dashboard/students/primary/subjects/${slug}`); // 👈 Navigate to subjects page
  };

  return (
    <div className="faculty-list">
      {terms.map((term, index) => (
        <div
          key={index}
          onClick={() => handleNavigate(term.slug)}
          className="faculty-item cursor-pointer"
          aria-label={`View subjects for ${term.name}`}
        >
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5,3 19,12 5,21 5,3"></polygon>
            </svg>
          </span>
          <span>{term.name}</span>
        </div>
      ))}
    </div>
  );
};

export default TermList;