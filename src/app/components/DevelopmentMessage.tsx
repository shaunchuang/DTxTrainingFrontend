"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

type DevelopmentMessageProps = {
  feature: string;
};

export default function DevelopmentMessage({ feature }: DevelopmentMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-xl shadow-md max-w-2xl mx-auto">
        <svg className="w-24 h-24 mx-auto text-indigo-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">功能開發中</h2>
        <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
          {feature}功能仍在開發中，敬請期待更多精彩內容。
        </p>
        <div className="h-2 bg-gray-200 rounded-full max-w-md mx-auto mb-6">
          <div className="h-2 bg-indigo-500 rounded-full w-2/5"></div>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          開發進度：40%
        </p>
      </div>
    </div>
  );
}