"use client";

import { useState, useEffect } from "react";

interface PatientTrainingStats {
  completedTrainings: number;
  pendingTrainings: number;
  progress: number;
}

export default function PatientDashboardContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 模擬訓練統計數據
  const [trainingStats, setTrainingStats] = useState<PatientTrainingStats>({
    completedTrainings: 14,
    pendingTrainings: 2,
    progress: 70
  });

  // 模擬訓練課程數據
  const trainingSessions = [
    { id: 1, title: "注意力訓練 - 基礎", scheduled: "2025-06-08", status: "待完成", desc: "通過互動遊戲加強專注力" },
    { id: 2, title: "情緒管理訓練 - 第三階段", scheduled: "2025-06-10", status: "待完成", desc: "練習識別和處理複雜情緒" },
    { id: 3, title: "專注力評估測驗", scheduled: "2025-06-15", status: "待完成", desc: "階段性評估" },
    { id: 4, title: "注意力訓練 - 進階", completed: "2025-06-03", status: "已完成", desc: "加強視覺追蹤能力", score: 85 },
    { id: 5, title: "情緒管理訓練 - 第二階段", completed: "2025-05-30", status: "已完成", desc: "掌握情緒調節技巧", score: 92 },
  ];

  // 更新時間
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.getHours().toString().padStart(2, '0') + 
        ":" + 
        now.getMinutes().toString().padStart(2, '0')
      );
      setCurrentDate(now);
    };

    // 初始化時間
    updateTime();
    
    // 每分鐘更新一次時間
    const timerId = setInterval(updateTime, 60000);
    
    return () => clearInterval(timerId);
  }, []);

  // 週幾轉換為中文
  const getDayOfWeekChinese = (date: Date) => {
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    return days[date.getDay()];
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* 左側內容 */}
      <div className="flex-1 space-y-6">
        {/* 歡迎卡片 */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <h2 className="text-2xl font-semibold mb-2">歡迎回來！</h2>
          <p className="mb-4">您的訓練計劃正在進行中，持續保持良好的訓練節奏有助於提升治療效果。</p>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm opacity-80">總體完成進度</div>
              <div className="text-3xl font-bold">{trainingStats.progress}%</div>
            </div>
            <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
              <div className="text-lg font-semibold">{trainingStats.completedTrainings}/{trainingStats.completedTrainings + trainingStats.pendingTrainings}</div>
            </div>
          </div>
        </div>

        {/* 訓練課程列表 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">我的訓練課程</h2>
            <div className="flex space-x-2">
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm transition-colors">
                查看全部
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {trainingSessions.map((session) => (
              <div key={session.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{session.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{session.desc}</p>
                  </div>
                  <div className="text-right">
                    {session.status === "已完成" ? (
                      <>
                        <span className="inline-block bg-green-100 text-green-700 rounded px-2 py-1 text-xs font-medium">
                          已完成
                        </span>
                        <div className="text-sm text-gray-500 mt-1">分數: {session.score}</div>
                        <div className="text-xs text-gray-400 mt-1">完成於 {session.completed}</div>
                      </>
                    ) : (
                      <>
                        <span className="inline-block bg-amber-100 text-amber-700 rounded px-2 py-1 text-xs font-medium">
                          待完成
                        </span>
                        <div className="text-sm text-gray-500 mt-1">預訂於 {session.scheduled}</div>
                        <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-1">
                          開始訓練
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右側內容 */}
      <div className="w-full lg:w-80 space-y-6">
        {/* 日期時間卡片 */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow p-4 text-center text-white">
          <div className="text-lg font-medium">
            {formatDate(currentDate)}
          </div>
          <div className="text-sm mb-4">
            （星期{getDayOfWeekChinese(currentDate)}）
          </div>
          <div className="text-5xl font-bold tracking-wide">
            {currentTime}
          </div>
        </div>

        {/* 最近的訊息 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-md font-medium text-gray-800 mb-3">治療師留言</h3>
          <div className="border-l-4 border-indigo-500 pl-4 py-1">
            <div className="text-sm text-gray-700">
              您在上週的情緒管理訓練表現非常好！請繼續保持，並嘗試將訓練中的技巧運用到日常生活中。
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">王醫師</span>
              <span className="text-xs text-gray-500">1天前</span>
            </div>
          </div>
        </div>

        {/* 下次門診預約 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-md font-medium text-gray-800 mb-3">下次門診時間</h3>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">2025年6月12日</div>
                <div className="text-xs text-gray-500">星期四 15:30</div>
              </div>
              <div className="bg-blue-100 rounded-md p-2">
                <div className="text-blue-800 font-medium text-lg">7</div>
                <div className="text-xs text-blue-600">天後</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              與王醫師的複診門診
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="flex-1 bg-white border border-gray-300 text-gray-600 rounded px-3 py-1 text-xs hover:bg-gray-50">
                取消預約
              </button>
              <button className="flex-1 bg-blue-500 text-white rounded px-3 py-1 text-xs hover:bg-blue-600">
                查看詳情
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
