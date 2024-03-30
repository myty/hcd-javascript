import {
    useListService,
    useCreateService,
    useUpdateService,
    useDeleteService,
} from "@rsm-hcd/javascript-react";
import { TodoService } from "./services/todo-service";
import { TestRecord } from "./models/todo";
import { useMemo } from "react";
import "./App.css";

function App() {
    const { refresh, results } = useListService(TodoService.list);
    const { create, created } = useCreateService(TodoService.create);
    const { update, updated } = useUpdateService(TodoService.update);
    const { delete: remove, deleted } = useDeleteService(TodoService.delete);

    const fullResults = useMemo(() => {
        const mergedResults = [
            ...results,
            ...created.filter(
                (created) => !results.some((result) => result.id === created.id)
            ),
        ];

        return mergedResults
            .filter((result) => !deleted.some((d) => d === result.id))
            .map(
                (result) =>
                    updated.find((updated) => updated.id === result.id) ??
                    result
            );
    }, [created, deleted, results, updated]);

    const handleAdd = () => {
        create(new TestRecord({ description: "New todo" }));
    };

    const handleCompleted = (record: TestRecord) => () => {
        update(record.with({ completed: !record.completed }));
    };

    const handleRemove = (record: TestRecord) => () => {
        remove(record.id);
    };

    return (
        <>
            <button onClick={refresh}>Refresh</button>
            <button onClick={handleAdd}>Add</button>
            <div>Refreshed at: {new Date().toLocaleString()}</div>
            <ul>
                {fullResults.map((todo) => (
                    <li key={todo.id}>
                        <div
                            onClick={handleCompleted(todo)}
                            style={{ display: "inline-block" }}>
                            {todo.id} - {todo.description}
                            {todo.completed ? "(Completed)" : ""}
                        </div>
                        <button
                            onClick={handleRemove(todo)}
                            style={{ display: "inline-block" }}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default App;
