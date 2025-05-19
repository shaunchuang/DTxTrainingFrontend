/**
 * JWT 相關工具函數
 */

// 保存 JWT token 到 localStorage
export const saveToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// 從 localStorage 獲取 token
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// 刪除 token
export const removeToken = () => {
  localStorage.removeItem('authToken');
};

// 將 JWT token 添加到請求頭
export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return {
    'Content-Type': 'application/json'
  };
};

// 檢查是否已認證
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};