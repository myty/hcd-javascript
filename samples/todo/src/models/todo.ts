import { Record } from "immutable";

export interface Todo {
    id: number;
    description: string;
    completed?: boolean;
}

export class TestRecord extends Record<Todo>({
    id: 0,
    description: "",
    completed: false,
}) {}
