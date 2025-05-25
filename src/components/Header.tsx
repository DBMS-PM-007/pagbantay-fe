import { useLocation, useNavigate } from 'react-router-dom'

type HeaderProps = {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminView = location.pathname.startsWith('/admin');

  const handleToggle = () => {
    navigate(isAdminView ? '/volunteer' : '/admin');
  };

  return (
    <div className="flex flex-col w-full border-b line-height p-4 items-center text-center fixed bg-white top-0 z-10">
      <button
        onClick={handleToggle}
        className="text-[10px] hover:cursor-pointer"
      >
        {isAdminView ? 'Go to Volunteer' : 'Go to Admin'}
      </button>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  )
}

