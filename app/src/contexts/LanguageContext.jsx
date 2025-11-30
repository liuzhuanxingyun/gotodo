import { createContext, useState, useContext } from 'react';

const translations = {
    en: {
        appTitle: 'Time Waits For No One',
        chatCapture: 'Chat Capture',
        matrixView: 'Matrix View',
        important: 'Important',
        urgent: 'Urgent',
        send: 'Send',
        typeTask: 'Type a new task...',
        doFirst: 'DO FIRST',
        schedule: 'SCHEDULE',
        delegate: 'DELEGATE',
        eliminate: 'ELIMINATE',
        noTasks: 'No tasks',
        addSubTask: 'Add sub-task...',
        assistantIntro: 'Hello! What needs to be done today?',
        assistantAdded: (text, quadrant) => `Got it. I've added "${text}" to ${quadrant}.`,
        quadrants: {
            q1: 'Do First (Important & Urgent)',
            q2: 'Schedule (Important & Not Urgent)',
            q3: 'Delegate (Not Important & Urgent)',
            q4: 'Eliminate (Not Important & Not Urgent)'
        },
        settings: 'Settings',
        language: 'Language',
        theme: 'Theme',
        light: 'Day',
        dark: 'Night'
    },
    zh: {
        appTitle: '时不我待',
        chatCapture: '对话捕捉',
        matrixView: '矩阵视图',
        important: '重要',
        urgent: '紧急',
        send: '发送',
        typeTask: '输入新任务...',
        doFirst: '先做',
        schedule: '计划',
        delegate: '委派',
        eliminate: '删除',
        noTasks: '暂无任务',
        addSubTask: '添加子任务...',
        assistantIntro: '你好！今天有什么待办事项？',
        assistantAdded: (text, quadrant) => `收到。已将 "${text}" 添加到 ${quadrant}。`,
        quadrants: {
            q1: '先做 (重要且紧急)',
            q2: '计划 (重要但不紧急)',
            q3: '委派 (不重要但紧急)',
            q4: '删除 (不重要且不紧急)'
        },
        settings: '设置',
        language: '语言',
        theme: '主题',
        light: '白天',
        dark: '晚上'
    }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('zh'); // Default to Chinese as requested implicitly by "readme改成中文" and "初期就英文和中文就可以了"

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];
        for (const k of keys) {
            value = value?.[k];
        }
        return value || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
