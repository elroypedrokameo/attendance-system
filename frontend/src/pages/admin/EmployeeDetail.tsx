import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import { useEmployeeDetail } from "@/hooks/useEmployees";
import {
  useAdminAttendances,
  formatWibTime,
  type AttendanceStatus,
} from "@/hooks/useAttendance";

const monthOptions = [
  { value: "", label: "All Months" },
  ...Array.from({ length: 12 }, (_, i) => {
    const d = dayjs().month(i);
    return {
      value: d.format("MM"),
      label: d.format("MMMM"),
    };
  }),
];

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "ON_TIME", label: "On Time" },
  { value: "LATE", label: "Late" },
  { value: "LEAVE", label: "Leave" },
  { value: "SICK", label: "Sick" },
  { value: "ABSENT", label: "Absent" },
];

const getStatusLabel = (status: AttendanceStatus) => {
  switch (status) {
    case "ON_TIME":
      return "On Time";
    case "LATE":
      return "Late";
    case "LEAVE":
      return "Leave";
    case "SICK":
      return "Sick";
    case "ABSENT":
      return "Absent";
    default:
      return status;
  }
};

export const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState<string>(() =>
    dayjs().format("MM"),
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const employeeId = Number(id);

  const { data: employee, isLoading: isEmployeeLoading } =
    useEmployeeDetail(employeeId);

  const { data: records = [], isLoading: isRecordsLoading } =
    useAdminAttendances(
      {
        employeeId,
        month: selectedMonth,
        status: selectedStatus,
      },
      Boolean(employeeId),
    );

  if (isEmployeeLoading || !employee) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  const departmentName = employee.department?.name || "-";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/employees")}
          icon={<ArrowLeft className="w-4 h-4" />}
          className="text-xs"
        >
          Back to Employees
        </Button>
      </div>

      {/* Employee Info Card */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center text-base font-bold shrink-0">
              {employee.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-900">
                {employee.name}
              </h1>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                {employee.employeeCode}
              </p>
            </div>
          </div>

          <div>
            <Badge variant={employee.isActive ? "ACTIVE" : "INACTIVE"}>
              {employee.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-5 text-xs">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Building2 className="w-3.5 h-3.5 text-zinc-400" />
              Department
            </span>
            <span className="font-semibold text-zinc-900 text-sm">
              {departmentName}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
              Position
            </span>
            <span className="font-semibold text-zinc-900 text-sm">
              {employee.position}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              Email
            </span>
            <span className="font-semibold text-zinc-900 text-sm truncate">
              {employee.email}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              Phone
            </span>
            <span className="font-semibold text-zinc-900 text-sm">
              {employee.phone || "-"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              Join Date
            </span>
            <span className="font-semibold text-zinc-900 text-sm">
              {dayjs(employee.joinDate).format("DD MMM YYYY")}
            </span>
          </div>
        </div>
      </div>

      {/* Attendance History Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-zinc-900">
              Attendance History
            </h2>
            <p className="text-xs text-zinc-500">
              Check-in, check-out, WFH photo proofs, and daily work notes for{" "}
              {employee.name}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-44">
              <Select
                placeholder="All Months"
                options={monthOptions}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                placeholder="All Statuses"
                options={statusOptions}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isRecordsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : records.length > 0 ? (
          records.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl border border-zinc-200 shadow-xs mt-4"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm text-zinc-900">
                  {dayjs(item.date).format("DD MMM YYYY")}
                </p>
                <Badge variant={item.status}>
                  {getStatusLabel(item.status)}
                </Badge>
              </div>

              <div className="flex justify-between items-center mt-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-zinc-600">Work Schedule</p>
                  <p className="font-medium text-sm text-zinc-900">
                    09:15 - 17:30
                  </p>
                  <p className="text-xs text-zinc-500">
                    {dayjs(item.date).format("DD MMM YYYY")}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-zinc-600">Check In</p>
                  <p className="font-medium text-sm text-zinc-900">
                    {item.checkInTime
                      ? `${formatWibTime(item.checkInTime)} WIB`
                      : "-"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {dayjs(item.date).format("DD MMM YYYY")}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-zinc-600">Check Out</p>
                  <p className="font-medium text-sm text-zinc-900">
                    {item.checkOutTime
                      ? `${formatWibTime(item.checkOutTime)} WIB`
                      : "-"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {dayjs(item.date).format("DD MMM YYYY")}
                  </p>
                </div>
              </div>

              {(item.checkInPhoto ||
                item.checkInNote ||
                item.checkOutPhoto ||
                item.checkOutNote) && (
                <div className="mt-4 pt-3.5 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Check-In Photo & Note */}
                  <div className="flex items-start gap-3 bg-zinc-50/70 p-3 rounded-lg border border-zinc-100">
                    {item.checkInPhoto && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPhoto({
                            url: item.checkInPhoto!,
                            title: `Check-In Photo: ${employee.name} (${dayjs(item.date).format("DD MMM YYYY")})`,
                          })
                        }
                        className="group relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 shrink-0 cursor-pointer focus:outline-none"
                        title="Click to view check-in photo"
                      >
                        <img
                          src={item.checkInPhoto}
                          alt="Check-In Proof"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-3.5 h-3.5 text-white" />
                        </div>
                      </button>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-600">
                        {item.checkInTime ? "Check-In Note" : "Attendance Note"}
                      </p>
                      <p className="text-xs text-zinc-700 mt-0.5 leading-relaxed">
                        {item.checkInNote || "No note provided."}
                      </p>
                    </div>
                  </div>

                  {/* Check-Out Photo & Note */}
                  {item.checkInTime && (
                    <div className="flex items-start gap-3 bg-zinc-50/70 p-3 rounded-lg border border-zinc-100">
                      {item.checkOutPhoto && (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPhoto({
                              url: item.checkOutPhoto!,
                              title: `Check-Out Photo: ${employee.name} (${dayjs(item.date).format("DD MMM YYYY")})`,
                            })
                          }
                          className="group relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 shrink-0 cursor-pointer focus:outline-none"
                          title="Click to view check-out photo"
                        >
                          <img
                            src={item.checkOutPhoto}
                            alt="Check-Out Proof"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-3.5 h-3.5 text-white" />
                          </div>
                        </button>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-600">
                          Check-Out Note
                        </p>
                        <p className="text-xs text-zinc-700 mt-0.5 leading-relaxed">
                          {item.checkOutTime
                            ? item.checkOutNote || "No check-out note provided."
                            : "Not checked out yet."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-500 mt-4">
            No attendance records found for this employee.
          </p>
        )}
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
              <h4 className="text-sm font-bold text-zinc-900">
                {selectedPhoto.title}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-zinc-950 flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-auto rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;
