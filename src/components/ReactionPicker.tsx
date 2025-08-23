import { useState } from 'react';

interface ReactionPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onReactionSelect: (emoji: string) => void;
  position: { top: number; left: number };
}

const availableReactions = [
  '😅', '😭', '😡', '😱', '🤦‍♂️', '🤦‍♀️', 
  '💔', '😤', '🙄', '😪', '🤯', '😩',
  '👍', '❤️', '😢', '😌', '💪', '🙏'
];

export default function ReactionPicker({ isOpen, onClose, onReactionSelect, position }: ReactionPickerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />
      
      {/* Picker */}
      <div
        className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 grid grid-cols-6 gap-2 max-w-sm"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {availableReactions.map((emoji) => (
          <button
            key={emoji}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReactionSelect(emoji);
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
}