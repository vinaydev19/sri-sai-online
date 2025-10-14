import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  UserCircle,
  LogOut,
  Briefcase,
  UsersRound,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { useGetCurrentUserQuery, useLogoutMutation } from "@/store/api/authSlice";
import { logout } from "@/store/slices/userSlice";
import toast from "react-hot-toast";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["admin", "employee"] },
  { name: "Employees", href: "/employees", icon: User, roles: ["admin"] },
  { name: "Services", href: "/services", icon: Settings, roles: ["admin", "employee"] },
  { name: "Customers", href: "/customers", icon: UsersRound, roles: ["admin", "employee"] },
  { name: "Profile", href: "/profile", icon: UserCircle, roles: ["admin", "employee"] },
];

const Sidebar = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  useGetCurrentUserQuery();

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user.role));

  const logoutBtn = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate("/login");
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout failed", err);
      toast.error(err?.data?.message || "Logout failed. Please try again.");
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col shadow-sm transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] rounded-lg flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-700 text-sm">Sri Sai Online</h2>
            <p className="text-xs text-gray-400 leading-tight">Management System</p>
          </div>
        </div>

        {/* Mobile close button */}
        <button className="md:hidden text-gray-500 hover:text-gray-800" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                ? "bg-[#111827] text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <Card className="p-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <UserCircle className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{user?.username || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role === "admin" ? "Administrator" : "Employee"}</p>
            </div>
          </div>
        </Card>

        <Button
          variant="ghost"
          onClick={logoutBtn}
          className="w-full justify-start gap-3 text-gray-900 hover:text-gray-700"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
