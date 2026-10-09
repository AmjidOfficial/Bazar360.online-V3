import React from 'react';

interface AdminOpButtonProps {
  url: string;
  label: string;
}

export function AdminOpButton({ url, label }: AdminOpButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors inline-block text-center"
    >
      {label}
    </a>
  );
}
