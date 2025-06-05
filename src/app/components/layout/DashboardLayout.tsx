"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, 
  faClipboardList, 
  faCog, 
  faBars,
  faBell,
  faUser,
  faChevronDown,
  faChevronRight,
  faExchangeAlt,
  faChartBar,
  faMoon,
  faSun,
  faComments
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAuth } from "../../utils/AuthContext";
import { usePathname } from 'next/navigation';

type DashboardLayoutProps = {
  children: React.ReactNode;
  pageTitle: string;
};

export default function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const pathname = usePathname();
  console.log('DashboardLayout user:', user);
  // 添加參考點，用於檢測點擊事件
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  
  // 格式化日期和時間
  const formatDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  };
  
  // 即時更新時間
  useEffect(() => {
    setCurrentDateTime(formatDateTime());
    
    const interval = setInterval(() => {
      setCurrentDateTime(formatDateTime());
    }, 1000); // 每秒更新一次
    
    return () => clearInterval(interval); // 清理計時器
  }, []);
  
  // 檢查使用者是否為個案角色
  const isPatient = () => {
    return user?.roles?.some(role => role.alias === 'CASE') || false;
  };
  
  // 根據角色返回不同的導航菜單
  const getNavigationItems = () => {
    if (isPatient()) {
      // 個案用戶的導航菜單
      return [
        {
          icon: faHome,
          label: "平台首頁",
          children: [
            { label: "首頁總覽", path: "/dashboard" },
            { label: "教案使用", path: "/trainingPlan" },
            { label: "檢視紀錄", path: "/trainingRecord" }
          ]
        },
        {
          icon: faComments,
          label: "協作溝通",
          children: [
            { label: "提問與回覆", path: "/chatroom" }
          ]
        }
      ];
    } else {
      // 醫師、治療師、管理者的導航菜單（原有的）
      return [
        {
          icon: faHome,
          label: "平台首頁",
          children: [
            { label: "首頁總覽", path: "/dashboard" },
            { label: "建立個案", path: "/createCase" },
            { label: "預約掛號", path: "/appointment" }
          ]
        },
        {
          icon: faClipboardList,
          label: "個案管理",
          children: [
            { label: "個案管理", path: "/caseMgnt" }
          ]
        },
        {
          icon: faExchangeAlt,
          label: "資料交換",
          children: [
            { label: "健保申報管理", path: "/healthInsurance" },
            { label: "長照申報管理", path: "/longTermCare" },
            { label: "FHIR醫資交換", path: "/FhirExchange" }
          ]
        },
        {
          icon: faChartBar,
          label: "報表管理",
          children: [
            { label: "檢測報告", path: "/examReport" },
            { label: "基本報表", path: "/baseReport" },
            { label: "單位指標", path: "/indicator" },
            { label: "數位治療分析", path: "/dtxAnalysis" }
          ]
        },
        {
          icon: faCog,
          label: "行政管理",
          children: [
            { label: "排程追蹤", path: "/trackTrace" },
            { label: "角色用戶管理", path: "/userRoleManagement" },
            { label: "其他設定管理", path: "/otherManagement" }
          ]
        }
      ];
    }
  };
  
  // 獲取當前導航項目
  const navigationItems = getNavigationItems();
  
  // 控制折疊狀態
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  // 初始化時展開當前路徑所在的主項目
  useEffect(() => {
    const newExpandedItems = {...expandedItems};
    
    navigationItems.forEach((item, index) => {
      const isActive = item.children.some(child => pathname === child.path);
      if (isActive) {
        newExpandedItems[index] = true;
      }
    });
    
    setExpandedItems(newExpandedItems);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // expandedItems和navigationItems不應包含在依賴中以避免無限循環
  
  // 切換側邊欄顯示與否
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // 切換黑暗/明亮模式
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // 這裡可以實際實現系統黑暗模式切換
  };
  
  // 處理登出 - 使用認證上下文
  const handleLogout = () => {
    logout();
  };
  
  // 切換主導航項目的折疊狀態
  const toggleExpand = (index: number) => {
    setExpandedItems({
      ...expandedItems,
      [index]: !expandedItems[index]
    });
  };
  
  // 渲染導航項目
  const renderNavItems = () => {
    return navigationItems.map((item, index) => (
      <div key={index} className="mb-2">
        {/* 主導航項目 */}
        <button 
          onClick={() => toggleExpand(index)}
          className={`flex items-center justify-between w-full px-4 py-3 text-left ${
            expandedItems[index] ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
          } rounded-lg transition-colors duration-200`}
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={item.icon} className={`w-5 h-5 ${!sidebarOpen ? 'mx-auto' : 'mr-3'}`} />
            {sidebarOpen && <span className="font-medium">{item.label}</span>}
          </div>
          {sidebarOpen && (
            <FontAwesomeIcon 
              icon={expandedItems[index] ? faChevronDown : faChevronRight} 
              className="w-4 h-4"
            />
          )}
        </button>
        
        {/* 子導航項目 */}
        {sidebarOpen && expandedItems[index] && (
          <div className="pl-10 mt-1 space-y-1">
            {item.children.map((child, childIndex) => (
              <Link 
                href={child.path} 
                key={childIndex}
                className={`flex items-center px-4 py-2 text-sm ${
                  pathname === child.path 
                    ? 'text-indigo-700 bg-indigo-50 font-medium' 
                    : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-50'
                } rounded-md transition-colors duration-200`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    ));
  };
  
  // 點擊外部區域關閉選單 - 使用更穩健的實現方式
  useEffect(() => {
    // 使用泛型 Event 作為基礎類型，避免類型錯誤
    const handleClickOutside = (event: Event) => {
      // 檢查用戶下拉選單
      if (
        userDropdownOpen &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }

      // 檢查通知下拉選單
      if (
        notificationDropdownOpen &&
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target as Node)
      ) {
        setNotificationDropdownOpen(false);
      }
    };

    // 使用一般 Event 類型，可同時適用於滑鼠和觸控事件
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [userDropdownOpen, notificationDropdownOpen]);
  
  return (
    <div className="flex h-screen">
      {/* 側邊欄 */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col h-full border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} transition-all duration-300 overflow-y-auto z-20`}>
        {/* 系統標題 */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
          <div>
            <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} ${!sidebarOpen && 'hidden'}`}>DTx 系統</h1>
            {!sidebarOpen && (
              <div className="flex justify-center">
                <span className="text-xl font-bold text-indigo-600">D</span>
              </div>
            )}
          </div>
          {/* 漢堡選單按鈕 */}
          <button 
            onClick={toggleSidebar}
            className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
          >
            <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
          </button>
        </div>
        
        {/* 導航項目 */}
        <nav className="flex-1 py-4">
          {renderNavItems()}
        </nav>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 頂部導航欄 (Top Bar) */}
        <header className={`w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-sm z-10`}>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* 左側 - 空白區域，移除了漢堡選單 */}
              <div className="flex items-center">
                {/* 此處可以放置頁面標題或麵包屑導航 */}
              </div>
              
              {/* 右側 - 功能按鈕和用戶選單 */}
              <div className="flex items-center space-x-3">
                {/* 深色模式切換 */}
                <button 
                  onClick={toggleDarkMode} 
                  className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  title={darkMode ? '切換至亮色模式' : '切換至深色模式'}
                >
                  <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="w-5 h-5" />
                </button>
                
                {/* 通知下拉選單 */}
                <div className="relative" ref={notificationDropdownRef}>
                  <button 
                    onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                    className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors relative`}
                  >
                    <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
                    {/* 未讀通知指示器 */}
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  
                  {notificationDropdownOpen && (
                    <div className={`absolute right-0 mt-2 w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-xl border z-20`}>
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="font-medium">通知</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        <div className={`p-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer border-b border-gray-200`}>
                          <p className="text-sm font-medium">系統更新</p>
                          <p className="text-xs text-gray-500 mt-1">系統將於今晚進行維護更新</p>
                          <p className="text-xs text-gray-400 mt-1">2小時前</p>
                        </div>
                        <div className={`p-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}>
                          <p className="text-sm font-medium">新功能上線</p>
                          <p className="text-xs text-gray-500 mt-1">個案管理模組新增批次操作功能</p>
                          <p className="text-xs text-gray-400 mt-1">1天前</p>
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                          查看全部通知
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 用戶資訊下拉選單 */}
                <div className="relative" ref={userDropdownRef}>
                  <button 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center space-x-2 p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-indigo-100'} flex items-center justify-center`}>
                      <FontAwesomeIcon icon={faUser} className={`${darkMode ? 'text-gray-300' : 'text-indigo-600'}`} />
                    </div>
                    <span className="hidden md:block font-medium">{user?.username || '使用者'}</span>
                    <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
                  </button>
                  
                  {userDropdownOpen && (
                    <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-xl border z-20`}>
                      <div className="p-4 border-b border-gray-200">
                        <p className="text-sm font-medium">{user?.username || '使用者'}</p>
                        <p className="text-xs text-gray-500">
                          {user?.roles && Array.isArray(user.roles) && user.roles[0]?.description
                            ? user.roles[0].description
                            : '一般用戶'}
                        </p>
                      </div>
                      <div className="py-2">
                        <button className={`w-full text-left px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                          個人資料
                        </button>
                        <button className={`w-full text-left px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                          帳號設定
                        </button>
                        <button 
                          className={`w-full text-left px-4 py-2 text-sm text-red-600 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'}`}
                          onClick={handleLogout}
                        >
                          登出
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* 頁面標題橫欄 - 移至 header 內 */}
          <div className={`w-full px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center w-full mx-auto">
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pageTitle}</h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentDateTime}</p>
            </div>
          </div>
        </header>
        
        {/* 主要內容 */}
        <main className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="w-full mx-auto p-6">
            {/* 頁面內容 */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}