import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Pengajuan from "../pages/surat/Pengajuan";
import DetailPengajuan from "../pages/surat/DetailPengajuan";
import SuratTerbit from "../pages/surat/SuratTerbit";
import DetailSurat from "../pages/surat/DetailSurat";

import TemplateList from "../pages/templates/TemplateList";
import TemplateCreate from "../pages/templates/TemplateCreate";
import TemplateEdit from "../pages/templates/TemplateEdit";
import TemplateDetail from "../pages/templates/TemplateDetail";

import Organization from "../pages/settings/Organization";
import VerifySurat from "../pages/verification/VerifySurat";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Signature from "../pages/settings/Signature";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={<Login />}
          />
        </Route>

        <Route
          path="/verify/:token"
          element={<VerifySurat />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route element={<DashboardLayout />}>
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/pengajuan"
                element={<Pengajuan />}
              />

              <Route
                path="/pengajuan/:type/:id"
                element={<DetailPengajuan />}
              />

              <Route
                path="/surat"
                element={<SuratTerbit />}
              />

              <Route
                path="/surat/:id"
                element={<DetailSurat />}
              />

              <Route
                path="/templates"
                element={<TemplateList />}
              />

              <Route
                path="/templates/create"
                element={<TemplateCreate />}
              />

              <Route
                path="/templates/:id/edit"
                element={<TemplateEdit />}
              />

              <Route
                path="/templates/:id"
                element={<TemplateDetail />}
              />

              <Route
                path="/settings/organization"
                element={<Organization />}
              />
            </Route>
          </Route>
        </Route>

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="/settings/signature"
          element={<Signature />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;