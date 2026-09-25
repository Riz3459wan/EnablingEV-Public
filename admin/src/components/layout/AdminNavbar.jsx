import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  Menu,
  ChevronDown,
  X,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

const AdminNavbar = ({
  onMenuClick,
  sidebarLeftClass = "lg:left-64",
  smoothEase,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      title: "New dealer request",
      sub: "Shree Ram Motors",
      time: "2h",
      unread: true,
    },
    {
      id: 2,
      title: "Quotation approved",
      sub: "Rohit Kumar",
      time: "5h",
      unread: true,
    },
    {
      id: 3,
      title: "Vehicle dispatched",
      sub: "Chassis 1234567",
      time: "1d",
      unread: false,
    },
  ]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header
      style={{
        transitionProperty: "left",
        transitionDuration: "300ms",
        transitionTimingFunction: smoothEase || "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className={`fixed top-0 left-0 ${sidebarLeftClass} right-0 z-30 h-16 sm:h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200 animate-fade-in-down`}
    >
      {/* ...baaki content same as before... */}
      <div className="flex items-center justify-between h-full px-3 sm:px-6 gap-2">
        {/* Left: Menu + Search */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors active:scale-95 shrink-0"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search dealers, customers, vehicles..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Right: Actions + Profile */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <div className="relative group">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors active:scale-95">
              <Bell size={20} />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount}
                  </span>
                </>
              )}
            </button>
            {/* Notifications dropdown */}
            <div className="hidden lg:block absolute right-0 top-full mt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
              <div className="bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <p className="font-semibold text-slate-800 text-sm">
                    Notifications
                  </p>
                  <span className="text-[10px] font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors ${n.unread ? "bg-blue-50/30" : ""}`}
                    >
                      <div className="flex items-start gap-2">
                        {n.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {n.title}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {n.sub}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/settings/preferences")}
            className="hidden sm:block p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors active:scale-95"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>

          <div className="hidden sm:block h-8 w-px bg-slate-200" />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-lg hover:bg-slate-100 transition-colors active:scale-95"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                A
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-800 leading-tight">
                  Admin
                </p>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Super Admin
                </p>
              </div>
              <ChevronDown
                size={14}
                className={`hidden md:block text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-scale-in origin-top-right">
                <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-br from-blue-50 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      A
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        Admin
                      </p>
                      <p className="text-xs text-slate-500">
                        admin@enablingev.com
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate("/settings/profile");
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User size={16} className="text-slate-400" /> My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings/security");
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings size={16} className="text-slate-400" /> Security
                  </button>
                </div>

                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-white animate-fade-in">
          <div className="flex items-center gap-2 p-3 border-b border-slate-200">
            <Search size={18} className="text-slate-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;
