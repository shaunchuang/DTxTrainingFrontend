"use client";

import DashboardLayout from "../components/layout/DashboardLayout";
import { useState } from "react";

export default function TrainingRecord() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // 模擬數據
  const trainingData = [
    {
      date: "2024-12-28",
      type: "認知訓練",
      duration: "30分鐘",
      score: 85,
      status: "已完成",
      notes: "專注力有所提升，反應時間縮短"
    },
    {
      date: "2024-12-27",
      type: "語言治療",
      duration: "45分鐘",
      score: 78,
      status: "已完成",
      notes: "發音更加清晰，語調自然"
    },
    {
      date: "2024-12-26",
      type: "職能治療",
      duration: "60分鐘",
      score: 92,
      status: "已完成",
      notes: "日常動作執行順暢，協調性佳"
    },
    {
      date: "2024-12-25",
      type: "認知訓練",
      duration: "30分鐘",
      score: 80,
      status: "已完成",
      notes: "記憶力測試表現良好"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <DashboardLayout pageTitle="檢視紀錄">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                訓練記錄總覽
              </h2>
              <p className="text-gray-600">
                檢視您的訓練進度和表現記錄
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedPeriod("week")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === "week"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                本週
              </button>
              <button
                onClick={() => setSelectedPeriod("month")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === "month"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                本月
              </button>
              <button
                onClick={() => setSelectedPeriod("year")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === "year"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                今年
              </button>
            </div>
          </div>

          {/* 統計卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">總訓練時間</div>
              <div className="text-2xl font-bold">165分鐘</div>
              <div className="text-sm opacity-90">本週</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">完成次數</div>
              <div className="text-2xl font-bold">4次</div>
              <div className="text-sm opacity-90">本週</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">平均分數</div>
              <div className="text-2xl font-bold">83.8</div>
              <div className="text-sm opacity-90">分</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">連續天數</div>
              <div className="text-2xl font-bold">4天</div>
              <div className="text-sm opacity-90">連續訓練</div>
            </div>
          </div>

          {/* 訓練記錄表格 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">詳細記錄</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">日期</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">訓練類型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">訓練時長</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">評分</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">狀態</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">備註</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingData.map((record, index) => (
                    <tr key={index} className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">
                        {record.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">
                        <span className="font-medium">{record.type}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">
                        {record.duration}
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(record.score)}`}>
                          {record.score}分
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-b max-w-xs truncate">
                        {record.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 進度圖表區域 */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">進度趨勢</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-center text-gray-500 py-8">
                <div className="text-lg mb-2">📈</div>
                <p>進度圖表將在此顯示</p>
                <p className="text-sm">包含分數趨勢、訓練頻率等統計資訊</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
