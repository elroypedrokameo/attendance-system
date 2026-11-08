import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export type AttendanceStatus =
  | "ON_TIME"
  | "LATE"
  | "LEAVE"
  | "SICK"
  | "ABSENT";

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: AttendanceStatus;
  checkInNote: string | null;
  checkInPhoto?: string | null;
  checkOutNote?: string | null;
  checkOutPhoto?: string | null;
}

export interface AdminAttendanceRecord extends AttendanceRecord {
  employeeName: string;
  employeeCode: string;
  department: string;
  position: string;
}

export interface SummaryMetrics {
  totalActiveEmployees: number;
  totalAttended: number;
  totalOnTime: number;
  totalLate: number;
  totalNotAttended: number;
}

export interface AttendanceHistoryFilters {
  month?: string;
  status?: string;
}

export interface AdminAttendanceFilters {
  date?: string;
  month?: string;
  employeeId?: number;
  status?: string;
}

export interface SubmitAttendancePayload {
  photo: File;
  note?: string;
}

export const attendanceKeys = {
  all: ["attendance"] as const,
  today: () => [...attendanceKeys.all, "today"] as const,
  histories: () => [...attendanceKeys.all, "history"] as const,
  history: (filters: AttendanceHistoryFilters) =>
    [...attendanceKeys.histories(), filters] as const,
  lists: () => [...attendanceKeys.all, "list"] as const,
  list: (filters: AdminAttendanceFilters) =>
    [...attendanceKeys.lists(), filters] as const,
  summaries: () => [...attendanceKeys.all, "summary"] as const,
  summary: (date: string) => [...attendanceKeys.summaries(), date] as const,
};

export const useTodayAttendance = () => {
  return useQuery<AttendanceRecord | null>({
    queryKey: attendanceKeys.today(),
    queryFn: async () => {
      const res = await apiClient.get("/attendance/today");
      return res.data?.data || null;
    },
  });
};

export const useAttendanceHistory = (filters: AttendanceHistoryFilters) => {
  return useQuery<AttendanceRecord[]>({
    queryKey: attendanceKeys.history(filters),
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters.month) params.month = filters.month;
      if (filters.status) params.status = filters.status;

      const res = await apiClient.get("/attendance/history", { params });
      return res.data?.data || [];
    },
  });
};

export const useAdminAttendances = (
  filters: AdminAttendanceFilters,
  enabled = true,
) => {
  return useQuery<AdminAttendanceRecord[]>({
    queryKey: attendanceKeys.list(filters),
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (filters.date) params.date = filters.date;
      if (filters.month) params.month = filters.month;
      if (filters.employeeId) params.employeeId = filters.employeeId;
      if (filters.status) params.status = filters.status;

      const res = await apiClient.get("/attendance", { params });
      return res.data?.data || [];
    },
    enabled,
  });
};

export const useAttendanceSummary = (date: string) => {
  return useQuery<SummaryMetrics>({
    queryKey: attendanceKeys.summary(date),
    queryFn: async () => {
      const res = await apiClient.get("/attendance/summary", {
        params: { date },
      });
      return res.data?.data;
    },
  });
};

export const useSubmitAttendance = (mode: "in" | "out") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ photo, note }: SubmitAttendancePayload) => {
      const formData = new FormData();
      formData.append("photo", photo);
      if (note) {
        formData.append("note", note);
      }

      const endpoint =
        mode === "out" ? "/attendance/check-out" : "/attendance/check-in";

      const res = await apiClient.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to submit attendance.");
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
  });
};

