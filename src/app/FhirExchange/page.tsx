"use client";

import { withAuth } from "../utils/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import DevelopmentMessage from "../components/DevelopmentMessage";

function FhirExchangePage() {
  return (
    <DashboardLayout pageTitle="FHIR醫資交換">
      <DevelopmentMessage feature="FHIR醫資交換" />
    </DashboardLayout>
  );
}

export default withAuth(FhirExchangePage);