"use client";

import { withAuth } from "../utils/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import DevelopmentMessage from "../components/DevelopmentMessage";

function IndicatorPage() {
  return (
    <DashboardLayout pageTitle="單位指標">
      <DevelopmentMessage feature="單位指標" />
    </DashboardLayout>
  );
}

export default withAuth(IndicatorPage);