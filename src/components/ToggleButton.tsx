type ToggleButtonProps = {
  toggle: boolean;
  handleToggle: () => void;
};

export default function ToggleButton({ toggle, handleToggle }: ToggleButtonProps) {
  return (
    <button
      onClick={handleToggle}
      className={`mt-4 text-md hover:cursor-pointer font-bold border-black border p-2 rounded-lg ${toggle ? "bg-[maroon] text-white" : "bg-white text-black"}`}
    >
      {toggle ? "SIGN UP" : "SIGN IN"}
    </button>
  );
}

