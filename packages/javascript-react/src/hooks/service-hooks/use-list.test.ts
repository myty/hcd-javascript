import { renderHook, waitFor } from "@testing-library/react";
import { Record } from "immutable";
import { ServiceFactory } from "../../services/service-factory";
import { setupMockAPI } from "../../tests/setup-mock-api";
import { useListService } from "./use-list";

// ---------------------------------------------------------------------------------------------
// #region Setup
// ---------------------------------------------------------------------------------------------

const endpoint = "records";
const baseEndpoint = `http://api.local/${endpoint}`;

const { server, mockGetSuccess } = setupMockAPI({
    baseEndpoint,
});

class TestRecord extends Record<{ id: number; value: string }>({
    id: 0,
    value: "",
}) {}

const TestService = {
    list: ServiceFactory.list(TestRecord, baseEndpoint),
};

// #endregion Setup

describe("useListService", () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    describe("initial state", () => {
        it("should create a list service hook", () => {
            // Arrange & Act
            const { result } = renderHook(() =>
                useListService(TestService.list)
            );

            // Assert
            expect(result.current.results).toBeDefined();
        });

        it("should have an empty list of results", () => {
            // Arrange & Act
            const { result } = renderHook(() =>
                useListService(TestService.list)
            );

            // Assert
            expect(result.current.results).toHaveLength(0);
        });

        it("should have a loading state", () => {
            // Arrange & Act
            const { result } = renderHook(() =>
                useListService(TestService.list)
            );

            // Assert
            expect(result.current.isLoading).toBe(true);
        });

        it("should not have an error", () => {
            // Arrange & Act
            const { result } = renderHook(() =>
                useListService(TestService.list)
            );

            // Assert
            expect(result.current.error).toBeUndefined();
        });
    });

    describe("when list service is successful", () => {
        let records: TestRecord[] = [];

        beforeAll(() => {
            records = [new TestRecord({ id: 1, value: "test" })];
            mockGetSuccess(records, 200);
        });

        it("should set results", async () => {
            // Arrange & Act
            const { result } = renderHook(() =>
                useListService(TestService.list)
            );

            // Assert
            await waitFor(() => {
                expect(result.current.results).toStrictEqual(records);
            });
        });

        it("should have a false loading state", async () => {
            // Arrange & Act
            const { result } = renderHook(() =>
                useListService(TestService.list)
            );

            // Assert
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });
        });
    });
});
