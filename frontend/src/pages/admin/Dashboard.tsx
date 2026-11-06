import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { LiveClock } from "@/components/ui/LiveClock";
import { Select } from "@/components/ui/Select";
import { StatCard } from "@/components/ui/StatCard";
import {
  Users,
  UserCheck,
  Clock,
  AlertTriangle,
  UserX,
  Eye,
  X,
  Search,
} from "lucide-react";
import dayjs from "dayjs";

type AttendanceStatus = "ON_TIME" | "LATE" | "LEAVE" | "SICK" | "ABSENT";

type TodayAttendanceRecord = {
  id: number;
  employeeName: string;
  employeeCode: string;
  department: string;
  position: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: AttendanceStatus;
  checkInNote: string;
  checkInPhoto?: string | null;
  checkOutNote?: string | null;
  checkOutPhoto?: string | null;
};

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

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const todayDate = dayjs().format("YYYY-MM-DD");

  const todayRecords: TodayAttendanceRecord[] = [
    {
      id: 1,
      employeeName: "Elroy Kameo",
      employeeCode: "EMP-2026-001",
      department: "IT Department",
      position: "Software Engineer",
      date: todayDate,
      checkInTime: `${todayDate}T08:50:00`,
      checkOutTime: null,
      status: "ON_TIME",
      checkInNote:
        "Working on attendance dashboard features and camera capture verification.",
      checkInPhoto:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      checkOutNote: null,
      checkOutPhoto: null,
    },
    {
      id: 2,
      employeeName: "Sarah Wijaya",
      employeeCode: "EMP-2026-002",
      department: "Product Design",
      position: "UI/UX Designer",
      date: todayDate,
      checkInTime: `${todayDate}T08:58:00`,
      checkOutTime: `${todayDate}T17:32:00`,
      status: "ON_TIME",
      checkInNote:
        "Starting design system token audit and mobile responsive wireframes.",
      checkInPhoto:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      checkOutNote:
        "Completed mobile wireframes and handed off Figma specs to frontend.",
      checkOutPhoto:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      employeeName: "Budi Santoso",
      employeeCode: "EMP-2026-003",
      department: "IT Department",
      position: "Backend Engineer",
      date: todayDate,
      checkInTime: `${todayDate}T09:24:00`,
      checkOutTime: null,
      status: "LATE",
      checkInNote:
        "ISP outage in the morning, switched to mobile tethering for WFH.",
      checkInPhoto:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80",
      checkOutNote: null,
      checkOutPhoto: null,
    },
    {
      id: 4,
      employeeName: "Amanda Putri",
      employeeCode: "EMP-2026-004",
      department: "Human Resources",
      position: "HR Specialist",
      date: todayDate,
      checkInTime: null,
      checkOutTime: null,
      status: "LEAVE",
      checkInNote: "Scheduled annual family leave.",
      checkInPhoto: null,
      checkOutNote: null,
      checkOutPhoto: null,
    },
  ];

  const summary = {
    totalActiveEmployees: 24,
    totalAttended: 18,
    totalOnTime: 15,
    totalLate: 3,
    totalNotAttended: 6,
  };

  const filteredRecords = todayRecords.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    const matchSearch =
      !query ||
      item.employeeName.toLowerCase().includes(query) ||
      item.employeeCode.toLowerCase().includes(query) ||
      item.department.toLowerCase().includes(query) ||
      item.position.toLowerCase().includes(query);
    const matchStatus = !selectedStatus || item.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner + Live Clock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-zinc-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200">
              HR Monitoring
            </span>
            <h1 className="text-xl font-bold text-zinc-900 mt-2">
              Admin Dashboard
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Daily WFH Attendance Overview • {dayjs().format("DD MMMM YYYY")}
            </p>
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            Monitor real-time employee check-ins, work-from-home photo proofs,
            and daily activity notes.
          </p>
        </div>

        <LiveClock />
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Active Employees"
          value={summary.totalActiveEmployees}
          subtitle="Total registered"
          icon={<Users className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          title="Present Today"
          value={summary.totalAttended}
          subtitle="Checked in WFH"
          icon={<UserCheck className="w-5 h-5" />}
          variant="info"
        />
        <StatCard
          title="On Time"
          value={summary.totalOnTime}
          subtitle="Before 09:15 WIB"
          icon={<Clock className="w-5 h-5" />}
          variant="success"
        />
        <StatCard
          title="Late"
          value={summary.totalLate}
          subtitle="After 09:15 WIB"
          icon={<AlertTriangle className="w-5 h-5" />}
          variant="warning"
        />
        <StatCard
          title="Not Checked In"
          value={summary.totalNotAttended}
          subtitle="Pending check-in"
          icon={<UserX className="w-5 h-5" />}
          variant="default"
        />
      </div>

      {/* Today's Attendance Activity List */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-zinc-900">
              Today's Attendance Activity
            </h2>
            <p className="text-xs text-zinc-500">
              Latest employee attendance submissions for{" "}
              {dayjs().format("DD MMM YYYY")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-44">
              <Select
                placeholder="All Statuses"
                options={statusOptions}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredRecords.length > 0 ? (
          filteredRecords.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl border border-zinc-200 shadow-xs mt-4"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-sm text-zinc-900">
                    {item.employeeName}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {item.employeeCode} • {item.position} ({item.department})
                  </p>
                </div>
                <Badge variant={item.status}>
                  {getStatusLabel(item.status)}
                </Badge>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-100">
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
                      ? `${dayjs(item.checkInTime).format("HH:mm")} WIB`
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
                      ? `${dayjs(item.checkOutTime).format("HH:mm")} WIB`
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
                            title: `Check-In Photo: ${item.employeeName} (${dayjs(item.date).format("DD MMM YYYY")})`,
                          })
                        }
                        className="group relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 shrink-0 cursor-pointer focus:outline-none"
                        title="Click to view check-in photo"
                      >
                        <img
                          src={item.checkInPhoto}
                          alt={`${item.employeeName} Check-In Proof`}
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
                              title: `Check-Out Photo: ${item.employeeName} (${dayjs(item.date).format("DD MMM YYYY")})`,
                            })
                          }
                          className="group relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 shrink-0 cursor-pointer focus:outline-none"
                          title="Click to view check-out photo"
                        >
                          <img
                            src={item.checkOutPhoto}
                            alt={`${item.employeeName} Check-Out Proof`}
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
            No attendance records found for today.
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

export default Dashboard;
