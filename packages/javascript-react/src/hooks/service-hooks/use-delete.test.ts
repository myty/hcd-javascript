import { renderHook, waitFor } from "@testing-library/react";
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

// #endregion Setup

describe("useDeleteService", () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it("should create a delete service hook", () => {
        // Arrange
        const serviceDelete = ServiceFactory.delete(resourceEndpoint);

        // Act
        const { result } = renderHook(() => useDeleteService(serviceDelete));

        // Assert
        expect(result.current.delete).toBeDefined();
    });

    it("should call onDeleted with success when delete is successful", async () => {
        // Arrange
        const serviceDelete = ServiceFactory.delete(resourceEndpoint);
        const onDeleted = jest.fn();
        const id = 1;
        mockDeleteSuccess({ resultObject: true });

        // Act
        const { result } = renderHook(() =>
            useDeleteService(serviceDelete, onDeleted)
        );
        result.current.delete(id);

        // Assert
        waitFor(() =>
            expect(onDeleted).toHaveBeenCalledWith({ id, success: true })
        );
    });

    it("should not call onDeleted when hook is unmounted", async () => {
        // Arrange
        const serviceDelete = ServiceFactory.delete(resourceEndpoint);
        const onDeleted = jest.fn();
        const id = 1;
        const apiTimeout = 100;
        mockDeleteSuccess({ resultObject: true }, apiTimeout);

        // Act
        const { result, unmount } = renderHook(() =>
            useDeleteService(serviceDelete, onDeleted)
        );
        result.current.delete(id);
        unmount();

        // Assert
        waitFor(() => expect(onDeleted).not.toHaveBeenCalled(), {
            timeout: apiTimeout,
        });
    });
});
