import Link from "next/link";

const links = [
  { label: "Home", href: "/" },
  { label: "Films", href: "/movies" },
  {
    label: "GitHub",
    href: "https://github.com/mjbouchery-hub/EPORTFOLIO/tree/main/netflix-clone",
  },
  {
    label: "Portfolio",
    href: "https://mjbouchery-hub.github.io/EPORTFOLIO/",
  },
  {
    label: "Contact",
    href: "mailto:matthewbouchery@gmail.com",
  },
];

function Footer() {
  return (
    <footer className="mt-48 bg-[#141414] border-t border-white/5 px-8 py-12 text-white/40">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm font-medium text-white/70">
          MJBFLIX — a portfolio project by Matthew Bouchery
        </p>

        <p className="mt-3 max-w-xl text-sm leading-relaxed">
          An educational streaming-interface project inspired by Netflix. Not
          affiliated with Netflix.
        </p>

        <nav aria-label="Footer" className="mt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  target={href.startsWith("https://") ? "_blank" : undefined}
                  rel={
                    href.startsWith("https://")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="text-sm underline transition-colors hover:text-white/70"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-8 text-xs">
          MJBFLIX &copy; {new Date().getFullYear()} Matthew Bouchery
        </p>
      </div>
    </footer>
  );
}

export default Footer;
