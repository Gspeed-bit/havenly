import {
  CircleUserRound,
  ChevronRight,
  ChevronLeft,
  Search,
  Menu,
  Sparkles,
  Mailbox,
  X,
  SlidersVertical,
  CircleArrowOutDownRight,
  LucideProps,
  MapPin,
  Download,
  Link2,
} from 'lucide-react';
import React from 'react';

const iconMap = {
  CircleUserRound,
  ChevronRight,
  ChevronLeft,
  Search,
  Menu,
  Download,
  Sparkles,
  Mailbox,
  X,
  MapPin,
  SlidersVertical,
  Link2,
  CircleArrowOutDownRight,
};

interface IconProps extends LucideProps {
  type: keyof typeof iconMap;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({
  type,
  size = 24,
  color = '#000',
  strokeWidth = 2,
  className,
  style,
}) => {
  const IconComponent = iconMap[type];

  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      style={style}
    />
  );
};

export default Icon;
