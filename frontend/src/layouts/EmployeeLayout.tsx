import { Outlet, NavLink } from "react-router-dom";
import { Home, Camera, User as UserIcon, LogOut } from "lucide-react";

export const EmployeeLayout = () => {
  const handleLogout = () => {
    console.log("Logout...");
  };

  const navItems = [
    {
      to: "/employee/dashboard",
      label: "Dashboard",
      icon: <Home className="w-4 h-4" />,
    },
    {
      to: "/employee/check-in",
      label: "Absen",
      icon: <Camera className="w-4 h-4" />,
    },
    {
      to: "/employee/profile",
      label: "Profil Saya",
      icon: <UserIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-zinc-900 tracking-tight">
                DEXA
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-1 ml-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-zinc-100 text-zinc-900 font-semibold"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-zinc-900">Elroy</p>
              <p className="text-xs text-zinc-500">Software Engineer</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-zinc-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="md:hidden border-t border-zinc-100 px-4 py-2 flex justify-around bg-white">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              aria-label={item.label}
              className={({ isActive }) =>
                `flex items-center justify-center p-2.5 rounded-lg transition-colors [&>svg]:w-5 [&>svg]:h-5 ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900 font-semibold"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                }`
              }
            >
              {item.icon}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
