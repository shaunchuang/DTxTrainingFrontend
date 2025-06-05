"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { JWT_CONFIG, SECURITY_API, CASEMGNT_API_BASE_URL } from '../config';
import { getToken, removeToken, getAuthHeaders } from './auth';

interface Role {
  id: number;
  alias: string;
  description: string;
  // 你可根據後端 Role 結構擴充
}

// 對應後端 UserRoleDTO
interface UserRoleDTO {
  id: number;
  username: string;
  account: string;
  email: string;
  telCell?: string;
  steamId?: string;
  createdTime?: string | Date;
  lastLoginDate?: string | Date;
  status: string; // UserStatus 可細分型別
  roles: Role[];
}

// 更新 AuthContextType 介面並將其提前
interface AuthContextType {
  user: UserRoleDTO | null;
  loading: boolean;
  tokenVerified: boolean;
  login: (token: string, userData: UserRoleDTO) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<UserRoleDTO | null>; // 修改返回類型以匹配實際實現
}

// 創建 Context 時提供正確的默認值，避免 undefined
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  tokenVerified: false,
  login: () => {},
  logout: async () => {},
  refreshUser: async () => null
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserRoleDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenVerified, setTokenVerified] = useState(false);
  const router = useRouter();  // 初始化認證狀態
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken();
        if (token) {
          // 嘗試從localStorage獲取用戶資料
          const storedUser = localStorage.getItem(JWT_CONFIG.USER_STORAGE_KEY);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          // 檢查 API URL 是否配置 - 在使用相對路徑進行代理請求的情況下不需要此檢查
          if (!CASEMGNT_API_BASE_URL) {
            console.warn("API URL not configured, skipping token verification");
            // 不再允許開發模式下直接設為已驗證
          } else {
            // 驗證token有效性，等待結果完成
            try {
              // 直接調用API而不是使用refreshUser以避免依賴問題
              const response = await fetch(SECURITY_API.USER, {
                headers: getAuthHeaders()
              });

              if (response.ok) {
                const userData = await response.json();
                localStorage.setItem(JWT_CONFIG.USER_STORAGE_KEY, JSON.stringify(userData));
                setUser(userData);
                setTokenVerified(true);
              } else {
                // token無效或過期，清除用戶資料
                setUser(null);
                removeToken();
                localStorage.removeItem(JWT_CONFIG.USER_STORAGE_KEY);
              }
            } catch (err) {
              console.warn("Could not refresh user data during init (API server may be down):", err);
              // token驗證失敗，清除認證資訊
              setUser(null);
              removeToken();
              localStorage.removeItem(JWT_CONFIG.USER_STORAGE_KEY);
            }
          }
        }
      } catch (error) {
        console.error("Authentication initialization failed:", error);
        // 出錯時清除認證資訊
        removeToken();
        localStorage.removeItem(JWT_CONFIG.USER_STORAGE_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []); // 移除refreshUser依賴
  // 登入並設置用戶資訊
  const login = (token: string, userData: UserRoleDTO) => {
    localStorage.setItem(JWT_CONFIG.TOKEN_STORAGE_KEY, token);
    localStorage.setItem(JWT_CONFIG.USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    setTokenVerified(true);
  };

  // 登出
  const logout = async () => {
    try {
      // 調用登出API (後端可能不需要處理JWT登出)
      await fetch(SECURITY_API.LOGOUT, {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // 清除本地存儲
      removeToken();
      localStorage.removeItem(JWT_CONFIG.USER_STORAGE_KEY);
      setUser(null);
      setTokenVerified(false);
      // 轉到登入頁
      router.push('/');
    }
  };

  // 改進 refreshUser 函數
  const refreshUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        // 沒有token時靜默失敗，返回null而不是拋出錯誤
        console.warn("No token found when refreshing user.");
        return null;
      }
      const response = await fetch(SECURITY_API.USER, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem(JWT_CONFIG.USER_STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        return userData as UserRoleDTO;
      } else if (response.status === 401) {
        // Token已過期，嘗試刷新token
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // 刷新token成功，再次嘗試獲取用戶資訊
          return refreshUser();
        } else {
          // 刷新token失敗，清除認證資訊
          console.warn("Token refresh failed, clearing auth.");
          removeToken();
          localStorage.removeItem(JWT_CONFIG.USER_STORAGE_KEY);
          setUser(null);
          return null;
        }
      } else {
        // 其他HTTP錯誤（包括500）
        console.error(`Server returned error ${response.status} when refreshing user.`);
        if (response.status >= 500) {
          console.warn("Server error detected, keeping existing user state.");
          return null;
        }
        removeToken();
        localStorage.removeItem(JWT_CONFIG.USER_STORAGE_KEY);
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return null;
    }
  };

  // 增加 refreshToken 函數
  const refreshToken = async () => {
    try {
      const response = await fetch(SECURITY_API.REFRESH_TOKEN, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem(JWT_CONFIG.TOKEN_STORAGE_KEY, data.token);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, tokenVerified }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // 現在已經不需要檢查 undefined，因為我們提供了默認值
  return context;
};

// 保護路由中間件 - 修復 Next.js App Router 類型問題
export function withAuth(Component: React.ComponentType): React.FC {
  const ProtectedRoute: React.FC = () => {
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

    return user && tokenVerified ? <Component /> : null;
  };

  // 設置顯示名稱以便於調試
  ProtectedRoute.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;
  
  return ProtectedRoute;
}