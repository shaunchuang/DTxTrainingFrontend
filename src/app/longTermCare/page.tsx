"use client";

import { withAuth } from "../utils/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import DevelopmentMessage from "../components/DevelopmentMessage";

function LongTermCarePage() {
  return (
    <DashboardLayout pageTitle="長照申報管理">
      <DevelopmentMessage feature="長照申報管理" />
    </DashboardLayout>
  );
}

export default withAuth(LongTermCarePage);