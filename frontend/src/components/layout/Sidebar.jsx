import React from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  UserCircle,
  LogOut,
  Briefcase,
  UsersRound,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ["admin", "employee"],
  },
  { name: "Employees", href: "/employees", icon: User, roles: ["admin"] },
  {
    name: "Services",
    href: "/services",
    icon: Settings,
    roles: ["admin", "employee"],
  },
  {
    name: "Customers",
    href: "/customers",
    icon: UsersRound,
    roles: ["admin", "employee"],
  },
  {
    name: "Profile",
    href: "/profile",
    icon: UserCircle,
    roles: ["admin", "employee"],
  },
];

const Sidebar = () => {
  const user = {
    fullName: "John Doe",
    role: "employee", // or 'employee'
  };
  const location = useLocation();

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user.role)
  );

  const logout = () => {
    // Implement logout functionality here
    console.log("Logging out...");
  };

  return (
    <div className="w-64 bg-background border-gray-200 border-r-1 h-screen flex flex-col">
      {/* header */}
      <div className="p-6 border-gray-200 border-b-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white rounded-lg flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-gray-700">Sri Sai Online</h2>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </div>
      </div>

      {/* navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                ? "bg-[#111827] text-white"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* user & logout */}
      <div className="p-4 border-gray-200 border-t-1">
        <Card className="p-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <UserCircle className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {user?.role === "admin" ? "Administrator" : "Employee"}
              </p>
            </div>
          </div>
        </Card>

        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start gap-3 text-gray-900 hover:text-gray-700 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
