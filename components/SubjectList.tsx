// components/SubjectList.tsx
'use client';

import React, { useState } from 'react';

interface SubjectItem {
  name: string;
  slug: string;
}

interface SubjectListProps {
  subjects: SubjectItem[];
  onSelectionChange: (selected: string[]) => void;
}

const SubjectList = ({ subjects, onSelectionChange }: SubjectListProps) => {
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());

  const toggleSubject = (slug: string) => {
    const newSelected = new Set(selectedSubjects);
    if (newSelected.has(slug)) {
      newSelected.delete(slug);
    } else {
      newSelected.add(slug);
    }
    setSelectedSubjects(newSelected);
    onSelectionChange(Array.from(newSelected));
  };

  return (
    <div className="faculty-list">
      {subjects.map((subject, index) => (
        <div
          key={index}
          className="faculty-item cursor-pointer"
          onClick={() => toggleSubject(subject.slug)}
          style={{
            backgroundColor: selectedSubjects.has(subject.slug) ? '#e0f2ff' : '',
            border: selectedSubjects.has(subject.slug) ? '2px solid #0066cc' : '1px solid #e0e0e0',
          }}
          aria-label={`${selectedSubjects.has(subject.slug) ? 'Deselect' : 'Select'} ${subject.name}`}
        >
          <input
            type="checkbox"
            checked={selectedSubjects.has(subject.slug)}
            onChange={() => toggleSubject(subject.slug)} // For keyboard/accessibility
            className="mr-3 w-5 h-5 accent-blue-600"
            aria-hidden="true"
          />
          <span>{subject.name}</span>
        </div>
      ))}
    </div>
  );
};

export default SubjectList;