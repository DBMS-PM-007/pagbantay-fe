type HeaderProps = {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <div className="w-full border-b line-height p-4 items-center text-center fixed bg-white top-0 z-10">
      <h2 className="text-xl font-bold">
        {title}
      </h2>
    </div>
  )
}

