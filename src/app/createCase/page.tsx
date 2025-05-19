"use client";

import { withAuth } from "../utils/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import DevelopmentMessage from "../components/DevelopmentMessage";

function CreateCasePage() {
  return (
    <DashboardLayout pageTitle="建立個案">
      <DevelopmentMessage feature="建立個案" />
    </DashboardLayout>
  );
}

export default withAuth(CreateCasePage);