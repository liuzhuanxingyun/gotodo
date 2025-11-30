import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Check, GripVertical } from 'lucide-react';
import { DndContext, useDraggable, useDroppable, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Presentation component (no DnD logic)
function TodoItem({ todo, onToggle, onDelete, onUpdate, onAddSubTask, onToggleSubTask, onUpdateSubTask, isOverlay, dragProps = {}, color }) {
    const { t } = useLanguage();
    const [expanded, setExpanded] = useState(false);
    const [subInput, setSubInput] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const handleSubSubmit = (e) => {
        e.preventDefault();
        if (!subInput.trim()) return;
        onAddSubTask(todo.id, subInput);
        setSubInput('');
    };

    const handleUpdate = () => {
        if (editText.trim() && editText !== todo.text) {
            onUpdate(todo.id, editText);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleUpdate();
        if (e.key === 'Escape') {
            setEditText(todo.text);
            setIsEditing(false);
        }
    };

    return (
        <div
            className={`glass-panel ${isOverlay ? 'overlay-item' : ''}`}
            style={{
                padding: '1rem',
                marginBottom: '1rem',
                borderLeft: `4px solid ${todo.completed ? 'var(--text-secondary)' : (color || 'var(--accent-color)')}`,
                opacity: todo.completed ? 0.6 : 1,
                background: isOverlay ? 'var(--glass-bg-hover)' : 'var(--glass-bg)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: isOverlay ? '0 10px 30px rgba(0,0,0,0.2)' : 'var(--glass-shadow)',
                ...dragProps.style
            }}
            ref={dragProps.setNodeRef}
            onClick={() => !isEditing && !isOverlay && setExpanded(!expanded)}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div
                    {...dragProps.attributes}
                    {...dragProps.listeners}
                    style={{ cursor: 'grab', color: 'var(--text-secondary)', opacity: 0.5, display: 'flex', alignItems: 'center' }}
                >
                    <GripVertical size={16} />
                </div>

                <motion.div
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => { e.stopPropagation(); onToggle(todo.id); }}
                    style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        border: '2px solid var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: todo.completed ? 'var(--text-secondary)' : 'transparent',
                        cursor: 'pointer'
                    }}
                >
                    {todo.completed && <Check size={14} color="white" />}
                </motion.div>

                {isEditing ? (
                    <input
                        type="text"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        onBlur={handleUpdate}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        onClick={e => e.stopPropagation()}
                        style={{
                            flex: 1,
                            background: 'var(--input-bg)',
                            border: '1px solid var(--accent-color)',
                            color: 'var(--text-primary)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                    />
                ) : (
                    <span
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                            setEditText(todo.text);
                        }}
                        style={{
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            flex: 1,
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {todo.text}
                    </span>
                )}

                <motion.button
                    whileHover={{ scale: 1.1, color: '#ef4444' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '4px',
                        opacity: 0.6,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Trash2 size={16} />
                </motion.button>
            </div>

            {expanded && !isOverlay && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                    onClick={e => e.stopPropagation()}
                >
                    <div style={{ marginTop: '1rem', paddingLeft: '2.2rem', borderLeft: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.8rem' }}>
                            {todo.subTasks.map(sub => (
                                <SubTaskItem
                                    key={sub.id}
                                    sub={sub}
                                    todoId={todo.id}
                                    onToggle={onToggleSubTask}
                                    onUpdate={onUpdateSubTask}
                                />
                            ))}
                        </div>
                        <form onSubmit={handleSubSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={subInput}
                                onChange={e => setSubInput(e.target.value)}
                                placeholder={t('addSubTask')}
                                style={{
                                    background: 'var(--input-bg)',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    flex: 1
                                }}
                            />
                        </form>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// Wrapper component for DnD logic
function DraggableTodoItem({ todo, ...props }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: todo.id,
        data: { todo }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 999 : 'auto',
        touchAction: 'none'
    };

    return (
        <TodoItem
            todo={todo}
            {...props}
            dragProps={{ attributes, listeners, setNodeRef, style }}
        />
    );
}

function SubTaskItem({ sub, todoId, onToggle, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(sub.text);

    const handleUpdate = () => {
        if (editText.trim() && editText !== sub.text) {
            onUpdate(todoId, sub.id, editText);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleUpdate();
        if (e.key === 'Escape') {
            setEditText(sub.text);
            setIsEditing(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
        >
            <motion.div
                whileTap={{ scale: 0.8 }}
                onClick={() => onToggle(todoId, sub.id)}
                style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '1.5px solid var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: sub.completed ? 'var(--text-secondary)' : 'transparent',
                    cursor: 'pointer'
                }}
            >
                {sub.completed && <Check size={10} color="white" />}
            </motion.div>

            {isEditing ? (
                <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onBlur={handleUpdate}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    style={{
                        flex: 1,
                        background: 'var(--input-bg)',
                        border: '1px solid var(--accent-color)',
                        color: 'var(--text-primary)',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        outline: 'none',
                        fontSize: '0.9rem'
                    }}
                />
            ) : (
                <span
                    onDoubleClick={() => {
                        setIsEditing(true);
                        setEditText(sub.text);
                    }}
                    style={{ textDecoration: sub.completed ? 'line-through' : 'none', cursor: 'text', transition: 'all 0.2s' }}
                >
                    {sub.text}
                </span>
            )}
        </motion.div>
    );
}

function Quadrant({ id, title, color, todos, ...props }) {
    const { t } = useLanguage();
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '1rem',
                borderTop: `5px solid ${color}`,
                background: isOver ? 'var(--glass-bg-hover)' : 'var(--glass-bg-secondary)',
                borderRadius: '16px',
                boxShadow: isOver ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'var(--glass-shadow)',
                transition: 'all 0.3s ease',
                border: isOver ? `1px solid ${color}` : '1px solid var(--glass-border)'
            }}
        >
            <h3 style={{ color: color, marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 600, letterSpacing: '0.05em' }}>
                {title}
                <span style={{ opacity: 0.5, fontSize: '0.9rem', background: 'rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: '12px' }}>{todos.length}</span>
            </h3>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px', minHeight: 0 }}>
                {todos.map(todo => (
                    <DraggableTodoItem key={todo.id} todo={todo} color={color} {...props} />
                ))}
                {todos.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem', fontSize: '0.9rem', fontStyle: 'italic' }}
                    >
                        {t('noTasks')}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default function MatrixView({ todos, onMoveTodo, ...props }) {
    const { t } = useLanguage();
    const [activeId, setActiveId] = useState(null);
    const activeTodo = activeId ? todos.find(t => t.id === activeId) : null;

    const q1 = todos.filter(t => t.isImportant && t.isUrgent);
    const q2 = todos.filter(t => t.isImportant && !t.isUrgent);
    const q3 = todos.filter(t => !t.isImportant && t.isUrgent);
    const q4 = todos.filter(t => !t.isImportant && !t.isUrgent);

    const getTodoColor = (todo) => {
        if (todo.isImportant && todo.isUrgent) return 'var(--q1-color)';
        if (todo.isImportant && !todo.isUrgent) return 'var(--q2-color)';
        if (!todo.isImportant && todo.isUrgent) return 'var(--q3-color)';
        return 'var(--q4-color)';
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // Check if dropped on a quadrant
            if (['q1', 'q2', 'q3', 'q4'].includes(over.id)) {
                onMoveTodo(active.id, over.id);
            }
        }

        setActiveId(null);
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: '1rem',
                height: '100%',
                paddingBottom: '0',
                boxSizing: 'border-box',
                minHeight: 0 
            }}>
                <Quadrant id="q1" title={t('doFirst')} color="var(--q1-color)" todos={q1} {...props} />
                <Quadrant id="q2" title={t('schedule')} color="var(--q2-color)" todos={q2} {...props} />
                <Quadrant id="q3" title={t('delegate')} color="var(--q3-color)" todos={q3} {...props} />
                <Quadrant id="q4" title={t('eliminate')} color="var(--q4-color)" todos={q4} {...props} />
            </div>
            <DragOverlay dropAnimation={dropAnimation}>
                {activeTodo ? <TodoItem todo={activeTodo} isOverlay {...props} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
