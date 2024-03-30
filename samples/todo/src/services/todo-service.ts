import { ServiceFactory } from "@rsm-hcd/javascript-react";
import { TestRecord } from "../models/todo";

export const TodoService = {
    list: ServiceFactory.list(TestRecord, "api/todos"),
};
