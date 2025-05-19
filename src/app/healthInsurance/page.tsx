"use client";

import { withAuth } from "../utils/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import DevelopmentMessage from "../components/DevelopmentMessage";

function HealthInsurancePage() {
  return (
    <DashboardLayout pageTitle="健保申報管理">
      <DevelopmentMessage feature="健保申報管理" />
    </DashboardLayout>
  );
}

export default withAuth(HealthInsurancePage);