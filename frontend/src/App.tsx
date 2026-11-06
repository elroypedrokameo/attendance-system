import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import EmployeeDashboard from "@/pages/employee/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import { EmployeeLayout } from "@/layouts/EmployeeLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { EmployeeCheckIn } from "./pages/employee/CheckIn";
import { EmployeeCheckOut } from "./pages/employee/CheckOut";
import { EmployeeProfile } from "./pages/employee/Profile";

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
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/employee" element={<EmployeeLayout />}>
            <Route
              index
              element={<Navigate to="/employee/dashboard" replace />}
            ></Route>
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="check-in" element={<EmployeeCheckIn />} />
            <Route path="check-out" element={<EmployeeCheckOut />} />
            <Route path="profile" element={<EmployeeProfile />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route
              index
              element={<Navigate to="/admin/dashboard" replace />}
            ></Route>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
