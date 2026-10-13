//タスクの管理処理
import { Task, TaskUpdate } from "./Task";
import { TaskStorage } from "./TaskStorage";

export class TaskManager {
    private tasks: Task[] = [];
    private storage: TaskStorage;

    constructor() {
        this.storage = new TaskStorage();
        this.tasks = this.storage.load();
    }

    //タスクの追加
    add(
        title: string,
        description: string,
        priority: Task["priority"],
        genre: string | null,
        dueAt: string | null
    ): void {
        const today = this.getToday();
        const task: Task = {
            id: this.getNextId(),
            title,
            description,
            priority,
            genre,
            dueAt,
            createdAt: today,
            updatedAt: today,
            completedAt: null
        };

        this.tasks.push(task);
        this.storage.save(this.tasks);
    }

    //タスクの更新
    change(id: number, changes: TaskUpdate): void {
        this.tasks = this.tasks.map (task =>
            task.id === id
                ? { ...task, ...changes, updatedAt: this.getToday() }
                : task
            )
        this.storage.save(this.tasks);
    }

    //タスクの完了
    complete(id: number): void {
        this.tasks = this.tasks.map (task =>
            task.id === id
                ? { ...task, completedAt: this.getToday()}
                : task
        )
        this.storage.save(this.tasks);
    }

    //タスクの削除
    remove(id: number): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.storage.save(this.tasks);
    }

    getAll(): Task[] {
        return this.tasks;
    }

    private getToday(): string {
        return new Date().toLocaleDateString("sv-SE", {
            timeZone: "Asia/Tokyo"
        });
    }

    private getNextId(): number {
        return this.tasks.reduce( (maxId, task) => Math.max(maxId, task.id), 0 ) + 1;
    }
}
