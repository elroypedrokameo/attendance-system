import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import Login from "@/pages/Login";
import EmployeeDashboard from "@/pages/employee/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import EmployeeList from "@/pages/admin/EmployeeList";
import EmployeeDetail from "@/pages/admin/EmployeeDetail";
import { EmployeeLayout } from "@/layouts/EmployeeLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AttendanceAction } from "./pages/employee/AttendanceAction";
import { Profile } from "@/pages/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/employee"
              element={
                <ProtectedRoute allowedRole="EMPLOYEE">
                  <EmployeeLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/employee/dashboard" replace />}
              />
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="check-in" element={<AttendanceAction mode="in" />} />
              <Route
                path="check-out"
                element={<AttendanceAction mode="out" />}
              />
              <Route path="profile" element={<Profile role="EMPLOYEE" />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="employees" element={<EmployeeList />} />
              <Route path="employees/:id" element={<EmployeeDetail />} />
              <Route path="profile" element={<Profile role="ADMIN" />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
