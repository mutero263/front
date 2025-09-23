'use client';

import { useParams } from 'next/navigation';
import FacultyList from '@/components/FacultyList';
import React from 'react';

const FacultyPage = () => {
  const { degree } = useParams();
  const degreeName = degree?.toString().replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());

  const facultyMap: Record<string, { name: string; slug: string }[]> = {
    bachelor: [
      { name: 'Faculty of Medicine', slug: 'medicine' },
      { name: 'Faculty of Applied Science', slug: 'applied-science' },
      { name: 'Faculty of Engineering', slug: 'engineering' },
      { name: 'Faculty of Commerce', slug: 'commerce' },
      { name: 'Faculty of Law', slug: 'law' },
      { name: 'Faculty of Education', slug: 'education' },
      { name: 'Faculty of Enviromental Science', slug: 'environmental-science'},
      { name: 'Faculty of Built Environment', slug: 'built-environment'},
      { name: '	Faculty of Agriculture', slug: 'agriculture' },
      { name: '	Faculty of Social Studies', slug: 'social studies'},
      { name: 'Faculty of Arts', slug: 'arts' },

    ],
    master: [
      { name: 'School of Public Health', slug: 'public-health' },
      { name: 'School of Engineering', slug: 'engineering-master' },
      { name: 'School of Business Administration', slug: 'business-admin' },
    ],
    phd: [
      { name: 'Doctoral School of Science', slug: 'science-phd' },
      { name: 'Doctoral School of Humanities', slug: 'humanities-phd' },
    ],
    diploma: [
      { name: 'Diploma in Nursing', slug: 'nursing' },
      { name: 'Diploma in IT', slug: 'it' },
      { name: 'Diploma in Accounting', slug: 'accounting' },
    ],
  };

  const faculties = facultyMap[degree as string] || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        {degreeName}
      </h1>
      {faculties.length > 0 ? (
        <FacultyList faculties={faculties} />
      ) : (
        <p className="text-gray-500">No faculties available for this level.</p>
      )}
    </div>
  );
};

export default FacultyPage;