import { Badge } from "@/components/ui/Badge";
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import dayjs from "dayjs";
import { useAuth } from "@/context/AuthContext";

type ProfileRole = "ADMIN" | "EMPLOYEE";

interface ProfileProps {
  role: ProfileRole;
}

export const Profile = ({ role }: ProfileProps) => {
  const { user } = useAuth();

  const isEmployee = (user?.role || role) === "EMPLOYEE";
  const title = isEmployee ? "Employee Profile" : "Admin Profile";
  const subtitle = isEmployee
    ? "Your personal details and employment information at Dexa."
    : "Your administrator account details and HR role information at Dexa.";

  const name = user?.name || "-";
  const employeeCode = user?.employeeCode || "-";
  const email = user?.email || "-";
  const phone = user?.phone || "-";
  const department = user?.department || "-";
  const position = user?.position || "-";
  const joinDate = user?.joinDate || null;
  const userRole = user?.role || role;
  const roleLabel = userRole === "ADMIN" ? "Admin" : "Employee";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">{title}</h1>
        <p className="text-xs text-zinc-500">{subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-6 bg-zinc-900 text-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{name}</h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {employeeCode}
              </p>
            </div>
          </div>
          <Badge variant={userRole}>{roleLabel}</Badge>
        </div>

        <div className="p-6 divide-y divide-zinc-100 text-sm">
          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Mail className="w-4 h-4 text-zinc-400" />
              Company Email
            </span>
            <span className="font-medium text-zinc-900">{email}</span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Phone className="w-4 h-4 text-zinc-400" />
              Phone Number
            </span>
            <span className="font-medium text-zinc-900">{phone}</span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Building2 className="w-4 h-4 text-zinc-400" />
              Department
            </span>
            <span className="font-medium text-zinc-900">{department}</span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Briefcase className="w-4 h-4 text-zinc-400" />
              Position
            </span>
            <span className="font-medium text-zinc-900">{position}</span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Calendar className="w-4 h-4 text-zinc-400" />
              Join Date
            </span>
            <span className="font-medium text-zinc-900">
              {joinDate ? dayjs(joinDate).format("DD MMMM YYYY") : "-"}
            </span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
              Access Role
            </span>
            <span className="font-medium text-zinc-900 font-mono text-xs">
              {userRole}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
