import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { ServiceFactory } from "../../services/service-factory";
import { setupMockAPI } from "../../tests/setup-mock-api";
import { useDeleteService } from "./use-delete";

// ---------------------------------------------------------------------------------------------
// #region Setup
// ---------------------------------------------------------------------------------------------

const endpoint = "records";
const baseEndpoint = `http://api.local/${endpoint}`;
const resourceEndpoint = `${baseEndpoint}/:id`;

const { server, mockDeleteSuccess } = setupMockAPI({
    baseEndpoint,
    resourceEndpoint,
});

const TestService = {
    delete: ServiceFactory.delete(resourceEndpoint),
};

// #endregion Setup

describe("useDeleteService", () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it("should create a delete service hook", () => {
        // Arrange & Act
        const { result } = renderHook(() =>
            useDeleteService(TestService.delete)
        );

        // Assert
        expect(result.current.delete).toBeDefined();
    });

    it("should update deleted when delete is successful", async () => {
        // Arrange
        const id = 1;
        mockDeleteSuccess(true);
        const { result } = renderHook(() =>
            useDeleteService(TestService.delete)
        );

        // Act
        act(() => {
            result.current.delete(id);
        });

        // Assert
        await waitFor(() => {
            expect(result.current.deleted.length).toBe(1);
        });
    });

    it("should not update deleted when hook is unmounted", async () => {
        // Arrange
        const id = 1;
        const apiTimeout = 100;
        mockDeleteSuccess(true, apiTimeout);
        const { result, unmount } = renderHook(() =>
            useDeleteService(TestService.delete)
        );

        // Act
        act(() => {
            result.current.delete(id);
        });
        act(() => {
            unmount();
        });

        // Assert
        await waitFor(() => expect(result.current.deleted.length).not.toBe(1), {
            timeout: apiTimeout,
        });
    });
});
