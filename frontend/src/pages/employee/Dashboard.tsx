import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LiveClock } from "@/components/ui/LiveClock";
import { Select } from "@/components/ui/Select";
import { CalendarCheck, Camera, CheckCircle2, Eye, X } from "lucide-react";
import dayjs from "dayjs";

type HistoryStatus = "ON_TIME" | "LATE" | "LEAVE" | "SICK" | "ABSENT";

type HistoryData = {
  id: number;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: HistoryStatus;
  checkInNote: string;
  checkInPhoto?: string | null;
  checkOutNote?: string | null;
  checkOutPhoto?: string | null;
};

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

const getStatusLabel = (status: HistoryStatus) => {
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
  const [selectedMonth, setSelectedMonth] = useState<string>(() =>
    dayjs().format("MM"),
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const historyData: HistoryData[] = [
    {
      id: 1,
      date: "2026-11-01",
      checkInTime: "2026-11-01T08:45:00",
      checkOutTime: "2026-11-01T17:15:00",
      status: "ON_TIME",
      checkInNote: "Planning sprint tasks A, B, and C for project X.",
      checkInPhoto:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      checkOutNote:
        "Completed tasks A, B, and C and pushed PR for code review.",
      checkOutPhoto:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      date: "2026-11-02",
      checkInTime: "2026-11-02T09:15:00",
      checkOutTime: "2026-11-02T17:30:00",
      status: "LATE",
      checkInNote: "Traffic delay before switching to remote work.",
      checkInPhoto:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80",
      checkOutNote:
        "Wrapped up API integration and unit tests for auth module.",
      checkOutPhoto:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      date: "2026-11-03",
      checkInTime: null,
      checkOutTime: null,
      status: "LEAVE",
      checkInNote: "Annual leave",
      checkInPhoto: null,
      checkOutNote: null,
      checkOutPhoto: null,
    },
    {
      id: 4,
      date: "2026-11-04",
      checkInTime: null,
      checkOutTime: null,
      status: "SICK",
      checkInNote: "Medical leave",
      checkInPhoto: null,
      checkOutNote: null,
      checkOutPhoto: null,
    },
    {
      id: 5,
      date: "2026-11-05",
      checkInTime: null,
      checkOutTime: null,
      status: "ABSENT",
      checkInNote: "",
      checkInPhoto: null,
      checkOutNote: null,
      checkOutPhoto: null,
    },
    {
      id: 6,
      date: "2026-11-07",
      checkInTime: "2026-11-07T08:50:00",
      checkOutTime: null,
      status: "ON_TIME",
      checkInNote:
        "Working on attendance dashboard features and camera capture verification.",
      checkInPhoto:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      checkOutNote: null,
      checkOutPhoto: null,
    },
  ];

  const todayDate = dayjs().format("YYYY-MM-DD");
  const todayAttendance = historyData.find((item) => item.date === todayDate);

  const filteredData = historyData
    .filter((item) => {
      const matchMonth =
        !selectedMonth || dayjs(item.date).format("MM") === selectedMonth;
      const matchStatus = !selectedStatus || item.status === selectedStatus;
      return matchMonth && matchStatus;
    })
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-zinc-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200">
              Welcome Back,
            </span>
            <h2 className="text-xl font-bold text-zinc-900 mt-2">Elroy</h2>
            <p className="text-sm text-zinc-500 mt-0.5">
              Software Engineer • IT Department
            </p>
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            Please record your daily WFH attendance and departure with uploading
            proof of work photos from home.
          </p>
        </div>

        <LiveClock />
      </div>

      {/* Today's Attendance Card */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                Today's Attendance
              </h3>
              <p className="text-xs text-zinc-500">
                {dayjs().format("dddd, DD MMMM YYYY")}
              </p>
            </div>
          </div>

          <div>
            {todayAttendance?.checkOutTime ? (
              <Badge variant="ON_TIME">Completed</Badge>
            ) : todayAttendance?.checkInTime ? (
              <Badge variant={todayAttendance.status}>Checked In</Badge>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                Not Checked In
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 items-center">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-zinc-500">Work Schedule</p>
            <p className="text-sm font-semibold text-zinc-900">
              09:15 - 17:30 WIB
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-zinc-500">Check In</p>
            <p className="text-sm font-semibold text-zinc-900">
              {todayAttendance?.checkInTime
                ? `${dayjs(todayAttendance.checkInTime).format("HH:mm")} WIB`
                : "--:--"}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-zinc-500">Check Out</p>
            <p className="text-sm font-semibold text-zinc-900">
              {todayAttendance?.checkOutTime
                ? `${dayjs(todayAttendance.checkOutTime).format("HH:mm")} WIB`
                : "--:--"}
            </p>
          </div>
        </div>

        {todayAttendance?.checkInTime && (
          <div className="mt-5 pt-4 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Check-In Photo & Note */}
            <div className="flex items-start gap-3.5 bg-zinc-50/70 p-3.5 rounded-xl border border-zinc-100">
              {todayAttendance.checkInPhoto && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPhoto({
                      url: todayAttendance.checkInPhoto!,
                      title: `Check-In Photo (${dayjs(todayAttendance.date).format("DD MMM YYYY")})`,
                    })
                  }
                  className="group relative w-14 h-14 rounded-lg overflow-hidden border border-zinc-200 shrink-0 cursor-pointer focus:outline-none"
                  title="Click to view check-in photo"
                >
                  <img
                    src={todayAttendance.checkInPhoto}
                    alt="Today's Check-In Proof"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </button>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-600">
                  Check-In Note
                </p>
                <p className="text-xs text-zinc-700 mt-1 leading-relaxed">
                  {todayAttendance.checkInNote || "No check-in note provided."}
                </p>
              </div>
            </div>

            {/* Check-Out Photo & Note */}
            <div className="flex items-start gap-3.5 bg-zinc-50/70 p-3.5 rounded-xl border border-zinc-100">
              {todayAttendance.checkOutPhoto && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPhoto({
                      url: todayAttendance.checkOutPhoto!,
                      title: `Check-Out Photo (${dayjs(todayAttendance.date).format("DD MMM YYYY")})`,
                    })
                  }
                  className="group relative w-14 h-14 rounded-lg overflow-hidden border border-zinc-200 shrink-0 cursor-pointer focus:outline-none"
                  title="Click to view check-out photo"
                >
                  <img
                    src={todayAttendance.checkOutPhoto}
                    alt="Today's Check-Out Proof"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </button>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-600">
                  Check-Out Note
                </p>
                <p className="text-xs text-zinc-700 mt-1 leading-relaxed">
                  {todayAttendance.checkOutTime
                    ? todayAttendance.checkOutNote ||
                      "No check-out note provided."
                    : "Not checked out yet."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-5 mt-5 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">
            {!todayAttendance?.checkInTime
              ? "You haven't recorded your attendance today."
              : !todayAttendance?.checkOutTime
                ? "Don't forget to check out at the end of your workday."
                : "Your attendance record for today is complete."}
          </p>

          <div>
            {!todayAttendance?.checkInTime ? (
              <Link to="/employee/check-in">
                <Button icon={<Camera className="w-4 h-4" />}>
                  Check In Now
                </Button>
              </Link>
            ) : !todayAttendance?.checkOutTime ? (
              <Link to="/employee/check-out">
                <Button icon={<Camera className="w-4 h-4" />}>Check Out</Button>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                Done
              </span>
            )}
          </div>
        </div>
      </div>

      <div>
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

        {filteredData && filteredData.length > 0 ? (
          filteredData.map((item: HistoryData) => (
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
                            title: `Check-In Photo (${dayjs(item.date).format("DD MMM YYYY")})`,
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
                              title: `Check-Out Photo (${dayjs(item.date).format("DD MMM YYYY")})`,
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
            No attendance records found.
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
