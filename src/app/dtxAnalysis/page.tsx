"use client";

import { withAuth } from "../utils/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import DevelopmentMessage from "../components/DevelopmentMessage";

function DtxAnalysisPage() {
  return (
    <DashboardLayout pageTitle="數位治療分析">
      <DevelopmentMessage feature="數位治療分析" />
    </DashboardLayout>
  );
}

export default withAuth(DtxAnalysisPage);