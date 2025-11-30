import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ChatInterface({ onAddTodo }) {
    const { t } = useLanguage();
    const [input, setInput] = useState('');
    const [isImportant, setIsImportant] = useState(false);
    const [isUrgent, setIsUrgent] = useState(false);
    const [history, setHistory] = useState([
        { role: 'assistant', text: 'assistantIntro' }
    ]);
    const endRef = useRef(null);

    useEffect(() => {
        setHistory(prev => prev.map((msg, i) =>
            i === 0 ? { ...msg, text: 'assistantIntro' } : msg
        ));
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input, isLiteral: true };
        setHistory(prev => [...prev, userMsg]);

        const newTodo = onAddTodo(input, isImportant, isUrgent);

        let quadrantKey = '';
        if (isImportant && isUrgent) quadrantKey = 'quadrants.q1';
        else if (isImportant && !isUrgent) quadrantKey = 'quadrants.q2';
        else if (!isImportant && isUrgent) quadrantKey = 'quadrants.q3';
        else quadrantKey = 'quadrants.q4';

        setTimeout(() => {
            setHistory(prev => [...prev, {
                role: 'assistant',
                text: 'assistantAdded',
                params: { text: input, quadrant: quadrantKey }
            }]);
        }, 600);

        setInput('');
    };

    const renderMessageText = (msg) => {
        if (msg.isLiteral) return msg.text;
        if (msg.text === 'assistantAdded') {
            return t('assistantAdded')(msg.params.text, t(msg.params.quadrant));
        }
        return t(msg.text);
    };

    return (
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <AnimatePresence initial={false}>
                    {history.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: '1rem 1.5rem',
                                borderRadius: '20px',
                                background: msg.role === 'user' ? 'var(--accent-color)' : 'var(--glass-bg-secondary)',
                                borderBottomRightRadius: msg.role === 'user' ? '4px' : '20px',
                                borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '20px',
                                lineHeight: '1.6',
                                color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                                boxShadow: msg.role === 'user' ? '0 4px 12px var(--accent-glow)' : 'none',
                                border: msg.role === 'assistant' ? '1px solid var(--glass-border)' : 'none'
                            }}
                        >
                            {renderMessageText(msg)}
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={endRef} />
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'var(--glass-bg-secondary)' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center' }}>
                    <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`btn ${isImportant ? 'btn-primary' : ''}`}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            background: isImportant ? 'var(--accent-color)' : 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        <input type="checkbox" checked={isImportant} onChange={e => setIsImportant(e.target.checked)} style={{ display: 'none' }} />
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isImportant ? 'white' : 'var(--q1-color)' }}></div>
                        <span>{t('important')}</span>
                    </motion.label>
                    <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`btn ${isUrgent ? 'btn-primary' : ''}`}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            background: isUrgent ? 'var(--accent-color)' : 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        <input type="checkbox" checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)} style={{ display: 'none' }} />
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isUrgent ? 'white' : 'var(--q1-color)' }}></div>
                        <span>{t('urgent')}</span>
                    </motion.label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={t('typeTask')}
                        style={{
                            flex: 1,
                            background: 'var(--glass-bg)',
                            border: '2px solid var(--accent-color)',
                            padding: '1rem 1.5rem',
                            borderRadius: '16px',
                            color: 'var(--text-primary)',
                            fontSize: '1.1rem',
                            outline: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => e.target.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.15)'}
                        onBlur={(e) => e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="btn btn-primary"
                        style={{ padding: '0.8rem', borderRadius: '16px', width: '54px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Send size={24} />
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
