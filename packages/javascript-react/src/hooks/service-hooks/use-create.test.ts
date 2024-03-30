import { act, renderHook, waitFor } from "@testing-library/react";
import { Record } from "immutable";
import { ServiceFactory } from "../../services/service-factory";
import { setupMockAPI } from "../../tests/setup-mock-api";
import { useCreateService } from "./use-create";

// ---------------------------------------------------------------------------------------------
// #region Setup
// ---------------------------------------------------------------------------------------------

const endpoint = "records";
const baseEndpoint = `http://api.local/${endpoint}`;

const { server, mockPostSuccess } = setupMockAPI({
    baseEndpoint,
});

class TestRecord extends Record<{ id: number; value: string }>({
    id: 0,
    value: "",
}) {}

const TestService = {
    create: ServiceFactory.create(TestRecord, baseEndpoint),
};

// #endregion Setup

describe("useCreateService", () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it("should create a create service hook", () => {
        // Arrange & Act
        const { result } = renderHook(() =>
            useCreateService(TestService.create)
        );

        // Assert
        expect(result.current.create).toBeDefined();
    });

    it("should have a creating state", () => {
        // Arrange & Act
        const { result } = renderHook(() =>
            useCreateService(TestService.create)
        );

        // Assert
        expect(result.current.isCreating).toBe(false);
    });

    it("should not have an error", () => {
        // Arrange & Act
        const { result } = renderHook(() =>
            useCreateService(TestService.create)
        );

        // Assert
        expect(result.current.error).toBeUndefined();
    });

    describe("create", () => {
        it("should create a record", async () => {
            // Arrange
            const record = new TestRecord({ id: 1, value: "test" });
            mockPostSuccess(record, 100);

            const { result } = renderHook(() =>
                useCreateService(TestService.create)
            );

            // Act
            act(() => {
                result.current.create(record);
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isCreating).toBe(true);
            });

            await waitFor(() => {
                expect(result.current.isCreating).toBe(false);
                expect(result.current.error).toBeUndefined();
                expect(result.current.created).toEqual([record]);
            });
        });

        describe("when unmounted", () => {
            it("should not set state", async () => {
                // Arrange
                const record = new TestRecord({ id: 1, value: "test" });
                mockPostSuccess(record, 100);

                const { result, unmount } = renderHook(() =>
                    useCreateService(TestService.create)
                );

                // Act
                act(() => {
                    result.current.create(record);
                    unmount();
                });

                // Assert
                await waitFor(() => {
                    expect(result.current.isCreating).toBe(false);
                    expect(result.current.error).toBeUndefined();
                    expect(result.current.created).toEqual([]);
                });
            });
        });
    });
});
