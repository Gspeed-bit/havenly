// components/Avatar.tsx
import React from 'react';

interface AvatarProps {
  imgUrl?: string;
  firstName: string;
  lastName: string;
  size?: string; // Optional size prop
}

const userAvatar: React.FC<AvatarProps> = ({
  imgUrl,
  firstName,
  lastName,
  size = '2.5rem',
}) => {
  // Predefined color map for letters A-Z
  const letterColorMap: Record<string, string> = {
    A: '#EF4444',
    B: '#3B82F6',
    C: '#10B981',
    D: '#F59E0B',
    E: '#8B5CF6',
    F: '#EC4899',
    G: '#6366F1',
    H: '#14B8A6',
    I: '#F97316',
    J: '#4B5563',
    K: '#22C55E',
    L: '#A855F7',
    M: '#D946EF',
    N: '#0EA5E9',
    O: '#DB2777',
    P: '#7C3AED',
    Q: '#059669',
    R: '#9CA3AF',
    S: '#1D4ED8',
    T: '#D97706',
    U: '#6D28D9',
    V: '#D1D5DB',
    W: '#4ADE80',
    X: '#FACC15',
    Y: '#EA580C',
    Z: '#9D174D',
  };

  const defaultColor = '#374151'; // Neutral Gray

  const getUserInitials = (firstName: string, lastName: string): string => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getColorForLetter = (letter: string): string => {
    return letterColorMap[letter.toUpperCase()] || defaultColor;
  };

  const userInitials = getUserInitials(firstName, lastName);
  const backgroundColor = getColorForLetter(lastName?.charAt(0) || '');

  return (
    <div
      className='flex items-center justify-center'
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
      }}
    >
      {imgUrl ? (
        <picture>
          <img
            src={imgUrl}
            alt={`${firstName} ${lastName}`}
            className='object-cover w-full h-full rounded-full'
            style={{
              borderRadius: '50%', // Enforce circular shape
            }}
          />
        </picture>
      ) : (
        <span
          className='text-sm rounded-full font-medium flex items-center justify-center'
          style={{ backgroundColor, color: 'white', width: size, height: size }}
        >
          {userInitials}
        </span>
      )}
    </div>
  );
};

export default userAvatar;
