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

export const EmployeeProfile = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Employee Profile</h1>
        <p className="text-xs text-zinc-500">
          Your personal details and employment information at Dexa.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-6 bg-zinc-900 text-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold">
              E
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Elroy</h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                EMP-D7322
              </p>
            </div>
          </div>
          <Badge variant="EMPLOYEE">Employee</Badge>
        </div>

        <div className="p-6 divide-y divide-zinc-100 text-sm">
          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Mail className="w-4 h-4 text-zinc-400" />
              Company Email
            </span>
            <span className="font-medium text-zinc-900">elroy@dexa.com</span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Phone className="w-4 h-4 text-zinc-400" />
              Phone Number
            </span>
            <span className="font-medium text-zinc-900">0827284623</span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Building2 className="w-4 h-4 text-zinc-400" />
              Department
            </span>
            <span className="font-medium text-zinc-900">IT Department</span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Briefcase className="w-4 h-4 text-zinc-400" />
              Position
            </span>
            <span className="font-medium text-zinc-900">
              Software Engineer
            </span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <Calendar className="w-4 h-4 text-zinc-400" />
              Join Date
            </span>
            <span className="font-medium text-zinc-900">
              {dayjs("2022-01-15").format("DD MMMM YYYY")}
            </span>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
              Access Role
            </span>
            <span className="font-medium text-zinc-900 font-mono text-xs">
              EMPLOYEE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
