import { useListService } from "@rsm-hcd/javascript-react";
import { TodoService } from "./services/todo-service";
import "./App.css";

function App() {
    const { results, refresh } = useListService(TodoService.list);

    return (
        <>
            <button onClick={refresh}>Refresh</button>
            <ul>
                {results.map((todo) => (
                    <li key={todo.id}>{todo.description}</li>
                ))}
            </ul>
        </>
    );
}

export default App;
