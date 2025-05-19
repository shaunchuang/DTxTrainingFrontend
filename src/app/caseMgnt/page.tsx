"use client";

import { withAuth } from "../utils/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import DevelopmentMessage from "../components/DevelopmentMessage";

function CaseManagementPage() {
  return (
    <DashboardLayout pageTitle="個案管理">
      <DevelopmentMessage feature="個案管理" />
    </DashboardLayout>
  );
}

export default withAuth(CaseManagementPage);