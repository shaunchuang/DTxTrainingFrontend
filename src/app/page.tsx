"use client";

import { useState, useEffect } from "react";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SECURITY_API } from "./config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync, faUser, faLock, faKey, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./utils/AuthContext";

export default function Home() {
  const router = useRouter();
  const { login, user, tokenVerified } = useAuth();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaUrl, setCaptchaUrl] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  // 如果用戶已登入且token已驗證，直接轉到儀表板
  useEffect(() => {
    if (user && tokenVerified) {
      router.push("/dashboard");
    }
  }, [user, tokenVerified, router]);

  // Function to refresh captcha
  const refreshCaptcha = () => {
    // Add timestamp to avoid caching
    setCaptchaUrl(`${SECURITY_API.CAPTCHA}?t=${new Date().getTime()}`);
  };

  // Load captcha on initial page load
  useEffect(() => {
    refreshCaptcha();
  }, []);

  // Handle login form submission
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(SECURITY_API.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ account, password, captcha }),
        credentials: "include", // 仍然保留以支持驗證碼會話
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ text: "登入成功，正在重定向...", type: "success" });
        
        // 使用認證上下文存儲用戶信息和token
        if (data.token && data.user) {
          login(data.token, data.user);
          
          // 登入成功後導航到儀表板頁面
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        }
      } else {
        // Show specific error message from backend
        setMessage({ 
          text: data.message || "登入失敗，請檢查帳號密碼", 
          type: "error" 
        });
        refreshCaptcha();
      }
    } catch (error) {
      setMessage({ text: "無法連接到伺服器，請稍後再試", type: "error" });
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
      <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-xl shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-700">DTX 系統</h1>
          <div className="mt-3 text-gray-600 font-medium text-lg">歡迎回來</div>
          <p className="mt-2 text-sm text-gray-500">請輸入您的帳號資訊進行登入</p>
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

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-5">
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
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="pl-10 w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="請輸入帳號"
                />
              </div>
            </div>
            
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="請輸入密碼"
                />
              </div>
            </div>
            
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
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                    placeholder="請輸入驗證碼"
                  />
                </div>
                <div className="flex items-center">
                  {captchaUrl && (
                    <img
                      src={captchaUrl}
                      alt="驗證碼"
                      className="h-12 border border-gray-300 rounded-lg shadow-sm"
                    />
                  )}
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2 ml-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                    title="刷新驗證碼"
                  >
                    <FontAwesomeIcon icon={faSync} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center items-center px-4 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FontAwesomeIcon icon={faSignInAlt} className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
              </span>
              {isLoading ? "登入中..." : "登入系統"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            還沒有帳號？{" "}
            <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              註冊新帳號
            </a>
          </p>
        </div>

        <div className="pt-5 mt-8 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            © 2025 DTX系統. 版權所有
          </p>
        </div>
      </div>
    </div>
  );
}
