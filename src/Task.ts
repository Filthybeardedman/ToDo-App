//タスクのデータ構造
export interface Task {
    id: number;//ID

    title: string;//タイトル
    description: string;//内容
    priority: 1 | 2 | 3 | 4 | 5; // 優先度（1〜5）
    genre: string | null;// ジャンル
    dueAt: string | null;//期日　（YYYY-MM-DD）

    createdAt: string;//作成日（YYYY-MM-DD）
    updatedAt: string;//更新日（YYYY-MM-DD）
    completedAt: string | null;//完了日（YYYY-MM-DD）
}

//タスクの更新データ構造
export type TaskUpdate = Partial<
    Pick<Task, "title" | "description" | "priority" | "genre" | "dueAt">
>;