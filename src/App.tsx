import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/portal/Login";
import PortalLayout from "./components/portal/PortalLayout";
import ProtectedRoute from "./components/portal/ProtectedRoute";
import PortalHome from "./pages/portal/Home";
import AdminClients from "./pages/portal/admin/Clients";
import AdminPackages from "./pages/portal/admin/Packages";
import AdminInvoices from "./pages/portal/admin/Invoices";
import AdminWebsites from "./pages/portal/admin/Websites";
import AdminAllowlist from "./pages/portal/admin/Allowlist";
import MyInvoices from "./pages/portal/client/MyInvoices";
import MyWebsites from "./pages/portal/client/MyWebsites";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/portal/login" element={<Login />} />
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <PortalLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PortalHome />} />
              {/* Admin */}
              <Route path="clients" element={<ProtectedRoute requireAdmin><AdminClients /></ProtectedRoute>} />
              <Route path="packages" element={<ProtectedRoute requireAdmin><AdminPackages /></ProtectedRoute>} />
              <Route path="invoices" element={<ProtectedRoute requireAdmin><AdminInvoices /></ProtectedRoute>} />
              <Route path="websites" element={<ProtectedRoute requireAdmin><AdminWebsites /></ProtectedRoute>} />
              <Route path="allowlist" element={<ProtectedRoute requireAdmin><AdminAllowlist /></ProtectedRoute>} />
              {/* Client */}
              <Route path="my-invoices" element={<MyInvoices />} />
              <Route path="my-websites" element={<MyWebsites />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
