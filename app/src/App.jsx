import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Languages, MessageSquare, LayoutGrid } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import MatrixView from './components/MatrixView';
import { useTodos } from './hooks/useTodos';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function AppContent() {
  const [view, setView] = useState('chat'); // 'chat' or 'matrix'
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo, addSubTask, toggleSubTask, updateSubTask, moveTodoToQuadrant } = useTodos();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-container">
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.8rem 0', 
        marginBottom: '1.5rem' 
      }}>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ 
            margin: 0, 
            fontSize: '1.8rem', 
            fontWeight: 700, 
            background: 'linear-gradient(to right, var(--accent-color), #8b5cf6)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            letterSpacing: '-0.02em',
            minWidth: '140px'
          }}
        >
          {t('appTitle')}
        </motion.h1>

        <nav className="nav-bar" style={{ margin: 0, padding: '0.3rem', gap: '0.3rem' }}>
          <button
            className={`nav-item ${view === 'chat' ? 'active' : ''}`}
            onClick={() => setView('chat')}
            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <MessageSquare size={18} />
            <span>{t('chatCapture')}</span>
            {view === 'chat' && (
              <motion.div
                layoutId="nav-pill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '9999px',
                  background: 'var(--glass-bg)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  zIndex: -1
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
          <button
            className={`nav-item ${view === 'matrix' ? 'active' : ''}`}
            onClick={() => setView('matrix')}
            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <LayoutGrid size={18} />
            <span>{t('matrixView')}</span>
            {view === 'matrix' && (
              <motion.div
                layoutId="nav-pill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '9999px',
                  background: 'var(--glass-bg)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  zIndex: -1
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        </nav>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', minWidth: '140px', justifyContent: 'flex-end' }}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn" 
            onClick={toggleTheme}
            style={{ padding: '0', borderRadius: '50%', width: '40px', height: '40px', justifyContent: 'center' }}
            title={theme === 'light' ? t('dark') : t('light')}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn" 
            onClick={() => setLanguage(l => l === 'en' ? 'zh' : 'en')}
            style={{ padding: '0', borderRadius: '50%', width: '40px', height: '40px', justifyContent: 'center' }}
            title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
          >
            <Languages size={20} />
          </motion.button>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {view === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '1rem' }}
            >
              <ChatInterface onAddTodo={addTodo} />
            </motion.div>
          ) : (
            <motion.div
              key="matrix"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ height: '100%' }}
            >
              <MatrixView
                todos={todos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
                onAddSubTask={addSubTask}
                onToggleSubTask={toggleSubTask}
                onUpdateSubTask={updateSubTask}
                onMoveTodo={moveTodoToQuadrant}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
