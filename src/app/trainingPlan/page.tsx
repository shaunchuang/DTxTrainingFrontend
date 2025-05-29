"use client";

import DashboardLayout from "../components/layout/DashboardLayout";

export default function TrainingPlan() {
  return (
    <DashboardLayout pageTitle="教案使用">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              個人化教案計劃
            </h2>
            <p className="text-gray-600">
              根據您的康復需求，為您量身定制的訓練教案
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 訓練教案卡片 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">認</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">認知訓練</h3>
                  <p className="text-sm text-gray-600">提升認知能力</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">完成進度</span>
                  <span className="font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                開始訓練
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">語</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">語言治療</h3>
                  <p className="text-sm text-gray-600">改善語言表達</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">完成進度</span>
                  <span className="font-medium">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
                開始訓練
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">職</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">職能治療</h3>
                  <p className="text-sm text-gray-600">提升日常生活能力</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">完成進度</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <button className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors">
                開始訓練
              </button>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">本週訓練安排</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">認知訓練 - 記憶力提升</h4>
                  <p className="text-sm text-gray-600">今日 14:00 - 15:00</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  已安排
                </span>
              </div>
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">語言治療 - 發音練習</h4>
                  <p className="text-sm text-gray-600">明日 10:00 - 11:00</p>
                </div>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  已安排
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
