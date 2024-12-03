import { Loader2 } from 'lucide-react';

export function Loader({ className }: { className?: string }) {
  return (
    <Loader2
      className={`animate-spin ${className} min-h-screen mx-auto items-center justify-center`}
    />
  );
}
