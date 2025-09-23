// app/subjects/[term]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import SubjectList from '@/components/SubjectList';
import React, { useState, useEffect } from 'react';

const SubjectsPage = () => {
  const { term } = useParams();
  const router = useRouter();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Format title: e.g., "grade-3-a-term-1" → "Term 1 - 3A"
  const formatTitle = (slug: string): string => {
    if (slug.includes('term')) {
      const parts = slug.split('-');
      const termNum = parts[parts.length - 1]; // "1", "2", "3"
      let section = '';

      if (slug.startsWith('grade-')) {
        const gradeNum = parts[1];
        const letter = parts[2].toUpperCase();
        section = `${gradeNum}${letter}`;
      } else if (slug.startsWith('ecd-')) {
        const ecdPart = slug.split('-term')[0];
        section = ecdPart.replace('ecd-', 'ECD ').toUpperCase();
      } else {
        section = 'Section';
      }

      return `Term ${termNum} - ${section}`;
    }
    return slug;
  };

  const pageTitle = formatTitle(term as string);

  // Determine if this is ECD
  const isECD = (term as string).startsWith('ecd-');

  // Define subjects based on level
  const subjects = isECD
    ? [
        { name: 'Art', slug: 'art' },
        { name: 'Shona Reading', slug: 'shona-reading' },
        { name: 'Ndebele Reading', slug: 'ndebele-reading' },
        { name: 'English Reading', slug: 'english-reading' },
        { name: 'Maths', slug: 'maths' },
        { name: 'Music', slug: 'music' },
        { name: 'Physical Education', slug: 'pe' },
      ]
    : [
        { name: 'Mathematics', slug: 'mathematics' },
        { name: 'English', slug: 'english' },
        { name: 'Shona', slug: 'shona' },
        { name: 'Ndebele', slug: 'ndebele' },
        { name: 'Science', slug: 'science' },
        { name: 'Agriculture', slug: 'agriculture' },
        { name: 'Social Studies', slug: 'social-studies' },
        { name: 'Religious Education', slug: 're' },
      ];

  // Handle Next → Navigate to Personal Info Step with query params
  const handleNext = () => {
    if (selectedSubjects.length === 0) return;

    const params = new URLSearchParams();
    params.set('subjects', selectedSubjects.join(','));
    params.set('term', term as string);

    // 👉 PUSH TO PERSONAL STEP — adjust route if yours is different (e.g., /register/personal)
    router.push('/dashboard/students/register');
  };

  // Handle Back → Go back in history or fallback to dashboard
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard'); // Fallback route
    }
  };

  // Optional: Log selection for debugging
  useEffect(() => {
    console.log('Currently selected subjects:', selectedSubjects);
  }, [selectedSubjects]);

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        {pageTitle}
      </h1>

      {/* Subject Selection List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <SubjectList
          subjects={subjects}
          onSelectionChange={setSelectedSubjects}
        />
      </div>

      {/* Selected Count */}
      <div className="mt-4 text-sm text-gray-600 text-right">
        {selectedSubjects.length} subject(s) selected
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={selectedSubjects.length === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default SubjectsPage;