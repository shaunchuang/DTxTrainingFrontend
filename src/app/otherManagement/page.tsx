"use client";

import { withAuth } from "../utils/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import DevelopmentMessage from "../components/DevelopmentMessage";

function OtherManagementPage() {
  return (
    <DashboardLayout pageTitle="其他設定管理">
      <DevelopmentMessage feature="其他設定管理" />
    </DashboardLayout>
  );
}

export default withAuth(OtherManagementPage);