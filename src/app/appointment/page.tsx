"use client";

import { withAuth } from "../utils/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import DevelopmentMessage from "../components/DevelopmentMessage";

function AppointmentPage() {
  return (
    <DashboardLayout pageTitle="預約掛號">
      <DevelopmentMessage feature="預約掛號" />
    </DashboardLayout>
  );
}

export default withAuth(AppointmentPage);