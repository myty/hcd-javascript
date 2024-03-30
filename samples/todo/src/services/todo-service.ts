import { ServiceFactory } from "@rsm-hcd/javascript-react";
import { TestRecord } from "../models/todo";

export const TodoService = {
    list: ServiceFactory.list(TestRecord, "api/todos"),
    create: ServiceFactory.create(TestRecord, "api/todos"),
    update: ServiceFactory.update(TestRecord, "api/todos/:id"),
    get: ServiceFactory.get(TestRecord, "api/todos/:id"),
    delete: ServiceFactory.delete("api/todos/:id"),
};
