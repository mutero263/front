// app/sections/[grade]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import SectionList from '@/components/PrimaryList';
import React from 'react';
import { useRouter } from 'next/navigation';

const SectionsPage = () => {
  const { grade } = useParams();
  const router = useRouter();

  // Convert 'grade-7' → 'Grade 7'
  const formatGradeName = (slug: string): string => {
    if (slug.startsWith('grade-')) {
      const num = slug.replace('grade-', '');
      return `Grade ${num}`;
    }
    if (slug === 'ecd-a') return 'ECD A';
    if (slug === 'ecd-b') return 'ECD B';
    return slug;
  };

  const gradeName = formatGradeName(grade as string);

  // Generate sections: For Grade 1 → 1A, 1B, 1C, 1D
  const generateSections = (gradeSlug: string): { name: string; slug: string }[] => {
    if (gradeSlug.startsWith('grade-')) {
      const gradeNum = gradeSlug.replace('grade-', '');
      return ['A', 'B', 'C', 'D'].map(letter => ({
        name: `${gradeNum}${letter}`,
        slug: `${gradeSlug}-${letter.toLowerCase()}`,
      }));
    }

    if (gradeSlug === 'ecd-a') {
      return [
        { name: 'ECD A1', slug: 'ecd-a1' },
        { name: 'ECD A2', slug: 'ecd-a2' },
        { name: 'ECD A3', slug: 'ecd-a3' },
      ];
    }

    if (gradeSlug === 'ecd-b') {
      return [
        { name: 'ECD B1', slug: 'ecd-b1' },
        { name: 'ECD B2', slug: 'ecd-b2' },
      ];
    }

    return [
      { name: 'Section 1', slug: 'section-1' },
      { name: 'Section 2', slug: 'section-2' },
    ];
  };
      const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard'); // Fallback route
    }
  };

  const sections = generateSections(grade as string);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
         {gradeName}
      </h1>
      <SectionList sections={sections} />
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

export default SectionsPage;