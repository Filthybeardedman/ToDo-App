//JSONファイルへの保存・読み込み
import * as fs from "node:fs";
import * as path from "node:path";
import { Task } from "./Task";

export class TaskStorage {
    private readonly filePath: string;

    constructor() {
        this.filePath = path.join(__dirname, "../data/tasks.json");
    }

    load(): Task[] {
        if (!fs.existsSync(this.filePath)) {
            fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
            fs.writeFileSync(this.filePath, "[]", "utf8");
            return [];
        }

        const json = fs.readFileSync(this.filePath, "utf8");
        return JSON.parse(json);
    }

    save(tasks: Task[]): void {
        const json = JSON.stringify(tasks, null, 4);
        fs.writeFileSync(this.filePath, json, "utf-8");
    }
}