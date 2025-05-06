type HeaderProps = {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <div className="w-full border-b p-4 items-center text-center">
      <h2 className="text-xl font-bold">
        {title}
      </h2>
    </div>
  )
}

