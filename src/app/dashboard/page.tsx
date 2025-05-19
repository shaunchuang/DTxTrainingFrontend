"use client";

import { useState, useEffect } from "react";
import { withAuth } from "../utils/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../utils/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState("");

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

  // 模擬預約數據
  const appointments = [
    { id: 1, name: "陳建倫", gender: "男", age: 35, condition: "ADHD", time: "09:30 (初診)", status: "已報到", statusTime: "09:13" },
    { id: 2, name: "張恆考", gender: "男", age: 12, condition: "PTSD", time: "10:00 (複診)", status: "報到" },
    { id: 4, name: "李建宇", gender: "男", age: 16, condition: "自閉特質障礙", time: "10:30 (初診)", status: "報到" },
    { id: 6, name: "陳軒芷", gender: "女", age: 21, condition: "PTSD", time: "11:00 (初診)", status: "報到" },
    { id: 7, name: "梁聖汝", gender: "男", age: 4, condition: "ADHD", time: "11:30 (複診)", status: "報到" },
  ];

  // 模擬統計數據
  const stats = {
    todayAppointments: 7,
    updatedTraining: 3,
    abnormalTraining: 1
  };

  return (
    <DashboardLayout pageTitle="儀表板">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左側預約表格 */}
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-gray-800">今日個案預約行程</h2>
              <div className="ml-3 bg-emerald-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">
                {stats.todayAppointments}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    預約編號
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    患者姓名
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    性別
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    年齡
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    適應症
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    預約時間
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    報到
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {appointment.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {appointment.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {appointment.gender}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {appointment.age}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md 
                        ${appointment.condition === "ADHD" ? "bg-gray-500 text-white" : 
                          appointment.condition === "PTSD" ? "bg-gray-500 text-white" : 
                          "bg-gray-100 text-gray-800"}`}>
                        {appointment.condition}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {appointment.time}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {appointment.status === "已報到" ? (
                        <div className="text-xs text-center">
                          <div className="bg-emerald-100 text-emerald-700 rounded px-2 py-1 inline-block">
                            {appointment.status}
                          </div>
                          <div className="text-gray-500 mt-1">{appointment.statusTime}</div>
                        </div>
                      ) : (
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded px-3 py-1 text-sm transition-colors">
                          {appointment.status}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 右側統計區塊 */}
        <div className="w-full lg:w-80">
          {/* 日期時間顯示 */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow mb-6 p-4 text-center text-white overflow-hidden relative">
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

          {/* 統計區塊卡片 */}
          <div className="grid gap-6">
            {/* 今日預約個案 */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-emerald-100 rounded-md p-3">
                  <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-medium text-gray-500">今日預約個案</div>
                  <div className="flex items-center">
                    <div className="text-xl font-semibold text-gray-800">預報到人數:</div>
                    <div className="text-2xl font-bold text-emerald-500 ml-2">{stats.todayAppointments} 位</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 訓練歷程更新個案 */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-medium text-gray-500">訓練歷程更新個案</div>
                  <div className="flex items-center">
                    <div className="text-xl font-semibold text-gray-800">待檢視人數:</div>
                    <div className="text-2xl font-bold text-blue-500 ml-2">{stats.updatedTraining} 位</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 訓練狀態異常個案 */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-medium text-gray-500">訓練狀態異常個案</div>
                  <div className="flex items-center">
                    <div className="text-xl font-semibold text-gray-800">待處理人數:</div>
                    <div className="text-2xl font-bold text-red-500 ml-2">{stats.abnormalTraining} 位</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(Dashboard);
