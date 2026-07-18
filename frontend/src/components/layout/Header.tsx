export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <div className="text-2xl font-bold">
          Ysgol Bryn Alyn
        </div>

        <nav className="hidden gap-8 md:flex">
          <a href="#">About</a>
          <a href="#">Parents</a>
          <a href="#">Students</a>
          <a href="#">News</a>
          <a href="#">Contact</a>
        </nav>

        <button className="md:hidden">
          ☰
        </button>

      </div>
    </header>
  );
}