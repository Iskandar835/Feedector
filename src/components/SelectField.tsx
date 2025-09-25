import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  selectName: string;
  onValueChange: (value: string) => void;
  required: boolean;
  options: Option[];
};

export default function SelectField({
  selectName,
  onValueChange,
  required,
  options,
}: SelectFieldProps) {
  return (
    <Select name={selectName} onValueChange={onValueChange} required={required}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sélectionner..." />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
