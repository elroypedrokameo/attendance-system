import { Badge } from "@/components/ui/Badge";
import { LiveClock } from "@/components/ui/LiveClock";
import dayjs from "dayjs";

type HistoryData = {
  id: number;
  date: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: "ON_TIME" | "LATE";
  note: string;
};

const Dashboard = () => {
  const historyData: HistoryData[] = [
    {
      id: 1,
      date: "2024-06-01",
      checkInTime: "2024-06-01T08:45:00",
      checkOutTime: "2024-06-01T17:15:00",
      status: "ON_TIME",
      note: "Worked on project X and completed tasks A, B, and C.",
    },
    {
      id: 2,
      date: "2024-06-02",
      checkInTime: "2024-06-02T09:15:00",
      checkOutTime: "2024-06-02T17:30:00",
      status: "LATE",
      note: "",
    },
  ];

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

      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-zinc-900">
            Last Attendance History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Check In Time</th>
                <th className="px-4 py-3">Check Out Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {historyData && historyData.length > 0 ? (
                historyData.map((item: HistoryData) => (
                  <tr key={item.id} className="hover:bg-zinc-50/75">
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {dayjs(item.date).format("DD MMM YYYY")}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {dayjs(item.checkInTime).format("HH:mm")} WIB
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {item.checkOutTime
                        ? `${dayjs(item.checkOutTime).format("HH:mm")} WIB`
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={item.status}>
                        {item.status === "ON_TIME" ? "On Time" : "Late"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 truncate max-w-xs">
                      {item.note || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-xs text-zinc-400"
                  >
                    No attendance history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
