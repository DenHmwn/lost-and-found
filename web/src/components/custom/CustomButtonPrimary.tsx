import { Button } from "@/components/ui/button";

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export function CustomButtonPrimary({ label, onClick, className = "", disabled = false }: CustomButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`bg-gray-900 text-white hover:bg-gray-800 transition-all ${className}`}
    >
      {label}
    </Button>
  );
}

export function CustomButtonOutline({ label, onClick, className = "", disabled = false }: CustomButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      disabled={disabled}
      className={`bg-white text-gray-900 border-gray-300 hover:bg-gray-50 transition-all ${className}`}
    >
      {label}
    </Button>
  );
}
