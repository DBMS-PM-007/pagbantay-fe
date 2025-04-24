type InputFieldProps = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function InputField({
  type,
  placeholder,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <input
      className="p-4 border"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  )
}
