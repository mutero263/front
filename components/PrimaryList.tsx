// components/SectionList.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface SectionItem {
  name: string;
  slug: string;
}

const SectionList = ({ sections }: { sections: SectionItem[] }) => {
  const router = useRouter();

  const handleNavigate = (slug: string) => {
    router.push(`/dashboard/students/primary/terms/${slug}`); // 👈 Navigate to terms page
  };

  return (
    <div className="faculty-list">
      {sections.map((section, index) => (
        <div
          key={index}
          onClick={() => handleNavigate(section.slug)}
          className="faculty-item cursor-pointer"
          aria-label={`View terms for ${section.name}`}
        >
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5,3 19,12 5,21 5,3"></polygon>
            </svg>
          </span>
          <span>{section.name}</span>
        </div>
      ))}
    </div>
  );
};

export default SectionList;