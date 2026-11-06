import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LiveClock } from "@/components/ui/LiveClock";
import { Select } from "@/components/ui/Select";
import dayjs from "dayjs";

type HistoryStatus = "ON_TIME" | "LATE" | "LEAVE" | "SICK" | "ABSENT";

type HistoryData = {
  id: number;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: HistoryStatus;
  note: string;
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

  const historyData: HistoryData[] = [
    {
      id: 1,
      date: "2026-11-01",
      checkInTime: "2026-11-01T08:45:00",
      checkOutTime: "2026-11-01T17:15:00",
      status: "ON_TIME",
      note: "Worked on project X and completed tasks A, B, and C.",
    },
    {
      id: 2,
      date: "2026-11-02",
      checkInTime: "2026-11-02T09:15:00",
      checkOutTime: "2026-11-02T17:30:00",
      status: "LATE",
      note: "",
    },
    {
      id: 3,
      date: "2026-11-03",
      checkInTime: null,
      checkOutTime: null,
      status: "LEAVE",
      note: "Annual leave",
    },
    {
      id: 4,
      date: "2026-11-04",
      checkInTime: null,
      checkOutTime: null,
      status: "SICK",
      note: "Medical leave",
    },
    {
      id: 5,
      date: "2026-11-05",
      checkInTime: null,
      checkOutTime: null,
      status: "ABSENT",
      note: "",
    },
  ];

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
                <div>
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
                {item.checkOutTime ? (
                  <div>
                    <p className="text-sm text-zinc-600">Check Out</p>
                    <p className="font-medium text-sm text-zinc-900">
                      {`${dayjs(item.checkOutTime).format("HH:mm")} WIB`}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {dayjs(item.date).format("DD MMM YYYY")}
                    </p>
                  </div>
                ) : item.checkInTime ? (
                  <div>
                    <Button>Check Out</Button>
                  </div>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-500 mt-4">
            No attendance records found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
