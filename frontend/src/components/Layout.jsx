import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link2, LogOut, Shield } from "./icons";

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? "bg-ink-100 text-ink-950" : "text-ink-500 hover:bg-ink-100 hover:text-ink-800"
  }`;

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-dvh bg-ink-50">
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-ink-50/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <NavLink to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand-900 text-brand-50">
              <Link2 size={16} strokeWidth={2} />
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight text-ink-950">
              URL Shortener Pro
            </span>
          </NavLink>
          <nav className="flex items-center gap-1.5">
            {user ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                {user.isAdmin && (
                  <NavLink to="/admin" className={navLinkClass}>
                    <span className="inline-flex items-center gap-1.5">
                      <Shield size={13} />
                      Admin
                    </span>
                  </NavLink>
                )}
                <div className="ml-2 flex items-center gap-2 border-l border-ink-200 pl-3">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-900 text-[11px] font-semibold text-white"
                    title={user.name}
                  >
                    {initials(user.name) || "U"}
                  </span>
                  <button
                    onClick={logout}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
                    aria-label="Log out"
                    title="Log out"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Log in
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-lg bg-brand-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-brand-700"
                >
                  Sign up
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-6xl px-5 py-10">
        <Outlet />
      </main>
    </div>
  );
}
