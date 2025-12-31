import { Input } from "@/components/ui/input";

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "data-testid"?: string;
}

export function TimeSelect({ value, onChange, "data-testid": testId }: TimeSelectProps) {
  return (
    <Input
      type="time"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      data-testid={testId}
    />
  );
}
