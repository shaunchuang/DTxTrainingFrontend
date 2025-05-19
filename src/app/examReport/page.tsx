"use client";

import { withAuth } from "../utils/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import DevelopmentMessage from "../components/DevelopmentMessage";

function ExamReportPage() {
  return (
    <DashboardLayout pageTitle="檢測報告">
      <DevelopmentMessage feature="檢測報告" />
    </DashboardLayout>
  );
}

export default withAuth(ExamReportPage);