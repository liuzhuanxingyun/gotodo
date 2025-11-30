import Dexie from 'dexie';

export const db = new Dexie('GoTodoDB');

// 定义数据库架构
// id 是主键
// 其他字段是被索引的属性，用于快速查询
db.version(1).stores({
  todos: 'id, createdAt, isImportant, isUrgent, completed'
});