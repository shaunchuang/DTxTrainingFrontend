"use client";

import { withAuth } from "../utils/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import DevelopmentMessage from "../components/DevelopmentMessage";

function TrackTracePage() {
  return (
    <DashboardLayout pageTitle="排程追蹤">
      <DevelopmentMessage feature="排程追蹤" />
    </DashboardLayout>
  );
}

export default withAuth(TrackTracePage);