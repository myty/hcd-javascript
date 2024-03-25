import { Record } from "immutable";
import { delay, HttpResponse, http } from "msw";
import { setupServer } from "msw/node";

interface SetupMockAPIOptions {
    baseEndpoint: string;
    resourceEndpoint?: string;
    nestedBaseEndpoint?: string;
}

export function setupMockAPI({
    baseEndpoint,
    resourceEndpoint,
    nestedBaseEndpoint,
}: SetupMockAPIOptions) {
    let _mockGetResponse: () => Promise<any> = () => Promise.resolve();
    let _mockPutResponse: () => Promise<any> = () => Promise.resolve();
    let _mockPostResponse: () => Promise<any> = () => Promise.resolve();
    let _mockDeleteResponse: () => Promise<any> = () => Promise.resolve();

    const _resultObjectToJS = (resultObject: any | any[]): any | any[] => {
        if (resultObject == null) {
            return resultObject;
        }

        if (resultObject instanceof Array) {
            return resultObject.map((r) => r.toJS());
        }

        if (Record.isRecord(resultObject)) {
            return resultObject.toJS();
        }

        return resultObject;
    };

    const _createResponseResolver = (
        resultObject: any | any[],
        delayMs = 0
    ) => {
        return async () => {
            await delay(delayMs);
            return HttpResponse.json({
                resultObject: _resultObjectToJS(resultObject),
            });
        };
    };

    const _createSuccessMock = (
        responseCallback: (response: () => Promise<any>) => void
    ) => {
        return (resultObject: any | any[], delayMs = 0) => {
            const resolver = _createResponseResolver(resultObject, delayMs);
            responseCallback(resolver);
        };
    };

    const resourceEndpointHandlers = () => {
        if (resourceEndpoint == null) {
            return [];
        }

        return [
            http.get(resourceEndpoint, () => _mockGetResponse()),
            http.put(resourceEndpoint, () => _mockPutResponse()),
            http.delete(resourceEndpoint, () => _mockDeleteResponse()),
        ];
    };

    const nestedEndpointHandlers = () => {
        if (nestedBaseEndpoint == null) {
            return [];
        }

        return [
            http.get(nestedBaseEndpoint, () => _mockGetResponse()),
            http.post(nestedBaseEndpoint, () => _mockPostResponse()),
        ];
    };

    const handlers = [
        http.get(baseEndpoint, () => _mockGetResponse()),
        http.post(baseEndpoint, () => _mockPostResponse()),
        http.put(baseEndpoint, () => _mockPutResponse()),
        ...resourceEndpointHandlers(),
        ...nestedEndpointHandlers(),
    ];

    return {
        server: setupServer(...handlers),
        mockGetSuccess: _createSuccessMock((response) => {
            _mockGetResponse = response;
        }),
        mockDeleteSuccess: _createSuccessMock((response) => {
            _mockDeleteResponse = response;
        }),
        mockPutSuccess: _createSuccessMock((response) => {
            _mockPutResponse = response;
        }),
        mockPostSuccess: _createSuccessMock((response) => {
            _mockPostResponse = response;
        }),
    };
}
