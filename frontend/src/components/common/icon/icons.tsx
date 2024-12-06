import {
  AlignRight,
  ChevronRight,
  ChevronLeft,
  Headset,
  Mail,
  CirclePlus,
  Sparkles,
  Mailbox,
  DollarSign,
  Package,
  Loader2,
  BarChart2,
  ShieldEllipsis,
  User,

  Clock,
  Phone,
  Asterisk,
  CircleArrowOutDownRight,
  LucideProps,
  MapPin,
  Download,
  UserRoundCog,
  ShoppingCart,
  CircleUser,
  Search,
  LayoutDashboard,
  Link2,
} from "lucide-react";
import React from "react";

const iconMap = {
  AlignRight,
  ChevronRight,
  UserRoundCog,
  ChevronLeft,
  Headset,
  CirclePlus,
  ShoppingCart,
  CircleUser,
  DollarSign,
  Package,
  BarChart2,
  User,
  Clock,
  Loader2,
  Mail,
  ShieldEllipsis,
  Search,
  Download,
  LayoutDashboard,
  Sparkles,
  Mailbox,
  Phone,
  MapPin,
  Asterisk,
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
  color = "#000",
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


//   <Icon type={"CirclePlus"} color={"#ffff"} strokeWidth={1.5} size={22} />