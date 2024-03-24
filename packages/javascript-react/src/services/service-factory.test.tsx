/* eslint-disable @typescript-eslint/no-empty-interface -- for testing purposes */

import { Factory } from "rosie";
import { useEffect, useState } from "react";
import { render } from "@testing-library/react";
import { CoreUtils } from "@rsm-hcd/javascript-core";
import { StubResourceRecord, FactoryType } from "@rsm-hcd/javascript-testing";
import { delay, http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { Record } from "immutable";
import { CanceledError } from "axios";
import { ServiceFactory } from "./service-factory";

// -----------------------------------------------------------------------------------------
// #region Variables
// -----------------------------------------------------------------------------------------

const endpoint = "tests";
const baseEndpoint = `http://api.local/${endpoint}`;
const cancellationTestsApiDelay = 10;
const cancellationTestsAssertionDelay = 20;
const resourceEndpoint = `${baseEndpoint}/:id`;
const nestedBaseEndpoint = `http://api.local/nested/:nestedId/${endpoint}`;

// #endregion Variables

const {
    server,
    mockGetSuccess,
    mockDeleteSuccess,
    mockPutSuccess,
    mockPostSuccess,
} = (function setupMockAPI() {
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
        delayMs: number
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

    return {
        server: setupServer(
            http.get(baseEndpoint, () => _mockGetResponse()),
            http.get(resourceEndpoint, () => _mockGetResponse()),
            http.get(nestedBaseEndpoint, () => _mockGetResponse()),
            http.post(baseEndpoint, () => _mockPostResponse()),
            http.post(nestedBaseEndpoint, () => _mockPostResponse()),
            http.put(baseEndpoint, () => _mockPutResponse()),
            http.put(resourceEndpoint, () => _mockPutResponse()),
            http.delete(resourceEndpoint, () => _mockDeleteResponse())
        ),
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
})();

// -----------------------------------------------------------------------------------------
// #region Stubs
// -----------------------------------------------------------------------------------------

interface StubNestedParams {
    nestedId: number;
}

interface StubResourceParams {
    id: number;
}

// #endregion Stubs

// -----------------------------------------------------------------------------------------
// #region Functions
// -----------------------------------------------------------------------------------------

// #endregion
const itReturnsFunction = (func: Function, endpoint: string) => {
    it("returns function", () => {
        expect(func(StubResourceRecord, endpoint)).toBeInstanceOf(Function);
    });
};

// #endregion Functions

// -----------------------------------------------------------------------------------------
// #region Tests
// -----------------------------------------------------------------------------------------

describe("ServiceFactory", () => {
    // const consoleErrorSpy = jest.spyOn(console, "error");
    // const consoleWarnSpy = jest.spyOn(console, "warn");

    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        // consoleErrorSpy.mockReset();
        // consoleWarnSpy.mockReset();
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });

    // -------------------------------------------------------------------------------------------------
    // #region bulkUpdate
    // -------------------------------------------------------------------------------------------------

    describe("bulkUpdate", () => {
        itReturnsFunction(ServiceFactory.bulkUpdate, baseEndpoint);

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */

        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const sut = ServiceFactory.bulkUpdate(
                StubResourceRecord,
                resourceEndpoint
            );

            const record = Factory.build<StubResourceRecord>(
                FactoryType.StubResourceRecord,
                { id: 20 }
            );

            mockPutSuccess([record], cancellationTestsApiDelay);

            let isUnmounted = false;

            const BulkUpdateStubComponent = () => {
                const [stubRecords, setStubRecords] = useState<
                    StubResourceRecord[]
                >([]);

                useEffect(() => {
                    async function updateStubRecords() {
                        const result = await sut([record], { id: record.id });
                        setStubRecords(result.resultObjects || []);
                    }

                    updateStubRecords();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return (
                    <div>
                        {stubRecords != null &&
                            stubRecords.length > 0 &&
                            stubRecords[0].name}
                    </div>
                );
            };

            // Act
            const { unmount } = render(<BulkUpdateStubComponent />);
            unmount();

            // Force a sleep longer than when API promise resolves
            await CoreUtils.sleep(cancellationTestsAssertionDelay);

            // Assert
            expect(isUnmounted).toBeTrue();

            // TODO: This is not working as expected. The console.error is not being thrown
            // expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expected = Factory.build<StubResourceRecord>(
                FactoryType.StubResourceRecord,
                { id: 20 }
            );

            const sut = ServiceFactory.bulkUpdate(
                StubResourceRecord,
                baseEndpoint
            );

            mockPutSuccess([expected]);

            // Act
            const response = await sut([expected], { id: expected.id });

            // Assert
            expect(response.resultObjects).not.toBeNull();
            expect(response.resultObjects).toBeInstanceOf(Array);
            expect(response.resultObjects[0].name).toEqual(expected.name);
        });
    });

    // #endregion bulkUpdate

    // -----------------------------------------------------------------------------------------
    // #region create
    // -----------------------------------------------------------------------------------------

    describe("create", () => {
        itReturnsFunction(ServiceFactory.create, baseEndpoint);

        it("given null, throws error", async () => {
            expect.assertions(1);
            try {
                const sut = ServiceFactory.create(
                    StubResourceRecord,
                    baseEndpoint
                );
                await sut(null as any); // <----- passing null
            } catch (e) {
                expect(e).toBeInstanceOf(TypeError);
            }
        });

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */
        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const create = ServiceFactory.create(
                StubResourceRecord,
                baseEndpoint
            );
            const record = Factory.build<StubResourceRecord>(
                FactoryType.StubResourceRecord
            );

            mockPostSuccess(record, cancellationTestsApiDelay);

            let isUnmounted = false;

            const CreateStubComponent = () => {
                const [, setStubRecord] = useState<StubResourceRecord>(
                    null as any
                );

                useEffect(() => {
                    async function createStubRecord() {
                        const result = await create(
                            Factory.build<StubResourceRecord>(
                                FactoryType.StubResourceRecord
                            )
                        );
                        setStubRecord(result.resultObject!);
                    }

                    createStubRecord();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{record?.name}</div>;
            };

            // Act
            const { unmount } = render(<CreateStubComponent />);
            unmount();
            // Force a sleep longer than when API promise resolves
            await CoreUtils.sleep(cancellationTestsAssertionDelay);

            // Assert
            expect(isUnmounted).toBeTrue();

            // TODO: This is not working as expected. The console.error is not being thrown
            // expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expected = Factory.build<StubResourceRecord>(
                FactoryType.StubResourceRecord
            );

            const sut = ServiceFactory.create(StubResourceRecord, baseEndpoint);
            mockPostSuccess(expected);

            // Act
            const response = await sut(expected);

            // Assert
            expect(response.resultObject).not.toBeNull();
            expect(response.resultObject).toBeInstanceOf(StubResourceRecord);
            expect(response.resultObject!.name).toEqual(expected.name);
        });
    });

    // #endregion create

    // -----------------------------------------------------------------------------------------
    // #region delete
    // --------------------------------------------------------------------------------------------

    describe("delete", () => {
        itReturnsFunction(ServiceFactory.delete, baseEndpoint);

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */
        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const sut = ServiceFactory.delete(resourceEndpoint);
            const record = Factory.build<StubResourceRecord>(
                FactoryType.StubResourceRecord,
                {
                    id: 20,
                }
            );

            mockDeleteSuccess(record, cancellationTestsApiDelay);

            let isUnmounted = false;

            const DeleteStubComponent = () => {
                const [deleted, setDeleted] = useState(false);

                useEffect(() => {
                    async function deleteUser() {
                        const result = await sut(record.id);
                        setDeleted((result.resultObject || false) as boolean);
                    }

                    deleteUser();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{deleted && "deleted"}</div>;
            };

            // Act
            const { unmount } = render(<DeleteStubComponent />);
            unmount();
            // Force a sleep longer than when API promise resolves
            await CoreUtils.sleep(cancellationTestsAssertionDelay);

            // Assert
            expect(isUnmounted).toBeTrue();

            // TODO: This is not working as expected. The console.error is not being thrown
            // expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, given empty result, returns response without resultObject", async () => {
            // Arrange
            const sut = ServiceFactory.delete(resourceEndpoint);

            mockDeleteSuccess(undefined);

            // Act
            const response = await sut(10);

            // Assert
            expect(response.resultObject).toBeUndefined();
        });
    });

    // #endregion delete

    // -----------------------------------------------------------------------------------------
    // #region get
    // --------------------------------------------------------------------------------------------

    describe("get", () => {
        itReturnsFunction(ServiceFactory.get, baseEndpoint);

        it("when has value returned, returns response with resultObject", async () => {
            // Arrange
            const sut = ServiceFactory.get<
                StubResourceRecord,
                StubResourceParams
            >(StubResourceRecord, resourceEndpoint);
            const record = Factory.build<StubResourceRecord>(
                FactoryType.StubResourceRecord,
                {
                    id: 20,
                }
            );

            mockGetSuccess(record);

            // Act
            const response = await sut({ id: record.id });

            // Assert
            expect(response.resultObject).not.toBeNull();
            expect(response.resultObject).toBeInstanceOf(StubResourceRecord);
            expect(response.resultObject!.name).toEqual(record.name);
        });

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */
        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const sut = ServiceFactory.get<
                StubResourceRecord,
                StubResourceParams
            >(StubResourceRecord, resourceEndpoint);
            const record = Factory.build<StubResourceRecord>(
                FactoryType.StubResourceRecord,
                {
                    id: 20,
                }
            );

            mockGetSuccess(record, cancellationTestsApiDelay);

            let isUnmounted = false;

            const GetStubComponent = () => {
                const [, setStubRecord] = useState<StubResourceRecord>(
                    null as any
                );

                useEffect(() => {
                    async function getRecord() {
                        const result = await sut({ id: record.id });
                        setStubRecord(result.resultObject!);
                    }

                    getRecord();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{record?.name}</div>;
            };

            // Act
            const { unmount } = render(<GetStubComponent />);
            unmount();
            // Force a sleep longer than when API promise resolves
            await CoreUtils.sleep(cancellationTestsAssertionDelay);

            // Assert
            expect(isUnmounted).toBeTrue();

            // TODO: This is not working as expected. The console.error is not being thrown
            // expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expected = Factory.build<StubResourceRecord>(
                FactoryType.StubResourceRecord,
                {
                    id: 20,
                }
            );

            const sut = ServiceFactory.get<
                StubResourceRecord,
                StubResourceParams
            >(StubResourceRecord, resourceEndpoint);

            mockGetSuccess(expected);

            // Act
            const response = await sut({ id: expected.id });

            // Assert
            expect(response.resultObject).not.toBeNull();
            expect(response.resultObject).toBeInstanceOf(StubResourceRecord);
            expect(response.resultObject!.name).toEqual(expected.name);
        });

        it("when aborted, returns response without resultObject", async () => {
            // Arrange
            const expected = Factory.build<StubResourceRecord>(
                FactoryType.StubResourceRecord,
                { id: 20 }
            );

            const sut = ServiceFactory.get<
                StubResourceRecord,
                StubResourceParams
            >(StubResourceRecord, resourceEndpoint);

            mockGetSuccess(expected, cancellationTestsApiDelay);

            // Act
            const abortController = new AbortController();
            const responsePromise = sut(
                { id: expected.id },
                undefined,
                abortController.signal
            );
            abortController.abort();

            // Assert
            expect.assertions(1);

            try {
                await responsePromise;
            } catch (err) {
                expect(err).toBeInstanceOf(CanceledError);
            }
        });
    });

    // #endregion get

    // -----------------------------------------------------------------------------------------
    // #region list
    // -----------------------------------------------------------------------------------------

    describe("list", () => {
        interface StubListParams {}

        itReturnsFunction(ServiceFactory.list, baseEndpoint);

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */
        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const sut = ServiceFactory.list<
                StubResourceRecord,
                StubResourceParams
            >(StubResourceRecord, baseEndpoint);
            const expectedResults = Factory.buildList(
                FactoryType.StubResourceRecord,
                2
            );

            mockGetSuccess(expectedResults, cancellationTestsApiDelay);

            let isUnmounted = false;

            const ListStubComponent = () => {
                const [records, setRecords] = useState<StubResourceRecord[]>(
                    []
                );

                useEffect(() => {
                    async function listStubRecords() {
                        const result = await sut();
                        setRecords(result.resultObjects);
                    }

                    listStubRecords();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{records?.map((u) => u.name)}</div>;
            };

            // Act
            const { unmount } = render(<ListStubComponent />);
            unmount();
            // Force a sleep longer than when API promise resolves
            await CoreUtils.sleep(cancellationTestsAssertionDelay);

            // Assert
            expect(isUnmounted).toBeTrue();

            // TODO: This is not working as expected. The console.error is not being thrown
            // expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expectedResults: StubResourceRecord[] = Factory.buildList(
                FactoryType.StubResourceRecord,
                2
            );

            const sut = ServiceFactory.list<StubResourceRecord, StubListParams>(
                StubResourceRecord,
                baseEndpoint
            );
            mockGetSuccess(expectedResults);

            // Act
            const response = await sut();

            // Assert
            const resultObjects = response.resultObjects;
            expect(resultObjects).not.toBeNull();
            expect(response.rowCount).toEqual(expectedResults.length);

            for (let i = 0; i < resultObjects.length; i++) {
                const expected = expectedResults[i];
                const resultObject = resultObjects[i];
                expect(resultObject).toBeInstanceOf(StubResourceRecord);
                expect(resultObject.name).toEqual(expected.name);
            }
        });
    });

    // #endregion list

    // -----------------------------------------------------------------------------------------
    // #region nestedCreate
    // -----------------------------------------------------------------------------------------

    describe("nestedCreate", () => {
        itReturnsFunction(ServiceFactory.nestedCreate, nestedBaseEndpoint);

        it("given null, throws error", async () => {
            expect.assertions(1);
            try {
                const sut = ServiceFactory.nestedCreate(
                    StubResourceRecord,
                    baseEndpoint
                );

                await sut(null as any, {}); // <----- passing null
            } catch (e) {
                expect(e).toBeInstanceOf(TypeError);
            }
        });

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */
        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const sut = ServiceFactory.nestedCreate<
                StubResourceRecord,
                StubNestedParams
            >(StubResourceRecord, nestedBaseEndpoint);
            const record = Factory.build<StubResourceRecord>(
                FactoryType.StubResourceRecord,
                {
                    id: 20,
                }
            );

            mockPostSuccess(record, cancellationTestsApiDelay);

            let isUnmounted = false;

            const NestedCreateStubComponent = () => {
                const [stubRecord, setStubRecord] =
                    useState<StubResourceRecord>(null as any);

                useEffect(() => {
                    async function createUser() {
                        const result = await sut(record, { nestedId: 10 });
                        setStubRecord(result.resultObject!);
                    }

                    createUser();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{stubRecord?.name}</div>;
            };

            // Act
            const { unmount } = render(<NestedCreateStubComponent />);
            unmount();
            // Force a sleep longer than when API promise resolves
            await CoreUtils.sleep(cancellationTestsAssertionDelay);

            // Assert
            expect(isUnmounted).toBeTrue();

            // TODO: This is not working as expected. The console.error is not being thrown
            // expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expected = Factory.build<StubResourceRecord>(
                FactoryType.StubResourceRecord
            );

            const sut = ServiceFactory.nestedCreate<
                StubResourceRecord,
                StubNestedParams
            >(StubResourceRecord, nestedBaseEndpoint);

            mockPostSuccess(expected);

            // Act
            const response = await sut(expected, { nestedId: 40 });

            // Assert
            expect(response.resultObject).not.toBeNull();
            expect(response.resultObject).toBeInstanceOf(StubResourceRecord);
            expect(response.resultObject!.name).toEqual(expected.name);
        });
    });

    // #endregion nestedCreate

    // -----------------------------------------------------------------------------------------
    // #region nestedList
    // -----------------------------------------------------------------------------------------

    describe("nestedList", () => {
        interface StubListQueryParams {}

        itReturnsFunction(ServiceFactory.nestedList, nestedBaseEndpoint);

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */
        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const sut = ServiceFactory.nestedList<
                StubResourceRecord,
                StubNestedParams,
                StubListQueryParams
            >(StubResourceRecord, nestedBaseEndpoint);
            const expectedResults: StubResourceRecord[] = Factory.buildList(
                FactoryType.StubResourceRecord,
                2
            );

            mockGetSuccess(expectedResults, cancellationTestsApiDelay);

            let isUnmounted = false;

            const NestedListStubComponent = () => {
                const [records, setRecords] = useState<StubResourceRecord[]>(
                    []
                );

                useEffect(() => {
                    async function listStubRecords() {
                        const result = await sut({ nestedId: 20 });
                        setRecords(result.resultObjects);
                    }

                    listStubRecords();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{records?.map((u) => u.name)}</div>;
            };

            // Act
            const { unmount } = render(<NestedListStubComponent />);
            unmount();
            // Force a sleep longer than when API promise resolves
            await CoreUtils.sleep(cancellationTestsAssertionDelay);

            // Assert
            expect(isUnmounted).toBeTrue();

            // TODO: This is not working as expected. The console.error is not being thrown
            // expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expectedResults: StubResourceRecord[] = Factory.buildList(
                FactoryType.StubResourceRecord,
                2
            );

            const sut = ServiceFactory.nestedList<
                StubResourceRecord,
                StubNestedParams,
                StubListQueryParams
            >(StubResourceRecord, nestedBaseEndpoint);

            mockGetSuccess(expectedResults);

            // Act
            const response = await sut({ nestedId: 40 });

            // Assert
            const resultObjects = response.resultObjects;
            expect(resultObjects).not.toBeNull();
            expect(response.rowCount).toEqual(expectedResults.length);

            for (let i = 0; i < resultObjects.length; i++) {
                const expected = expectedResults[i];
                const resultObject = resultObjects[i];
                expect(resultObject).toBeInstanceOf(StubResourceRecord);
                expect(resultObject.name).toEqual(expected.name);
            }
        });
    });

    // #endregion nestedList

    // -----------------------------------------------------------------------------------------
    // #region update
    // -----------------------------------------------------------------------------------------

    describe("update", () => {
        itReturnsFunction(ServiceFactory.update, baseEndpoint);

        /**
         * Test ensures service factory in fact causes a react console.error to throw
         * when the react component unmounts before the promise resolves.
         *
         * See ServiceHookFactory.test.tsx for test that verifies cancellation works
         */

        it("when unmounted before resolution, promise isn't cancelled and error thrown", async () => {
            // Arrange
            const sut = ServiceFactory.update(
                StubResourceRecord,
                resourceEndpoint
            );
            const record = Factory.build<StubResourceRecord>(
                FactoryType.StubResourceRecord,
                {
                    id: 20,
                }
            );

            mockPutSuccess(record, cancellationTestsApiDelay);

            let isUnmounted = false;

            const UpdateStubComponent = () => {
                const [stubRecord, setStubRecord] =
                    useState<StubResourceRecord>(null as any);

                useEffect(() => {
                    async function updateUser() {
                        const result = await sut(record);
                        setStubRecord(result.resultObject!);
                    }

                    updateUser();

                    return () => {
                        isUnmounted = true;
                    };
                }, []);

                return <div>{stubRecord?.name}</div>;
            };

            // Act
            const { unmount } = render(<UpdateStubComponent />);
            unmount();
            // Force a sleep longer than when API promise resolves
            await CoreUtils.sleep(cancellationTestsAssertionDelay);

            // Assert
            expect(isUnmounted).toBeTrue();

            // TODO: This is not working as expected. The console.error is not being thrown
            // expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it("when successful, returns response mapped to supplied TRecord", async () => {
            // Arrange
            const expected = Factory.build<StubResourceRecord>(
                FactoryType.StubResourceRecord,
                {
                    id: 20,
                }
            );

            const sut = ServiceFactory.update(StubResourceRecord, baseEndpoint);
            mockPutSuccess(expected);

            // Act
            const response = await sut(expected);

            // Assert
            expect(response.resultObject).not.toBeNull();
            expect(response.resultObject).toBeInstanceOf(StubResourceRecord);
            expect(response.resultObject!.name).toEqual(expected.name);
        });
    });

    // #endregion update
});

// #endregion Tests
