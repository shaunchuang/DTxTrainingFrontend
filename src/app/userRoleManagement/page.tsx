"use client";

import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../utils/AuthContext";
import { useRouter } from "next/navigation";
import DashboardLayout from "../components/layout/DashboardLayout";
import styles from "./userRoleManagement.module.css";

// API 基礎路徑 - 使用與 .env.local 相同的環境變數名稱
const API_BASE_URL = process.env.NEXT_PUBLIC_CASEMGNT_API_BASE_URL || 'http://localhost:7001';

// 調试用的錯誤處理函數
const handleFetchError = (err: unknown, operation: string) => {
  console.error(`${operation} 錯誤:`, err);
  // 如果是 CORS 錯誤，提供更具體的信息
  if (err instanceof TypeError && err.message === 'Failed to fetch') {
    console.error(`可能的 CORS 問題或後端服務未啟動 (${API_BASE_URL})`);
  }
  return err instanceof Error ? err.message : '未知錯誤';
};

// 類型定義
interface User {
  id: number;
  username: string;
  account: string;
  email: string;
  telCell?: string;
  status: string;
  userRoles?: UserRole[];
}

interface UserRole {
  id?: number;
  role: Role;
}

interface Role {
  id: number;
  roleName: string;
  alias?: string;
  userCount?: number;
}

interface RoleOption {
  id: number;
  name: string;
  alias?: string;
}

interface UserFormData {
  id: string | number;
  username: string;
  account: string;
  email: string;
  telCell: string;
  password: string;
  status: string;
  roleIds: number[];
}

interface RoleFormData {
  id: string | number;
  roleName: string;
  alias: string;
}

interface UserCounts {
  [key: number]: number;
}

export default function UserRoleManagementPage() {
  const { user, loading, tokenVerified } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("user");

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
    <DashboardLayout pageTitle="角色使用者管理">
      <div className={styles.container}>
        <div className={styles.tabHeader}>
          <button 
            className={`${styles.tabButton} ${activeTab === "user" ? styles.active : ""}`}
            onClick={() => setActiveTab("user")}
          >
            使用者管理
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === "role" ? styles.active : ""}`}
            onClick={() => setActiveTab("role")}
          >
            角色管理
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "user" ? (
            <UserManagementTab />
          ) : (
            <RoleManagementTab />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// 使用者管理標籤頁組件
function UserManagementTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<UserFormData>({
    id: "",
    username: "",
    account: "",
    email: "",
    telCell: "",
    password: "",
    status: "ACTIVE",
    roleIds: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUserForm, setShowUserForm] = useState(false); // 控制表單顯示

  // 獲取所有使用者
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // 獲取使用者列表
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`);
      if (!response.ok) {
        throw new Error('獲取使用者列表失敗');
      }      const data = await response.json();
      setUsers(data);
    } catch (err: unknown) {
      setError(handleFetchError(err, '獲取使用者列表'));
    } finally {
      setLoading(false);
    }
  };

  // 獲取所有角色
  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/roles`);
      if (!response.ok) {
        throw new Error('獲取角色列表失敗');
      }
      const data = await response.json();
      setAvailableRoles(data.map((role: { id: number; roleName: string; alias: string }) => ({
        id: role.id,
        name: role.roleName,
        alias: role.alias
      })));
    } catch (err: unknown) {
      setError(handleFetchError(err, '獲取角色列表'));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const roleId = parseInt(e.target.value);
    
    if (e.target.checked) {
      setFormData({ ...formData, roleIds: [...formData.roleIds, roleId] });
    } else {
      setFormData({ ...formData, roleIds: formData.roleIds.filter(id => id !== roleId) });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (isEditing) {
        // 更新使用者
        response = await fetch(`${API_BASE_URL}/api/users/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      } else {
        // 添加新使用者
        response = await fetch(`${API_BASE_URL}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      }
      
      if (!response.ok) {
        throw new Error(isEditing ? '更新使用者失敗' : '創建使用者失敗');
      }
      
      // 重新獲取使用者列表
      fetchUsers();
      
      // 重置表單
      setFormData({
        id: "",
        username: "",
        account: "",
        email: "",
        telCell: "",
        password: "",
        status: "ACTIVE",
        roleIds: []
      });      setIsEditing(false);
      
    } catch (err: unknown) {
      setError(handleFetchError(err, '提交使用者數據'));
    } finally {
      setLoading(false);
    }
  };

  // 切換表單顯示狀態
  const toggleUserForm = () => {
    setShowUserForm(!showUserForm);
    if (!showUserForm) {
      // 如果要顯示表單，確保表單數據被重置
      setFormData({
        id: "",
        username: "",
        account: "",
        email: "",
        telCell: "",
        password: "",
        status: "ACTIVE",
        roleIds: []
      });
      setIsEditing(false);
    }
  };

  const handleEdit = (user: User) => {
    // 從使用者對象中提取角色ID
    const roleIds = user.userRoles ? user.userRoles.map(ur => ur.role.id) : [];
    
    setFormData({
      id: user.id,
      username: user.username,
      account: user.account,
      email: user.email,
      telCell: user.telCell || '',
      password: '', // 不包含密碼，可選是否讓使用者更新密碼
      status: user.status,
      roleIds
    });
    setIsEditing(true);
    setShowUserForm(true); // 確保表單顯示
  };

  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除此使用者嗎？')) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('刪除使用者失敗');
      }
      
      // 從列表中移除使用者
      setUsers(users.filter(user => user.id !== id));
      
    } catch (err: unknown) {
      setError(handleFetchError(err, '刪除使用者'));
    } finally {
      setLoading(false);
    }
  };

  // 獲取使用者所擁有的角色名稱
  const getUserRoleNames = (user: User) => {
    if (!user.userRoles || user.userRoles.length === 0) return '-';
    return user.userRoles.map(ur => ur.role.roleName).join(', ');
  };

  return (
    <div className={styles.tabPanel}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {/* 使用者列表 */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>使用者列表</h3>
          <button 
            className={styles.addButton}
            onClick={toggleUserForm}
          >
            {showUserForm ? "取消新增" : "新增使用者"}
          </button>
        </div>
        
        {/* 使用者表單 - 只有在 showUserForm 為真時才顯示 */}
        {showUserForm && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3>{isEditing ? "編輯使用者" : "添加新使用者"}</h3>
            <div className={styles.formGroup}>
              <label htmlFor="username">使用者名:</label>
              <input 
                type="text" 
                id="username" 
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="account">帳號:</label>
              <input 
                type="text" 
                id="account" 
                name="account"
                value={formData.account}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">郵箱:</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="telCell">手機:</label>
              <input 
                type="text" 
                id="telCell" 
                name="telCell"
                value={formData.telCell}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">密碼:</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isEditing ? "留空則不更改密碼" : "請輸入密碼"}
                required={!isEditing}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="status">狀態:</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="ACTIVE">啟用</option>
                <option value="INACTIVE">停用</option>
                <option value="PENDING">待審核</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>角色設置:</label>
              <div className={styles.checkboxGroup}>
                {availableRoles.map(role => (
                  <div key={role.id} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      id={`role-${role.id}`}
                      value={role.id}
                      checked={formData.roleIds.includes(role.id)}
                      onChange={handleRoleChange}
                    />
                    <label htmlFor={`role-${role.id}`}>{role.alias || role.name}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "處理中..." : (isEditing ? "更新" : "添加")}
              </button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={toggleUserForm}
                disabled={loading}
              >
                取消
              </button>
            </div>
          </form>
        )}
        
        {loading && !isEditing ? (
          <div className={styles.loading}>載入中...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>使用者名稱</th>
                <th>帳號</th>
                <th>郵箱</th>
                <th>狀態</th>
                <th>角色</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.noData}>暫無使用者數據</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.account}</td>
                    <td>{user.email}</td>
                    <td>{user.status === 'ACTIVE' ? '啟用' : 
                          user.status === 'INACTIVE' ? '停用' : '待審核'}</td>
                    <td>{getUserRoleNames(user)}</td>
                    <td>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEdit(user)}
                        disabled={loading}
                      >
                        編輯
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDelete(user.id)}
                        disabled={loading}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// 角色管理標籤頁組件
function RoleManagementTab() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState<RoleFormData>({
    id: "",
    roleName: "",
    alias: ""
  });  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCounts, setUserCounts] = useState<UserCounts>({});
  const [showRoleForm, setShowRoleForm] = useState(false); // 控制表單顯示

  // 獲取角色列表
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/roles`);
      if (!response.ok) {
        throw new Error('獲取角色列表失敗');
      }
      const data = await response.json();
      setRoles(data);
      
      // 逐個獲取每個角色的使用者數量
      for (const role of data) {
        fetchRoleUserCount(role.id);
      }
    } catch (err: unknown) {
      setError(handleFetchError(err, '獲取角色列表'));
    } finally {
      setLoading(false);    }
  }, []);

  // 獲取所有角色
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // 獲取角色的使用者數量
  const fetchRoleUserCount = async (roleId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/roles/${roleId}`);
      if (!response.ok) {
        throw new Error(`獲取角色 ${roleId} 的使用者數量失敗`);
      }
      const data = await response.json();
      if (data && data.userCount !== undefined) {
        setUserCounts(prev => ({
          ...prev,
          [roleId]: data.userCount
        }));
      }
    } catch (err) {
      setError(handleFetchError(err, `獲取角色 ${roleId} 的使用者數量`));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (isEditing) {
        // 更新角色
        response = await fetch(`${API_BASE_URL}/api/roles/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            roleName: formData.roleName,
            alias: formData.alias
          })
        });
      } else {
        // 添加新角色
        response = await fetch(`${API_BASE_URL}/api/roles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            roleName: formData.roleName,
            alias: formData.alias
          })
        });
      }
      
      if (!response.ok) {
        throw new Error(isEditing ? '更新角色失敗' : '創建角色失敗');
      }
      
      // 重新獲取角色列表
      fetchRoles();
      
      // 重置表單
      setFormData({
        id: "",
        roleName: "",
        alias: ""
      });
      setIsEditing(false);
      
    } catch (err: unknown) {
      setError(handleFetchError(err, '提交角色數據'));
    } finally {
      setLoading(false);
    }
  };

  // 切換表單顯示狀態
  const toggleRoleForm = () => {
    setShowRoleForm(!showRoleForm);
    if (!showRoleForm) {
      // 如果要顯示表單，確保表單數據被重置
      setFormData({
        id: "",
        roleName: "",
        alias: ""
      });
      setIsEditing(false);
    }
  };

  const handleEdit = (role: Role) => {
    setFormData({
      id: role.id,
      roleName: role.roleName,
      alias: role.alias || ''
    });
    setIsEditing(true);
    setShowRoleForm(true); // 確保表單顯示
  };

  const handleDelete = async (id: number) => {
    // 檢查是否有使用者使用此角色
    if (userCounts[id] && userCounts[id] > 0) {
      alert(`無法刪除此角色，因為有 ${userCounts[id]} 位使用者正在使用此角色`);
      return;
    }
    
    if (!confirm('確定要刪除此角色嗎？')) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/roles/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '刪除角色失敗');
      }
      
      // 從列表中移除角色
      setRoles(roles.filter(role => role.id !== id));
      setUserCounts(prev => {
        const newCounts = { ...prev };
        delete newCounts[id];
        return newCounts;
      });
      
    } catch (err: unknown) {
      setError(handleFetchError(err, '刪除角色'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.tabPanel}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {/* 角色列表 */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>角色列表</h3>
          <button 
            className={styles.addButton}
            onClick={toggleRoleForm}
          >
            {showRoleForm ? "取消新增" : "新增角色"}
          </button>
        </div>
        
        {/* 角色表單 - 只有在 showRoleForm 為真時才顯示 */}
        {showRoleForm && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3>{isEditing ? "編輯角色" : "添加新角色"}</h3>
            <div className={styles.formGroup}>
              <label htmlFor="roleName">角色名稱:</label>
              <input 
                type="text" 
                id="roleName" 
                name="roleName"
                value={formData.roleName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="alias">顯示名稱:</label>
              <input 
                type="text" 
                id="alias" 
                name="alias"
                value={formData.alias}
                onChange={handleInputChange}
                placeholder="留空則使用角色名稱"
              />
            </div>
            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "處理中..." : (isEditing ? "更新" : "添加")}
              </button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={toggleRoleForm}
                disabled={loading}
              >
                取消
              </button>
            </div>
          </form>
        )}
        
        {loading && !isEditing ? (
          <div className={styles.loading}>載入中...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>角色名稱</th>
                <th>顯示名稱</th>
                <th>使用者數量</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.noData}>暫無角色數據</td>
                </tr>
              ) : (
                roles.map(role => (
                  <tr key={role.id}>
                    <td>{role.id}</td>
                    <td>{role.roleName}</td>
                    <td>{role.alias || '-'}</td>
                    <td>{userCounts[role.id] !== undefined ? userCounts[role.id] : '載入中...'}</td>
                    <td>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEdit(role)}
                        disabled={loading}
                      >
                        編輯
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDelete(role.id)}
                        disabled={loading}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}