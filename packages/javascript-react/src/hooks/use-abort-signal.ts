import { useEffect, useState } from "react";

export function useAbortSignal() {
    const [abortController, setAbortController] = useState(
        new AbortController()
    );

    useEffect(() => {
        return () => {
            setAbortController((abortController) => {
                abortController.abort();
                return new AbortController();
            });
        };
    }, []);

    return abortController.signal;
}
