import { renderHook } from "@testing-library/react";
import { useAbortSignal } from "./use-abort-signal";

describe("useAbortSignal", () => {
    it("should return an AbortSignal", () => {
        const { result } = renderHook(() => useAbortSignal());
        expect(result.current).toBeInstanceOf(AbortSignal);
    });

    it("should return same AbortSignal on each render", () => {
        const { result, rerender } = renderHook(() => useAbortSignal());
        const signal1 = result.current;

        rerender();
        const signal2 = result.current;

        expect(signal1).toBe(signal2);
    });

    it("should return an unaborted AbortSignal before unmount", () => {
        const { result } = renderHook(() => useAbortSignal());
        const signal = result.current;

        expect(signal.aborted).toBeFalse();
    });

    it("should return an aborted AbortSignal after unmount", () => {
        const { result, unmount } = renderHook(() => useAbortSignal());
        unmount();
        const signal = result.current;

        expect(signal.aborted).toBeTrue();
    });
});
