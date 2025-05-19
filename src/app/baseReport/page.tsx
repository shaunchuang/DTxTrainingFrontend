"use client";

import { withAuth } from "../utils/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import DevelopmentMessage from "../components/DevelopmentMessage";

function BaseReportPage() {
  return (
    <DashboardLayout pageTitle="基本報表">
      <DevelopmentMessage feature="基本報表" />
    </DashboardLayout>
  );
}

export default withAuth(BaseReportPage);