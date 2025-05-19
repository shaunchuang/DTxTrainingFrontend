"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser,
  faChevronDown,
  faSignOutAlt,
  faUserCircle,
  faCog
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../utils/AuthContext";
import Swal from 'sweetalert2';
import styles from './form.module.css';

// 表單數據類型定義
type FormData = {
  // 步驟一：基本資料
  name: string;
  birth: {
    year: string;
    month: string;
    day: string;
  };
  gender: string;
  idNumber: string;
  phone: string;
  email: string;
  // 步驟二：健康資料
  diseases: {
    none: boolean;
    brain: boolean;
    heart: boolean;
    hypertension: boolean;
    liver: boolean;
    diabetes: boolean;
    kidney: boolean;
    cancer: boolean;
    immunity: boolean;
    other: boolean;
    otherText: string;
  };
  allergies: {
    none: boolean;
    protein: boolean;
    antibiotic: boolean;
    food: boolean;
    contrast: boolean;
    anesthetic: boolean;
    nsaid: boolean;
    biologics: boolean;
    other: boolean;
    otherText: string;
  };
  mentalConditions: {
    adhd: boolean;
    ptsd: boolean;
    anxiety: boolean;
    depression: boolean;
    bipolar: boolean;
    asd: boolean;
    addiction: boolean;
  };
  // 步驟三：量表填寫
  adhdScore: number;
  anxietyScore: number;
  // 步驟四：預約
  doctorChoice: string;
  appointmentDate: string;
  appointmentTime: string;
  contactAddress: string;
  homeAddress: string;
  sameAddress: boolean;
  emergencyContact: string;
  emergencyRelation: string;
  emergencyPhone: string;
};

export default function MultiStepFormPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [step, setStep] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const userDropdownRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<FormData>({
    // 基本資料初始值
    name: "",
    birth: { year: "", month: "", day: "" },
    gender: "male",
    idNumber: "",
    phone: "",
    email: "",
    // 健康資料初始值
    diseases: {
      none: true,
      brain: false,
      heart: false,
      hypertension: false,
      liver: false,
      diabetes: false,
      kidney: false,
      cancer: false,
      immunity: false,
      other: false,
      otherText: ""
    },
    allergies: {
      none: true,
      protein: false,
      antibiotic: false,
      food: false,
      contrast: false,
      anesthetic: false,
      nsaid: false,
      biologics: false,
      other: false,
      otherText: ""
    },
    mentalConditions: {
      adhd: false,
      ptsd: false,
      anxiety: false,
      depression: false,
      bipolar: false,
      asd: false,
      addiction: false
    },
    // 量表初始值
    adhdScore: 0,
    anxietyScore: 0,
    // 預約初始值
    doctorChoice: "",
    appointmentDate: "",
    appointmentTime: "",
    contactAddress: "",
    homeAddress: "",
    sameAddress: false,
    emergencyContact: "",
    emergencyRelation: "",
    emergencyPhone: ""
  });

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
  
  // 點擊外部區域關閉選單
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        userDropdownOpen &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [userDropdownOpen]);
  
  // 切換黑暗/明亮模式
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // 這裡可以實際實現系統黑暗模式切換
  };
  
  // 處理登出
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // 下一步
  const nextStep = () => setStep(prevStep => prevStep + 1);
  
  // 上一步
  const prevStep = () => setStep(prevStep => prevStep - 1);

  // 處理表單提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('提交表單數據：', data);

    // 使用 SweetAlert2 替代普通的 alert
    Swal.fire({
      title: '預約成功！',
      text: `您已成功預約${data.appointmentDate || '所選日期'} ${data.appointmentTime || '所選時段'}的門診`,
      icon: 'success',
      confirmButtonText: '確定',
      confirmButtonColor: '#00c853',
      timer: 3000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInUp'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutDown'
      }
    }).then((result) => {
      // 預約成功後可以導航到其他頁面
      if (result.isConfirmed || result.isDismissed) {
        router.push('/dashboard');
      }
    });
    
    // 這裡可以加入提交 API 的邏輯
  };

  // 處理基本資料變更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      const parentKeyTyped = parentKey as keyof FormData;
      
      setData(prev => {
        const parentValue = prev[parentKeyTyped];
        // Ensure the parent property is a non-null object before spreading
        if (typeof parentValue === 'object' && parentValue !== null) {
          // Create a copy of the nested object and update the child property
          const parentCopy = {
            ...parentValue,
            [childKey]: value
          };
          
          // Return the updated state
          return {
            ...prev,
            [parentKeyTyped]: parentCopy
          };
        }
        // Return previous state if parentValue is not an object (should not happen with current logic)
        return prev; 
      });
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 處理複選框變更
  const handleCheckboxChange = (category: keyof Pick<FormData, 'diseases' | 'allergies' | 'mentalConditions'>, field: string) => {
    if (category === 'diseases') {
      const diseasesData = { ...data.diseases, [field]: !data.diseases[field as keyof typeof data.diseases] };
      setData(prev => ({ ...prev, diseases: diseasesData }));
    } else if (category === 'allergies') {
      const allergiesData = { ...data.allergies, [field]: !data.allergies[field as keyof typeof data.allergies] };
      setData(prev => ({ ...prev, allergies: allergiesData }));
    } else if (category === 'mentalConditions') {
      const mentalData = { ...data.mentalConditions, [field]: !data.mentalConditions[field as keyof typeof data.mentalConditions] };
      setData(prev => ({ ...prev, mentalConditions: mentalData }));
    }
  };

  // 當"無"被選中時，取消其他選項
  useEffect(() => {
    if (data.diseases.none) {
      const resetDiseases = {
        none: true,
        brain: false,
        heart: false,
        hypertension: false,
        liver: false,
        diabetes: false,
        kidney: false,
        cancer: false,
        immunity: false,
        other: false,
        otherText: ""
      };
      setData(prev => ({ ...prev, diseases: resetDiseases }));
    }
  }, [data.diseases.none]);

  useEffect(() => {
    if (data.allergies.none) {
      const resetAllergies = {
        none: true,
        protein: false,
        antibiotic: false,
        food: false,
        contrast: false,
        anesthetic: false,
        nsaid: false,
        biologics: false,
        other: false,
        otherText: ""
      };
      setData(prev => ({ ...prev, allergies: resetAllergies }));
    }
  }, [data.allergies.none]);

  // 同地址處理
  useEffect(() => {
    if (data.sameAddress) {
      setData(prev => ({
        ...prev,
        homeAddress: prev.contactAddress
      }));
    }
  }, [data.sameAddress, data.contactAddress]);

  return (
    <>
      {/* 頂部標題欄 */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>DTX 系統</h1>
          </div>
          
          <div className={styles.headerRight}>
            {/* 時間顯示 */}
            <div className={styles.dateTime}>{currentDateTime}</div>
            
            {/* 深色模式切換按鈕已移除 */}
            
            {/* 通知圖標已移除 */}
            
            {/* 用戶下拉選單 */}
            <div className={styles.userMenu} ref={userDropdownRef}>
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={styles.userMenuButton}
              >
                <div className={styles.userAvatar}>
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <span className={styles.userName}>{user?.username || '使用者'}</span>
                <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
              </button>
              
              {userDropdownOpen && (
                <div className={styles.userDropdown}>
                  <div className={styles.userDropdownHeader}>
                    <p className={styles.userDropdownName}>{user?.username || '使用者'}</p>
                    <p className={styles.userDropdownRole}>{user?.roles?.[0] || '一般用戶'}</p>
                  </div>
                  <div className={styles.userDropdownContent}>
                    {/* 個人資料按鈕已註解
                    <button className={styles.userDropdownItem}>
                      <FontAwesomeIcon icon={faUserCircle} className={styles.userDropdownIcon} />
                      個人資料
                    </button>
                    */}
                    
                    {/* 帳號設定按鈕已註解
                    <button className={styles.userDropdownItem}>
                      <FontAwesomeIcon icon={faCog} className={styles.userDropdownIcon} />
                      帳號設定
                    </button>
                    */}
                    
                    <button 
                      className={`${styles.userDropdownItem} ${styles.userDropdownItemLogout}`}
                      onClick={handleLogout}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className={styles.userDropdownIcon} />
                      登出
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 頁面標題橫欄 */}
        <div className={styles.headerBar}>
          {/* 改為步驟指示器，添加 data-step 屬性 */}
          <div className={styles.stepIndicator} data-step={step}>
            <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
              <div className={styles.stepIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span>基本資料表</span>
            </div>
            <div className={styles.stepLine}></div>
            <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
              <div className={styles.stepIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span>健康資料表</span>
            </div>
            <div className={styles.stepLine}></div>
            <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
              <div className={styles.stepIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span>填寫量表</span>
            </div>
            <div className={styles.stepLine}></div>
            <div className={`${styles.step} ${step >= 4 ? styles.active : ''}`}>
              <div className={styles.stepIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span>初診預約</span>
            </div>
          </div>
        </div>
      </header>
    
      <div className={styles.formContainer}>
        <div className={styles.formContent}>
          <form onSubmit={handleSubmit}>
            {/* 步驟一：基本資料表 */}
            {step === 1 && (
              <div className={styles.formStep}>
                <h2>基本資料填寫</h2>
                
                <div className={styles.formGrid}>
                  {/* 左側欄位 */}
                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">姓名：</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>出生日期：</label>
                      <div className={styles.dateInputGroup}>
                        <select 
                          name="birth.year"
                          value={data.birth.year}
                          onChange={handleChange}
                          required
                        >
                          <option value="">年份</option>
                          {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <span>年</span>
                        
                        <select 
                          name="birth.month"
                          value={data.birth.month}
                          onChange={handleChange}
                          required
                        >
                          <option value="">月份</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                        <span>月</span>
                        
                        <select 
                          name="birth.day"
                          value={data.birth.day}
                          onChange={handleChange}
                          required
                        >
                          <option value="">日</option>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                        <span>日</span>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>性別：</label>
                      <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                          <input 
                            type="radio" 
                            name="gender" 
                            value="male"
                            checked={data.gender === 'male'}
                            onChange={handleChange}
                          />
                          <span>男</span>
                        </label>
                        <label className={styles.radioLabel}>
                          <input 
                            type="radio" 
                            name="gender" 
                            value="female"
                            checked={data.gender === 'female'}
                            onChange={handleChange}
                          />
                          <span>女</span>
                        </label>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="idNumber">身分證字號：</label>
                      <input 
                        type="text" 
                        id="idNumber" 
                        name="idNumber"
                        value={data.idNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="phone">聯絡電話：</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        value={data.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email">電子信箱：</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* 右側欄位 */}
                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label htmlFor="contactAddress">聯絡地址：</label>
                      <input 
                        type="text" 
                        id="contactAddress" 
                        name="contactAddress"
                        placeholder="請輸入您的聯絡地址"
                        value={data.contactAddress}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <div className={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          id="sameAddress"
                          name="sameAddress"
                          checked={data.sameAddress}
                          onChange={(e) => setData(prev => ({...prev, sameAddress: e.target.checked}))}
                        />
                        <label htmlFor="sameAddress">同聯絡地址</label>
                      </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="homeAddress">戶籍地址：</label>
                      <input 
                        type="text" 
                        id="homeAddress" 
                        name="homeAddress"
                        placeholder="請輸入您的戶籍地址"
                        value={data.homeAddress}
                        onChange={handleChange}
                        disabled={data.sameAddress}
                        required
                      />
                    </div>
                    
                    {/* 緊急聯絡人欄位 */}
                    <div className={styles.emergencyContactSection}>
                      <h3>緊急聯絡人</h3>
                      <div className={styles.formGroup}>
                        <label htmlFor="emergencyContact">緊急聯絡人姓名：</label>
                        <input 
                          type="text" 
                          id="emergencyContact" 
                          name="emergencyContact"
                          placeholder="請輸入緊急聯絡人姓名"
                          value={data.emergencyContact}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="emergencyRelation">關係：</label>
                        <select
                          id="emergencyRelation"
                          name="emergencyRelation"
                          value={data.emergencyRelation}
                          onChange={handleChange}
                          required
                        >
                          <option value="">請選擇</option>
                          <option value="祖父母">祖父母</option>
                          <option value="父母">父母</option>
                          <option value="配偶">配偶</option>
                          <option value="子女">子女</option>
                          <option value="兄弟姊妹">兄弟姊妹</option>
                          <option value="朋友">朋友</option>
                          <option value="其他親屬">其他親屬</option>
                        </select>
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="emergencyPhone">緊急聯絡人電話：</label>
                        <input 
                          type="tel" 
                          id="emergencyPhone" 
                          name="emergencyPhone"
                          placeholder="請輸入緊急聯絡人電話"
                          value={data.emergencyPhone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.nextButton}
                    onClick={nextStep}
                  >
                    下一步
                  </button>
                </div>
              </div>
            )}

            {/* 步驟二：健康資料表 */}
            {step === 2 && (
              <div className={styles.formStep}>
                <h2>健康資料填寫</h2>
                
                <div className={styles.formSection}>
                  <h3>相關疾病史：</h3>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.diseases.none}
                        onChange={() => handleCheckboxChange('diseases', 'none')}
                      />
                      <span>無</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.diseases.brain}
                        onChange={() => handleCheckboxChange('diseases', 'brain')}
                        disabled={data.diseases.none}
                      />
                      <span>中樞神經疾病</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.diseases.heart}
                        onChange={() => handleCheckboxChange('diseases', 'heart')}
                        disabled={data.diseases.none}
                      />
                      <span>心血管疾病</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.diseases.hypertension}
                        onChange={() => handleCheckboxChange('diseases', 'hypertension')}
                        disabled={data.diseases.none}
                      />
                      <span>呼吸方面疾病</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.diseases.liver}
                        onChange={() => handleCheckboxChange('diseases', 'liver')}
                        disabled={data.diseases.none}
                      />
                      <span>肝臟疾病</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.diseases.diabetes}
                        onChange={() => handleCheckboxChange('diseases', 'diabetes')}
                        disabled={data.diseases.none}
                      />
                      <span>糖尿病</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.diseases.kidney}
                        onChange={() => handleCheckboxChange('diseases', 'kidney')}
                        disabled={data.diseases.none}
                      />
                      <span>腎臟病</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.diseases.cancer}
                        onChange={() => handleCheckboxChange('diseases', 'cancer')}
                        disabled={data.diseases.none}
                      />
                      <span>癌症</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.diseases.immunity}
                        onChange={() => handleCheckboxChange('diseases', 'immunity')}
                        disabled={data.diseases.none}
                      />
                      <span>免疫相關疾病</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.diseases.other}
                        onChange={() => handleCheckboxChange('diseases', 'other')}
                        disabled={data.diseases.none}
                      />
                      <span>其他</span>
                    </label>
                    
                    {data.diseases.other && !data.diseases.none && (
                      <div className={styles.otherInput}>
                        <input
                          type="text"
                          placeholder="請輸入其他疾病"
                          value={data.diseases.otherText}
                          onChange={(e) => 
                            setData(prev => ({
                              ...prev,
                              diseases: {
                                ...prev.diseases,
                                otherText: e.target.value
                              }
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.formSection}>
                  <h3>藥物過敏史：</h3>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.allergies.none}
                        onChange={() => handleCheckboxChange('allergies', 'none')}
                      />
                      <span>無</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.allergies.protein}
                        onChange={() => handleCheckboxChange('allergies', 'protein')}
                        disabled={data.allergies.none}
                      />
                      <span>蛋白素類抗生素</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.allergies.antibiotic}
                        onChange={() => handleCheckboxChange('allergies', 'antibiotic')}
                        disabled={data.allergies.none}
                      />
                      <span>非類固醇抗發炎藥</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.allergies.food}
                        onChange={() => handleCheckboxChange('allergies', 'food')}
                        disabled={data.allergies.none}
                      />
                      <span>硫磺藥物</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.allergies.contrast}
                        onChange={() => handleCheckboxChange('allergies', 'contrast')}
                        disabled={data.allergies.none}
                      />
                      <span>抗痙攣藥物</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.allergies.anesthetic}
                        onChange={() => handleCheckboxChange('allergies', 'anesthetic')}
                        disabled={data.allergies.none}
                      />
                      <span>化療藥物</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.allergies.nsaid}
                        onChange={() => handleCheckboxChange('allergies', 'nsaid')}
                        disabled={data.allergies.none}
                      />
                      <span>麻醉藥物</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.allergies.biologics}
                        onChange={() => handleCheckboxChange('allergies', 'biologics')}
                        disabled={data.allergies.none}
                      />
                      <span>生物製劑</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.allergies.other}
                        onChange={() => handleCheckboxChange('allergies', 'other')}
                        disabled={data.allergies.none}
                      />
                      <span>其他</span>
                    </label>
                    
                    {data.allergies.other && !data.allergies.none && (
                      <div className={styles.otherInput}>
                        <input
                          type="text"
                          placeholder="請輸入過敏藥物"
                          value={data.allergies.otherText}
                          onChange={(e) => 
                            setData(prev => ({
                              ...prev,
                              allergies: {
                                ...prev.allergies,
                                otherText: e.target.value
                              }
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.formSection}>
                  <h3>適應症：</h3>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.mentalConditions.adhd}
                        onChange={() => handleCheckboxChange('mentalConditions', 'adhd')}
                      />
                      <span>注意力不足過動症(ADHD)</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.mentalConditions.ptsd}
                        onChange={() => handleCheckboxChange('mentalConditions', 'ptsd')}
                      />
                      <span>創傷後壓力症(PTSD)</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.mentalConditions.anxiety}
                        onChange={() => handleCheckboxChange('mentalConditions', 'anxiety')}
                      />
                      <span>焦慮症(DD)</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.mentalConditions.depression}
                        onChange={() => handleCheckboxChange('mentalConditions', 'depression')}
                      />
                      <span>憂鬱症(BD)</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.mentalConditions.bipolar}
                        onChange={() => handleCheckboxChange('mentalConditions', 'bipolar')}
                      />
                      <span>自閉症(ASD)</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.mentalConditions.asd}
                        onChange={() => handleCheckboxChange('mentalConditions', 'asd')}
                      />
                      <span>表達障礙</span>
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={data.mentalConditions.addiction}
                        onChange={() => handleCheckboxChange('mentalConditions', 'addiction')}
                      />
                      <span>關係障礙</span>
                    </label>
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.prevButton}
                    onClick={prevStep}
                  >
                    上一步
                  </button>
                  <button 
                    type="button" 
                    className={styles.nextButton}
                    onClick={nextStep}
                  >
                    下一步
                  </button>
                </div>
              </div>
            )}

            {/* 步驟三：量表填寫 */}
            {step === 3 && (
              <div className={styles.formStep}>
                <h2>請填寫以下標準量表</h2>
                
                <div className={styles.formSection}>
                  <div className={styles.scaleContainer}>
                    <h3>中文版陳氏ADHD量表(CAS)</h3>
                    <p className={styles.scaleInstructions}>
                      您的孩子是第一週至有以下注意力不足或過動衝動的問題。請依據情況回答，評估各題項從0分-10分填入最適合自己狀況的項目。0分為一點也不，10分為極度地。
                    </p>
                    
                    <div className={styles.scaleItem}>
                      <div className={styles.scaleNumber}>1.</div>
                      <div className={styles.scaleStatement}>常無法注意細節，粗心犯錯。</div>
                      <div className={styles.scaleRating}>
                        <div className={styles.scaleLabels}>
                          <span>一點也不</span>
                          <span>極度地</span>
                        </div>
                        <div className={styles.scaleSlider}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                            <label key={value} className={styles.scaleRadioLabel}>
                              <input
                                type="radio"
                                name="adhdQ1"
                                value={value}
                                onChange={() => {
                                  // 更新評分總和
                                  const newScore = (data.adhdScore || 0) + 1;
                                  setData(prev => ({ ...prev, adhdScore: newScore }));
                                }}
                                className={styles.scaleRadio}
                              />
                              <span>{value}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.scaleItem}>
                      <div className={styles.scaleNumber}>2.</div>
                      <div className={styles.scaleStatement}>經常很難長時間維持注意力。</div>
                      <div className={styles.scaleRating}>
                        <div className={styles.scaleSlider}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                            <label key={value} className={styles.scaleRadioLabel}>
                              <input
                                type="radio"
                                name="adhdQ2"
                                value={value}
                                onChange={() => {
                                  // 更新評分總和
                                  const newScore = (data.adhdScore || 0) + 1;
                                  setData(prev => ({ ...prev, adhdScore: newScore }));
                                }}
                                className={styles.scaleRadio}
                              />
                              <span>{value}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.scaleItem}>
                      <div className={styles.scaleNumber}>3.</div>
                      <div className={styles.scaleStatement}>跟他/她講話時，似乎沒有在聽。</div>
                      <div className={styles.scaleRating}>
                        <div className={styles.scaleSlider}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                            <label key={value} className={styles.scaleRadioLabel}>
                              <input
                                type="radio"
                                name="adhdQ3"
                                value={value}
                                onChange={() => {
                                  // 更新評分總和
                                  const newScore = (data.adhdScore || 0) + 1;
                                  setData(prev => ({ ...prev, adhdScore: newScore }));
                                }}
                                className={styles.scaleRadio}
                              />
                              <span>{value}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.scaleItem}>
                      <div className={styles.scaleNumber}>4.</div>
                      <div className={styles.scaleStatement}>常難以完成交代的工作，如作業。</div>
                      <div className={styles.scaleRating}>
                        <div className={styles.scaleSlider}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                            <label key={value} className={styles.scaleRadioLabel}>
                              <input
                                type="radio"
                                name="adhdQ4"
                                value={value}
                                onChange={() => {
                                  // 更新評分總和
                                  const newScore = (data.adhdScore || 0) + 1;
                                  setData(prev => ({ ...prev, adhdScore: newScore }));
                                }}
                                className={styles.scaleRadio}
                              />
                              <span>{value}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.scaleItem}>
                      <div className={styles.scaleNumber}>5.</div>
                      <div className={styles.scaleStatement}>常有困難管理時間、難以規劃或按部就班完成事情。</div>
                      <div className={styles.scaleRating}>
                        <div className={styles.scaleSlider}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                            <label key={value} className={styles.scaleRadioLabel}>
                              <input
                                type="radio"
                                name="adhdQ5"
                                value={value}
                                onChange={() => {
                                  // 更新評分總和
                                  const newScore = (data.adhdScore || 0) + 1;
                                  setData(prev => ({ ...prev, adhdScore: newScore }));
                                }}
                                className={styles.scaleRadio}
                              />
                              <span>{value}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.scaleItem}>
                      <div className={styles.scaleNumber}>6.</div>
                      <div className={styles.scaleStatement}>常逃避、不喜歡從事需要持續專注的事情，如作業。</div>
                      <div className={styles.scaleRating}>
                        <div className={styles.scaleSlider}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                            <label key={value} className={styles.scaleRadioLabel}>
                              <input
                                type="radio"
                                name="adhdQ6"
                                value={value}
                                onChange={() => {
                                  // 更新評分總和
                                  const newScore = (data.adhdScore || 0) + 1;
                                  setData(prev => ({ ...prev, adhdScore: newScore }));
                                }}
                                className={styles.scaleRadio}
                              />
                              <span>{value}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.scaleCompletionInfo}>
                      <p>創傷後壓力症評量表(PCL-5) <span>56分</span></p>
                      <div className={styles.completionStatus}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>已完成</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.formAlert}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>請確保您已完成所有需填寫的量表</p>
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.prevButton}
                    onClick={prevStep}
                  >
                    上一步
                  </button>
                  <button 
                    type="button" 
                    className={styles.nextButton}
                    onClick={nextStep}
                  >
                    下一步
                  </button>
                </div>
              </div>
            )}

            {/* 步驟四：初診預約 */}
            {step === 4 && (
              <div className={styles.formStep}>
                <h2>初診預約</h2>
                
                <div className={styles.doctorSelection}>
                  <h3>選擇醫師</h3>
                  <div className={styles.doctorList}>
                    <label className={`${styles.doctorCard} ${data.doctorChoice === 'doctor1' ? styles.selected : ''}`}>
                      <input
                        type="radio"
                        name="doctorChoice"
                        value="doctor1"
                        checked={data.doctorChoice === 'doctor1'}
                        onChange={handleChange}
                      />
                      <div className={styles.doctorImg}>
                        <img src="https://via.placeholder.com/150" alt="程那安 醫師" />
                      </div>
                      <div className={styles.doctorInfo}>
                        <h4>程那安 醫師</h4>
                      </div>
                    </label>
                    
                    <label className={`${styles.doctorCard} ${data.doctorChoice === 'doctor2' ? styles.selected : ''}`}>
                      <input
                        type="radio"
                        name="doctorChoice"
                        value="doctor2"
                        checked={data.doctorChoice === 'doctor2'}
                        onChange={handleChange}
                      />
                      <div className={styles.doctorImg}>
                        <img src="https://via.placeholder.com/150" alt="林素惠 醫師" />
                      </div>
                      <div className={styles.doctorInfo}>
                        <h4>林素惠 醫師</h4>
                      </div>
                    </label>
                    
                    <label className={`${styles.doctorCard} ${data.doctorChoice === 'doctor3' ? styles.selected : ''}`}>
                      <input
                        type="radio"
                        name="doctorChoice"
                        value="doctor3"
                        checked={data.doctorChoice === 'doctor3'}
                        onChange={handleChange}
                      />
                      <div className={styles.doctorImg}>
                        <img src="https://via.placeholder.com/150" alt="黃英翔 醫師" />
                      </div>
                      <div className={styles.doctorInfo}>
                        <h4>黃英翔 醫師</h4>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className={styles.appointmentCalendar}>
                  <h3>選擇日期及時間</h3>
                  <div className={styles.calendarHeader}>
                    <button type="button" className={styles.calendarNav}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h4>2024年6月</h4>
                    <button type="button" className={styles.calendarNav}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className={styles.calendarGrid}>
                    <div className={styles.calendarRow}>
                      <div className={styles.calendarHeaderCell}>星期日</div>
                      <div className={styles.calendarHeaderCell}>星期一</div>
                      <div className={styles.calendarHeaderCell}>星期二</div>
                      <div className={styles.calendarHeaderCell}>星期三</div>
                      <div className={styles.calendarHeaderCell}>星期四</div>
                      <div className={styles.calendarHeaderCell}>星期五</div>
                      <div className={styles.calendarHeaderCell}>星期六</div>
                    </div>
                    
                    <div className={styles.calendarRow}>
                      <div className={`${styles.calendarCell} ${styles.disabled}`}></div>
                      <div className={`${styles.calendarCell} ${styles.disabled}`}></div>
                      <div className={`${styles.calendarCell} ${styles.disabled}`}></div>
                      <div className={`${styles.calendarCell} ${styles.disabled}`}></div>
                      <div className={`${styles.calendarCell} ${styles.disabled}`}></div>
                      <div className={`${styles.calendarCell} ${styles.disabled}`}></div>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-01' }))}>1</div>
                    </div>
                    
                    <div className={styles.calendarRow}>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-02' }))}>2</div>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-03' }))}>3</div>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-04' }))}>4</div>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-05' }))}>5</div>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-06' }))}>6</div>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-07' }))}>7</div>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-08' }))}>8</div>
                    </div>
                    
                    <div className={styles.calendarRow}>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-09' }))}>9</div>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-10' }))}>10</div>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-11' }))}>11</div>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-12' }))}>12</div>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-13' }))}>13</div>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-14' }))}>14</div>
                      <div className={styles.calendarCell} onClick={() => setData(prev => ({ ...prev, appointmentDate: '2024-06-15' }))}>15</div>
                    </div>
                    
                  </div>
                  
                  <div className={styles.timeSlots}>
                    <div className={styles.timeSlotSection}>
                      <h4>上午</h4>
                      <div className={styles.timeSlotGrid}>
                        <button 
                          type="button" 
                          className={`${styles.timeSlot} ${data.appointmentTime === '09:30' ? styles.selected : ''}`}
                          onClick={() => setData(prev => ({ ...prev, appointmentTime: '09:30' }))}
                        >
                          09:30
                        </button>
                        <button 
                          type="button" 
                          className={`${styles.timeSlot} ${data.appointmentTime === '10:15' ? styles.selected : ''}`}
                          onClick={() => setData(prev => ({ ...prev, appointmentTime: '10:15' }))}
                        >
                          10:15
                        </button>
                        <button 
                          type="button" 
                          className={`${styles.timeSlot} ${data.appointmentTime === '11:00' ? styles.selected : ''}`}
                          onClick={() => setData(prev => ({ ...prev, appointmentTime: '11:00' }))}
                        >
                          11:00
                        </button>
                        <button 
                          type="button" 
                          className={`${styles.timeSlot} ${data.appointmentTime === '11:45' ? styles.selected : ''}`}
                          onClick={() => setData(prev => ({ ...prev, appointmentTime: '11:45' }))}
                        >
                          11:45
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.timeSlotSection}>
                      <h4>下午</h4>
                      <div className={styles.timeSlotGrid}>
                        <button 
                          type="button" 
                          className={`${styles.timeSlot} ${data.appointmentTime === '14:00' ? styles.selected : ''}`}
                          onClick={() => setData(prev => ({ ...prev, appointmentTime: '14:00' }))}
                        >
                          14:00
                        </button>
                        <button 
                          type="button" 
                          className={`${styles.timeSlot} ${data.appointmentTime === '14:45' ? styles.selected : ''}`}
                          onClick={() => setData(prev => ({ ...prev, appointmentTime: '14:45' }))}
                        >
                          14:45
                        </button>
                        <button 
                          type="button" 
                          className={`${styles.timeSlot} ${data.appointmentTime === '15:30' ? styles.selected : ''}`}
                          onClick={() => setData(prev => ({ ...prev, appointmentTime: '15:30' }))}
                        >
                          15:30
                        </button>
                        <button 
                          type="button" 
                          className={`${styles.timeSlot} ${data.appointmentTime === '16:15' ? styles.selected : ''}`}
                          onClick={() => setData(prev => ({ ...prev, appointmentTime: '16:15' }))}
                        >
                          16:15
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.prevButton}
                    onClick={prevStep}
                  >
                    上一步
                  </button>
                  <button 
                    type="submit" 
                    className={styles.submitButton}
                  >
                    預約
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
