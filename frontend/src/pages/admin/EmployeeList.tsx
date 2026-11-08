import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { sanitizeInput } from "@/utils/sanitize";
import {
  Plus,
  Edit2,
  UserX,
  AlertCircle,
  Search,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import {
  useDepartments,
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeactivateEmployee,
  type Department,
  type EmployeeRecord,
} from "@/hooks/useEmployees";

export type { Department, EmployeeRecord };

interface EmployeeFormData {
  id?: number;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  departmentId: number;
  position: string;
  joinDate: string;
  password?: string;
}

export const EmployeeList: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [isActive, setIsActive] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    employeeCode: "",
    name: "",
    email: "",
    phone: "",
    departmentId: 1,
    position: "",
    joinDate: dayjs().format("YYYY-MM-DD"),
    password: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [deactivateId, setDeactivateId] = useState<number | null>(null);

  const { data: departments = [] } = useDepartments();
  const { data: employees = [], isLoading } = useEmployees({
    search,
    departmentId,
    isActive,
  });

  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deactivateEmployee = useDeactivateEmployee();

  const isSubmitting = createEmployee.isPending || updateEmployee.isPending;

  const departmentOptions = departments.map((d) => ({
    value: String(d.id),
    label: d.name,
  }));

  const getDepartmentName = (emp: EmployeeRecord) =>
    emp.department?.name ||
    departments.find((d) => d.id === emp.departmentId)?.name ||
    "-";

  const resetForm = () => {
    setFormData({
      employeeCode: "",
      name: "",
      email: "",
      phone: "",
      departmentId: departments[0]?.id || 1,
      position: "",
      joinDate: dayjs().format("YYYY-MM-DD"),
      password: "",
    });
    setFormError(null);
    setIsEditing(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: EmployeeRecord) => {
    setFormData({
      id: emp.id,
      employeeCode: emp.employeeCode,
      name: emp.name,
      email: emp.email,
      phone: emp.phone || "",
      departmentId: emp.departmentId,
      position: emp.position,
      joinDate: emp.joinDate ? dayjs(emp.joinDate).format("YYYY-MM-DD") : "",
    });
    setIsEditing(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCode = sanitizeInput(formData.employeeCode).trim();
    const cleanName = sanitizeInput(formData.name).trim();
    const cleanEmail = sanitizeInput(formData.email).trim();
    const cleanPhone = sanitizeInput(formData.phone).trim();
    const cleanPosition = sanitizeInput(formData.position).trim();

    if (!cleanCode || !cleanName || !cleanEmail || !cleanPosition) {
      setFormError("Please fill in all required employee fields.");
      return;
    }

    if (!formData.departmentId) {
      setFormError("Please select a department first.");
      return;
    }

    try {
      if (isEditing && formData.id) {
        await updateEmployee.mutateAsync({
          id: formData.id,
          data: {
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            departmentId: Number(formData.departmentId),
            position: cleanPosition,
            joinDate: formData.joinDate,
          },
        });
      } else {
        await createEmployee.mutateAsync({
          employeeCode: cleanCode,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          departmentId: Number(formData.departmentId),
          position: cleanPosition,
          joinDate: formData.joinDate,
          password: formData.password,
        });
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setFormError(
        err.response?.data?.message || "Failed to save employee record.",
      );
    }
  };

  const handleDeactivate = async () => {
    if (deactivateId === null) return;
    try {
      await deactivateEmployee.mutateAsync(deactivateId);
      setDeactivateId(null);
    } catch {
      setDeactivateId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">
            Employee Management
          </h1>
          <p className="text-xs text-zinc-500">
            Add, update employee master records, and manage application login
            access.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenAdd}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search name, code, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="w-full sm:w-52">
            <Select
              placeholder="All Departments"
              options={departmentOptions}
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              searchable
            />
          </div>
        </div>

        <div className="w-full sm:w-44">
          <Select
            placeholder="All Statuses"
            options={[
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ]}
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
          />
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500 uppercase text-xs font-semibold border-b border-zinc-100">
              <tr>
                <th className="px-5 py-3.5">Code</th>
                <th className="px-5 py-3.5">Name & Contact</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Position</th>
                <th className="px-5 py-3.5">Join Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center">
                    <Loader2 className="w-5 h-5 animate-spin text-zinc-400 mx-auto" />
                  </td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => navigate(`/admin/employees/${emp.id}`)}
                    className="hover:bg-zinc-50/75 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4 font-mono font-semibold text-xs text-zinc-900 whitespace-nowrap">
                      {emp.employeeCode}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-zinc-900">{emp.name}</p>
                      <p className="text-xs text-zinc-500">{emp.email}</p>
                      {emp.phone && (
                        <p className="text-xs text-zinc-400">{emp.phone}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-700">
                      {getDepartmentName(emp)}
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-zinc-800">
                      {emp.position}
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-600 whitespace-nowrap">
                      {dayjs(emp.joinDate).format("DD MMM YYYY")}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={emp.isActive ? "ACTIVE" : "INACTIVE"}>
                        {emp.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td
                      className="px-5 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          onClick={() => handleOpenEdit(emp)}
                          className="px-2.5 py-1.5 text-xs"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        {emp.isActive === 1 && (
                          <Button
                            variant="secondary"
                            onClick={() => setDeactivateId(emp.id)}
                            className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                            title="Deactivate Employee"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-xs text-zinc-400"
                  >
                    No matching employee records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? "Update Employee Details" : "Add New Employee"}
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Employee Code"
              placeholder="EMP-2026-006"
              value={formData.employeeCode}
              onChange={(e) =>
                setFormData({ ...formData, employeeCode: e.target.value })
              }
              disabled={isEditing}
              required
            />

            <Input
              label="Full Name"
              placeholder="Employee Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="employee@dexa.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <Input
              label="Phone Number"
              placeholder="08123456789"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              placeholder="Select Department"
              options={departmentOptions}
              value={formData.departmentId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  departmentId: Number(e.target.value),
                })
              }
              searchable
              required
            />

            <Input
              label="Position / Role"
              placeholder="Software Engineer"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              required
            />
          </div>

          <Input
            label="Join Date"
            type="date"
            value={formData.joinDate}
            onChange={(e) =>
              setFormData({ ...formData, joinDate: e.target.value })
            }
            required
          />

          {!isEditing && (
            <Input
              label="Account Password (Default: password123)"
              type="password"
              placeholder="Leave blank for default password123"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              helperText="An employee login account will be created automatically."
            />
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {isEditing ? "Save Changes" : "Add Employee"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Deactivate Confirmation Modal */}
      <Modal
        isOpen={deactivateId !== null}
        onClose={() => setDeactivateId(null)}
        title="Confirm Employee Deactivation"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-600">
            Are you sure you want to deactivate this employee? Deactivated
            employees will no longer be able to sign in to the application.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeactivateId(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              isLoading={deactivateEmployee.isPending}
              onClick={handleDeactivate}
            >
              Yes, Deactivate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeList;
