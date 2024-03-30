import { renderHook, waitFor } from "@testing-library/react";
import { Record } from "immutable";
import { ServiceFactory } from "../../services/service-factory";
import { setupMockAPI } from "../../tests/setup-mock-api";
import { useGetService } from "./use-get";

// ---------------------------------------------------------------------------------------------
// #region Setup
// ---------------------------------------------------------------------------------------------

const endpoint = "records";
const baseEndpoint = `http://api.local/${endpoint}`;
const resourceEndpoint = `http://api.local/${endpoint}/:id`;

const { server, mockGetSuccess } = setupMockAPI({
    baseEndpoint,
    resourceEndpoint,
});

class TestRecord extends Record<{ id: number; value: string }>({
    id: 0,
    value: "",
}) {}

const TestService = {
    get: ServiceFactory.get(TestRecord, resourceEndpoint),
};

// #endregion Setup

describe("useGetService", () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    describe("initial state", () => {
        it("should create a get service hook", () => {
            // Arrange & Act
            const { result } = renderHook(() =>
                useGetService(TestService.get, { pathParams: { id: 0 } })
            );

            // Assert
            expect(result.current.result).toBeUndefined();
        });

        it("should have a loading state", () => {
            // Arrange & Act
            const { result } = renderHook(() =>
                useGetService(TestService.get, { pathParams: { id: 0 } })
            );

            // Assert
            expect(result.current.isLoading).toBe(true);
        });

        it("should not have an error", () => {
            // Arrange & Act
            const { result } = renderHook(() =>
                useGetService(TestService.get, { pathParams: { id: 0 } })
            );

            // Assert
            expect(result.current.error).toBeUndefined();
        });
    });

    describe("when get service is successful", () => {
        let record: TestRecord;

        beforeAll(() => {
            record = new TestRecord({ id: 1, value: "test" });
            mockGetSuccess(record, 200);
        });

        it("should set results", async () => {
            // Arrange & Act
            const { result } = renderHook(() =>
                useGetService(TestService.get, {
                    pathParams: { id: record.id },
                })
            );

            // Assert
            await waitFor(() => {
                expect(result.current.result).toStrictEqual(record);
            });
        });

        it("should have a false loading state", async () => {
            // Arrange & Act
            const { result } = renderHook(() =>
                useGetService(TestService.get, {
                    pathParams: { id: record.id },
                })
            );

            // Assert
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });
        });
    });
});
