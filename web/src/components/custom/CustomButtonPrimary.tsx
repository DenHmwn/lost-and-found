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
      // Kita gabungkan class default dengan className dari props
      className={`bg-gray-900 text-white hover:bg-gray-800 transition-all ${className}`}
    >
      {label}
    </Button>
  );
}

