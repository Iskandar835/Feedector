import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  options: Option[];
};

export default function SelectField({ options }: SelectFieldProps) {
  return (
    <Select>
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
