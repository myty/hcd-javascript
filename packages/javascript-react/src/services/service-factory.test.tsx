/* eslint-disable @typescript-eslint/no-empty-interface -- for testing purposes */

import { Factory } from "rosie";
import { StubResourceRecord, FactoryType } from "@rsm-hcd/javascript-testing";
import { CanceledError } from "axios";
import { setupMockAPI } from "../tests/setup-mock-api";
import { ServiceFactory } from "./service-factory";

// -----------------------------------------------------------------------------------------
// #region Variables
// -----------------------------------------------------------------------------------------

const endpoint = "tests";
const baseEndpoint = `http://api.local/${endpoint}`;
const apiDelay = 10;
const resourceEndpoint = `${baseEndpoint}/:id`;
const nestedBaseEndpoint = `http://api.local/nested/:nestedId/${endpoint}`;

// #endregion Variables

// -----------------------------------------------------------------------------------------
// #region Stubs
// -----------------------------------------------------------------------------------------

const {
    server,
    mockGetSuccess,
    mockDeleteSuccess,
    mockPutSuccess,
    mockPostSuccess,
} = setupMockAPI({
    baseEndpoint,
    resourceEndpoint,
    nestedBaseEndpoint,
});

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
    beforeAll(() => {
        server.listen();
    });
    afterEach(() => {
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

            mockGetSuccess(expected, apiDelay);

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
