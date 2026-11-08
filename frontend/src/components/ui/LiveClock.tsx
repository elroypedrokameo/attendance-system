import React, { useState, useEffect } from "react";
import { useServerTime } from "@/hooks/useAttendance";

export const LiveClock: React.FC = () => {
  const { data } = useServerTime();
  const [nowPerfMs, setNowPerfMs] = useState(() => performance.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowPerfMs(performance.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentEpochMs = data?.serverData?.timestamp
    ? data.serverData.timestamp + Math.max(0, nowPerfMs - data.fetchedAtPerfMs)
    : Date.now();

  const currentDate = new Date(currentEpochMs);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(currentDate);

  const formattedTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(currentDate);

  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-xs flex flex-col justify-between h-full">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Server & WFH Time
        </p>
        <p className="text-sm font-medium text-zinc-800 mt-1">{formattedDate}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-100">
        <p className="text-2xl sm:text-3xl font-mono font-bold text-zinc-900 tracking-tight">
          {formattedTime}{" "}
          <span className="text-xs font-sans text-zinc-400 font-normal">
            WIB
          </span>
        </p>
        <p className="text-xs text-zinc-500 mt-1">On-Time Limit: 09:15 WIB</p>
      </div>
    </div>
  );
};
