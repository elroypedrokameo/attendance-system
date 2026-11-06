import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import EmployeeDashboard from "@/pages/employee/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";

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

          <Route path="/employee">
            <Route
              index
              element={<Navigate to="/employee/dashboard" replace />}
            ></Route>
            <Route path="dashboard" element={<EmployeeDashboard />} />
          </Route>

          <Route path="/admin">
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
