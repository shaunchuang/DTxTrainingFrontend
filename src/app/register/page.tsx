"use client";

import { useState, useEffect } from "react";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { SECURITY_API } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faKey, faEnvelope, faMobile, faUserPlus, faSync, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAuth } from "../utils/AuthContext";

export default function Register() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    account: "",
    email: "",
    telCell: "",
    password: "",
    confirmPassword: "",
    captcha: ""
  });
    const [captchaUrl, setCaptchaUrl] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // 如果用戶已登入，重定向到儀表板
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // 表單欄位處理函數
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除密碼錯誤（如果用戶進行更改）
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };  // 驗證碼刷新函數
  const refreshCaptcha = async () => {
    setCaptchaLoading(true);
    const timestamp = new Date().getTime();
    setCaptchaUrl(`${SECURITY_API.CAPTCHA}?t=${timestamp}`);
    // 清空驗證碼輸入框
    setFormData(prev => ({ ...prev, captcha: "" }));
    
    // 等待圖片載入
    setTimeout(() => {
      setCaptchaLoading(false);
    }, 500);
  };

  // 初始加載驗證碼
  useEffect(() => {
    refreshCaptcha();
  }, []);

  // 提交表單處理
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 驗證密碼是否一致
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("兩次輸入的密碼不一致");
      return;
    }
    
    setIsLoading(true);
    setMessage({ text: "", type: "" });    try {
      const response = await fetch(SECURITY_API.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          account: formData.account,
          email: formData.email,
          telCell: formData.telCell,
          password: formData.password,
          captcha: formData.captcha
        }),
        credentials: "include", // 確保發送會話 cookies
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ 
          text: "註冊成功，請等待管理員審核。即將轉到登入頁面...", 
          type: "success" 
        });
        
        // 延遲跳轉到登入頁面
        setTimeout(() => {
          router.push("/");
        }, 3000);      } else {
        // 顯示後端返回的錯誤訊息
        setMessage({ 
          text: data.message || "註冊失敗，請檢查填寫的資訊", 
          type: "error" 
        });
        // 如果是驗證碼錯誤，刷新驗證碼
        if (data.message && data.message.includes("驗證碼")) {
          refreshCaptcha();
        }
      }    } catch (error) {
      console.error("註冊請求錯誤:", error);
      setMessage({ 
        text: "無法連接到伺服器，請檢查網路連線並稍後再試", 
        type: "error" 
      });
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
      <div className="w-full max-w-lg p-10 space-y-8 bg-white rounded-xl shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-700">DTx 系統註冊</h1>
          <p className="mt-2 text-sm text-gray-500">請填寫以下資訊進行註冊</p>
        </div>

        {message.text && (
          <div 
            className={`p-4 rounded-lg text-center ${
              message.type === "error" 
                ? "bg-red-50 text-red-700 border border-red-200" 
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* 姓名 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                姓名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="請輸入您的真實姓名"
                />
              </div>
            </div>
            
            {/* 帳號 */}
            <div>
              <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">
                帳號
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                </div>
                <input
                  id="account"
                  name="account"
                  type="text"
                  required
                  value={formData.account}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="請設定您的登入帳號"
                />
              </div>
            </div>
            
            {/* 電子郵件 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                電子郵件
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="請輸入您的電子郵件地址"
                />
              </div>
            </div>
            
            {/* 手機號碼 */}
            <div>
              <label htmlFor="telCell" className="block text-sm font-medium text-gray-700 mb-1">
                手機號碼
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faMobile} className="text-gray-400" />
                </div>
                <input
                  id="telCell"
                  name="telCell"
                  type="tel"
                  required
                  value={formData.telCell}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="請輸入您的手機號碼"
                />
              </div>
            </div>

            {/* 密碼 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密碼
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="請設定您的密碼"
                  minLength={8}
                />
              </div>
            </div>
            
            {/* 確認密碼 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                確認密碼
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 ${
                    passwordError ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="請再次輸入密碼"
                />
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>
            
            {/* 驗證碼 */}
            <div>
              <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-1">
                驗證碼
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faKey} className="text-gray-400" />
                  </div>
                  <input
                    id="captcha"
                    name="captcha"
                    type="text"
                    required
                    value={formData.captcha}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                    placeholder="請輸入驗證碼"
                  />
                </div>                <div className="flex items-center">                  {captchaUrl && (
                    <div className="relative">
                      <Image
                        crossOrigin="use-credentials"
                        src={captchaUrl}
                        alt="驗證碼"
                        width={100}
                        height={48}
                        className="h-12 border border-gray-300 rounded-lg shadow-sm"
                        onError={() => {
                          console.error("驗證碼圖片載入失敗");
                          setMessage({ 
                            text: "驗證碼載入失敗，請重新整理", 
                            type: "error" 
                          });
                        }}
                      />
                      {captchaLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    disabled={captchaLoading}
                    className={`p-2 ml-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 ${
                      captchaLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title="刷新驗證碼"
                  >
                    <FontAwesomeIcon 
                      icon={faSync} 
                      className={`w-5 h-5 ${captchaLoading ? "animate-spin" : ""}`} 
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-4 pt-4">
            <Link 
              href="/"
              className="flex items-center justify-center px-4 py-3 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-150"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
              返回登入
            </Link>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-grow flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <FontAwesomeIcon icon={faUserPlus} className="w-5 h-5 mr-2" />
              {isLoading ? "處理中..." : "註冊帳號"}
            </button>
          </div>
        </form>

        <div className="pt-5 mt-8 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            © 2025 工業技術研究院. 版權所有
          </p>
        </div>
      </div>
    </div>
  );
}