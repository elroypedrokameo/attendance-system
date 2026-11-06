import { useState, useRef, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { User as UserIcon, LogOut, ChevronDown } from "lucide-react";

export const EmployeeLayout = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    console.log("Logout...");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/employee/dashboard"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="font-bold text-lg text-zinc-900 tracking-tight">
              DEXA
            </span>
          </Link>

          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl  transition-colors cursor-pointer text-left focus:outline-none"
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-semibold text-xs shrink-0">
                E
              </div>
              {/* <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-zinc-900 leading-tight">
                  Elroy
                </p>
                <p className="text-xs text-zinc-500 leading-tight">
                  Software Engineer
                </p>
              </div> */}
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform duration-200 hidden sm:block ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-zinc-200 shadow-lg py-1.5 z-50">
                <div className="px-4 py-2.5 border-b border-zinc-100">
                  <p className="text-sm font-semibold text-zinc-900">Elroy</p>
                  <p className="text-xs text-zinc-500 truncate">
                    Software Engineer
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    to="/employee/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-zinc-500" />
                    <span>Profile</span>
                  </Link>
                </div>

                <div className="border-t border-zinc-100 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
