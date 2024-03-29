import { Record } from "immutable";
import { ServiceFactory, useListService } from "@rsm-hcd/javascript-react";
import "./App.css";

interface Todo {
    id: number;
    value: string;
}

class TestRecord extends Record<Todo>({
    id: 0,
    value: "",
}) {}

const TodoService = {
    list: ServiceFactory.list(TestRecord, "api/todos"),
};

function App() {
    const { results } = useListService(TodoService.list);

    return (
        <ul>
            {results.map((todo) => (
                <li key={todo.id}>{todo.value}</li>
            ))}
        </ul>
    );
}

export default App;
