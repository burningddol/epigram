import Link from "next/link";

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-black"
          aria-label="홈으로 이동"
        >
          Epigram
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/search"
            className="text-gray-500 transition-colors hover:text-black"
            aria-label="검색"
          >
            <SearchIcon />
          </Link>
          <Link
            href="/mypage"
            className="text-gray-500 transition-colors hover:text-black"
            aria-label="마이페이지"
          >
            <PersonIcon />
          </Link>
        </nav>
      </div>
    </header>
  );
}
