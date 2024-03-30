import { http, HttpResponse } from "msw";
import { Todo } from "../models/todo";

const ServiceResponseFactory = {
    create: <TResultObject>(resultObject: TResultObject | TResultObject[]) => {
        if (Array.isArray(resultObject)) {
            return {
                resultObject,
                rowCount: resultObject.length,
            };
        }

        return { resultObject, rowCount: 1 };
    },
};

const todos: Todo[] = [
    { id: 1, description: "Test" },
    { id: 2, description: "Test2" },
];

let nextTodoId = 3;

export const handlers = [
    http.get("/api/todos", () => {
        return HttpResponse.json(ServiceResponseFactory.create(todos));
    }),
    http.get("/api/todos/:id", ({ params }) => {
        const id = Number(params.id);
        const todo = todos.find((todo) => todo.id === id);
        if (!todo) {
            return new Response(null, {
                status: 400,
            });
        }
        return HttpResponse.json(ServiceResponseFactory.create(todo));
    }),
    http.post("/api/todos", async ({ request }) => {
        const todo = (await request.json()) as Todo;
        const newTodo = { ...todo, id: nextTodoId++ };
        todos.push(newTodo);

        return HttpResponse.json(ServiceResponseFactory.create(newTodo));
    }),
    http.put("/api/todos/:id", async ({ params, request }) => {
        const id = Number(params.id);
        const updatedTodo = (await request.json()) as Todo;
        const index = todos.findIndex((todo) => todo.id === id);
        todos[index] = updatedTodo;

        return HttpResponse.json(ServiceResponseFactory.create(updatedTodo));
    }),
    http.delete("/api/todos/:id", ({ params }) => {
        const id = Number(params.id);
        const index = todos.findIndex((todo) => todo.id === id);
        todos.splice(index, 1);

        return HttpResponse.json(ServiceResponseFactory.create(true));
    }),
];
