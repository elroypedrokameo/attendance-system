import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

export const LiveClock: React.FC = () => {
  const [time, setTime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-xs flex flex-col justify-between h-full">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Server & WFH Time
        </p>
        <p className="text-sm font-medium text-zinc-800 mt-1">
          {time.format("dddd, DD MMMM YYYY")}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-100">
        <p className="text-2xl sm:text-3xl font-mono font-bold text-zinc-900 tracking-tight">
          {time.format("HH:mm:ss")}{" "}
          <span className="text-xs font-sans text-zinc-400 font-normal">
            WIB
          </span>
        </p>
        <p className="text-xs text-zinc-500 mt-1">On-Time Limit: 09:00 WIB</p>
      </div>
    </div>
  );
};
