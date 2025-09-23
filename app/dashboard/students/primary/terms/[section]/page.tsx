// app/terms/[section]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import TermList from '@/components/TermList';
import React from 'react';
import { useRouter } from 'next/navigation';

const TermsPage = () => {
  const { section } = useParams();
  const router = useRouter();

  // Format title: e.g., "grade-3-a" → "3A"
  const formatSectionName = (slug: string): string => {
    if (slug.startsWith('grade-')) {
      // Example: grade-3-a → 3A
      const parts = slug.split('-');
      if (parts.length >= 3) {
        const gradeNum = parts[1];
        const letter = parts[2].toUpperCase();
        return `${gradeNum}${letter}`;
      }
    }
    if (slug.startsWith('ecd-a') || slug.startsWith('ecd-b')) {
      return slug.replace('ecd-', 'ECD ').toUpperCase();
    }
    return slug;
  };
    const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard'); // Fallback route
    }
  };

  const sectionName = formatSectionName(section as string);

  // Define terms
  const terms = [
    { name: 'Term 1', slug: `${section}-term-1` },
    { name: 'Term 2', slug: `${section}-term-2` },
    { name: 'Term 3', slug: `${section}-term-3` },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        {sectionName}
      </h1>
      <TermList terms={terms} />
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

export default TermsPage;