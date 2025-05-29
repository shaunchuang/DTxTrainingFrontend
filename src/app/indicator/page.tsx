"use client";

import { useAuth } from "../utils/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import DevelopmentMessage from "../components/DevelopmentMessage";

export default function IndicatorPage() {
  const { user, loading, tokenVerified } = useAuth();
  const router = useRouter();

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
    <DashboardLayout pageTitle="單位指標">
      <DevelopmentMessage feature="單位指標" />
    </DashboardLayout>
  );
}