import { http, HttpResponse } from "msw";

export const handlers = [
    http.get("/api/todos", () => {
        return HttpResponse.json({
            resultObject: [
                { id: 1, value: "Test" },
                { id: 2, value: "Test2" },
            ],
        });
    }),
];
