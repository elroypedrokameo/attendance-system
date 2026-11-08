import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { attendanceKeys } from "@/hooks/useAttendance";

export interface Department {
  id: number;
  name: string;
}

export interface EmployeeRecord {
  id: number;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  departmentId: number;
  department?: Department;
  position: string;
  joinDate: string;
  isActive: number;
}

export interface EmployeeFilters {
  search?: string;
  departmentId?: string;
  isActive?: string;
}

export interface CreateEmployeePayload {
  employeeCode: string;
  name: string;
  email: string;
  phone?: string;
  departmentId: number;
  position: string;
  joinDate: string;
  password?: string;
}

export interface UpdateEmployeePayload {
  id: number;
  data: {
    name: string;
    email: string;
    phone?: string;
    departmentId: number;
    position: string;
    joinDate: string;
  };
}

export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (filters: EmployeeFilters) =>
    [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
  departments: () => [...employeeKeys.all, "departments"] as const,
};

export const useDepartments = () => {
  return useQuery<Department[]>({
    queryKey: employeeKeys.departments(),
    queryFn: async () => {
      const res = await apiClient.get("/employees/departments");
      return res.data?.data || [];
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useEmployees = (filters: EmployeeFilters) => {
  return useQuery<EmployeeRecord[]>({
    queryKey: employeeKeys.list(filters),
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters.search?.trim()) params.search = filters.search.trim();
      if (filters.departmentId) params.departmentId = filters.departmentId;
      if (filters.isActive !== undefined && filters.isActive !== "") {
        params.isActive = filters.isActive;
      }

      const res = await apiClient.get("/employees", { params });
      return res.data?.data || [];
    },
  });
};

export const useEmployeeDetail = (id: number) => {
  return useQuery<EmployeeRecord>({
    queryKey: employeeKeys.detail(id),
    queryFn: async () => {
      const res = await apiClient.get(`/employees/${id}`);
      return res.data?.data;
    },
    enabled: Boolean(id),
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateEmployeePayload) => {
      const res = await apiClient.post("/employees", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.summaries() });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateEmployeePayload) => {
      const res = await apiClient.patch(`/employees/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: employeeKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
    },
  });
};

export const useDeactivateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.delete(`/employees/${id}`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.summaries() });
    },
  });
};

