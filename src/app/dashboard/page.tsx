"use client";

import { useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { useRouter } from "next/navigation";
import DashboardLayout from "../components/layout/DashboardLayout";
import PatientDashboardContent from "./PatientDashboardContent";
import StandardDashboardContent from "./StandardDashboardContent";

export default function Dashboard() {
  const { user, loading, tokenVerified } = useAuth();
  const router = useRouter();
  
  // 檢查是否為個案角色
  const isPatient = user?.roles?.some(role => role.alias === 'CASE') || false;

  useEffect(() => {
    if (!loading && (!user || !tokenVerified)) {
      router.replace('/');
    }
  }, [loading, user, tokenVerified, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || !tokenVerified) {
    return null;
  }
  return (
    <DashboardLayout pageTitle={isPatient ? "個案儀表板" : "儀表板"}>
      {isPatient ? (
        <PatientDashboardContent />
      ) : (
        <StandardDashboardContent />
      )}
    </DashboardLayout>
  );
}
