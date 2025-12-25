import { Button } from "@/components/ui/button";

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export function CustomButtonPrimary({ label, onClick, className = "" }: CustomButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`bg-gray-900 text-white hover:bg-gray-800 transition-all ${className}`}
    >
      {label}
    </Button>
  );
}

export function CustomButtonOutline({ label, onClick, className = "" }: CustomButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={`bg-white text-gray-900 border-gray-300 hover:bg-gray-50 transition-all ${className}`}
    >
      {label}
    </Button>
  );
}