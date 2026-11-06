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

type ProfileRole = "ADMIN" | "EMPLOYEE";

interface ProfileProps {
  role: ProfileRole;
}

type ProfileData = {
  title: string;
  subtitle: string;
  name: string;
  employeeCode: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  role: ProfileRole;
  roleLabel: string;
};

const PROFILE_BY_ROLE: Record<ProfileRole, ProfileData> = {
  EMPLOYEE: {
    title: "Employee Profile",
    subtitle: "Your personal details and employment information at Dexa.",
    name: "Elroy",
    employeeCode: "EMP-D7322",
    email: "elroy@dexa.com",
    phone: "0827284623",
    department: "IT Department",
    position: "Software Engineer",
    joinDate: "2022-01-15",
    role: "EMPLOYEE",
    roleLabel: "Employee",
  },
  ADMIN: {
    title: "Admin Profile",
    subtitle:
      "Your administrator account details and HR role information at Dexa.",
    name: "Elroy",
    employeeCode: "ADM-HR001",
    email: "admin.hr@dexa.com",
    phone: "08129483721",
    department: "Human Resources",
    position: "HR Administrator",
    joinDate: "2020-06-10",
    role: "ADMIN",
    roleLabel: "Admin",
  },
};

export const Profile = ({ role }: ProfileProps) => {
  const data = PROFILE_BY_ROLE[role];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">{data.title}</h1>
        <p className="text-xs text-zinc-500">{data.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-6 bg-zinc-900 text-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold">
              {data.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{data.name}</h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {data.employeeCode}
              </p>
            </div>
          </div>
          <Badge variant={data.role}>{data.roleLabel}</Badge>
        </div>

        <div className="p-6 divide-y divide-zinc-100 text-sm">
          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Mail className="w-4 h-4 text-zinc-400" />
              Company Email
            </span>
            <span className="font-medium text-zinc-900">{data.email}</span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Phone className="w-4 h-4 text-zinc-400" />
              Phone Number
            </span>
            <span className="font-medium text-zinc-900">{data.phone}</span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Building2 className="w-4 h-4 text-zinc-400" />
              Department
            </span>
            <span className="font-medium text-zinc-900">{data.department}</span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Briefcase className="w-4 h-4 text-zinc-400" />
              Position
            </span>
            <span className="font-medium text-zinc-900">{data.position}</span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Calendar className="w-4 h-4 text-zinc-400" />
              Join Date
            </span>
            <span className="font-medium text-zinc-900">
              {dayjs(data.joinDate).format("DD MMMM YYYY")}
            </span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
              Access Role
            </span>
            <span className="font-medium text-zinc-900 font-mono text-xs">
              {data.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
