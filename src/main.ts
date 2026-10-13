// アプリケーションのメイン処理
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { TaskManager } from "./TaskManager.js";
import { Task } from "./Task";

const rl = createInterface({ input, output });
const manager = new TaskManager();

// メニューを表示する
function showMenu(): void {
    console.log("\n========================");
    console.log("       ToDo App");
    console.log("========================");
    console.log("1. タスク一覧");
    console.log("2. タスクの新規作成");
    console.log("3. タスクの変更");
    console.log("4. タスクの完了");
    console.log("5. タスクの削除");
    console.log("0. 終了");
}

// 数値を入力させる
async function askNumber(message: string): Promise<number> {
    while (true) {
        const answer = await rl.question(message);
        const value = Number(answer);

        if (answer.trim() !== "" && Number.isInteger(value)) {
            return value;
        }

        console.log("整数を入力してください。");
    }
}

// タスク一覧を表示する
function showTasks(): void {
    const tasks = manager.getAll();

    if (tasks.length === 0) {
        console.log("\nタスクはありません。");
        return;
    }

    console.log("\n===== タスク一覧 =====");

    for (const task of tasks) {
        console.log(`\nID：${task.id}`);
        console.log(`タイトル：${task.title}`);
        console.log(`内容：${task.description}`);
        console.log(`優先度：${task.priority}`);
        console.log(`ジャンル：${task.genre ?? "未設定"}`);
        console.log(`期日：${task.dueAt ?? "未設定"}`);
        console.log(`作成日：${task.createdAt}`);
        console.log(`更新日：${task.updatedAt}`);
        console.log(`完了日：${task.completedAt ?? "未完了"}`);
    }
}

// タスクを新規作成する
async function addTask(): Promise<void> {
    const title = await rl.question("タイトル：");
    const description = await rl.question("内容：");

    const priorityNumber = await askNumber("優先度（1～5）：");

    if (priorityNumber < 1 || priorityNumber > 5) {
        console.log("優先度は1～5で指定してください。");
        return;
    }

    const genreInput = await rl.question("ジャンル（省略可）：");
    const dueAtInput = await rl.question("期日（YYYY-MM-DD、省略可）：");

    const genre = genreInput.trim() || null;
    const dueAt = dueAtInput.trim() || null;

    manager.add(
        title,
        description,
        priorityNumber as Task["priority"],
        genre,
        dueAt
    );

    console.log("\nタスクを作成しました。");
}

// タスクを変更する
async function changeTask(): Promise<void> {
    const id = await askNumber("変更するタスクのID：");
    const task = manager.getAll().find(task => task.id === id);

    if (!task) {
        console.log("指定されたタスクが見つかりません。");
        return;
    }

    console.log("変更しない項目は、そのままEnterを押してください。");

    const titleInput = await rl.question(`タイトル（${task.title}）：`);
    const descriptionInput = await rl.question(`内容（${task.description}）：`);
    const priorityInput = await rl.question(`優先度（${task.priority}）：`);
    const genreInput = await rl.question(`ジャンル（${task.genre ?? "未設定"}）：`);
    const dueAtInput = await rl.question(`期日（${task.dueAt ?? "未設定"}）：`);

    const title = titleInput.trim() || task.title;
    const description = descriptionInput.trim() || task.description;
    const genre = genreInput.trim() || task.genre;
    const dueAt = dueAtInput.trim() || task.dueAt;

    let priority = task.priority;

    if (priorityInput.trim() !== "") {
        const value = Number(priorityInput);

        if (!Number.isInteger(value) || value < 1 || value > 5) {
            console.log("優先度は1～5で指定してください。");
            return;
        }

        priority = value as Task["priority"];
    }

    manager.change(id, {
        title,
        description,
        priority,
        genre,
        dueAt
    });

    console.log("\nタスクを変更しました。");
}

// タスクを完了する
async function completeTask(): Promise<void> {
    const id = await askNumber("完了するタスクのID：");
    const task = manager.getAll().find(task => task.id === id);

    if (!task) {
        console.log("指定されたタスクが見つかりません。");
        return;
    }

    if (task.completedAt !== null) {
        console.log("このタスクはすでに完了しています。");
        return;
    }

    manager.complete(id);
    console.log("タスクを完了しました。");
}

// タスクを削除する
async function removeTask(): Promise<void> {
    const id = await askNumber("削除するタスクのID：");
    const task = manager.getAll().find(task => task.id === id);

    if (!task) {
        console.log("指定されたタスクが見つかりません。");
        return;
    }

    const answer = await rl.question(
        `「${task.title}」を削除しますか？（y/n）：`
    );

    if (answer.trim().toLowerCase() !== "y") {
        console.log("削除をキャンセルしました。");
        return;
    }

    manager.remove(id);
    console.log("タスクを削除しました。");
}

// アプリケーションを実行する
async function main(): Promise<void> {
    try {
        while (true) {
            showMenu();

            const choice = await askNumber("番号を入力してください：");

            switch (choice) {
                case 1:
                    showTasks();
                    break;

                case 2:
                    await addTask();
                    break;

                case 3:
                    await changeTask();
                    break;

                case 4:
                    await completeTask();
                    break;

                case 5:
                    await removeTask();
                    break;

                case 0:
                    console.log("ToDo Appを終了します。");
                    return;

                default:
                    console.log("0～5の番号を入力してください。");
            }
        }
    } finally {
        rl.close();
    }
}

main().catch(error => {
    console.error("エラーが発生しました：", error);
    process.exitCode = 1;
});