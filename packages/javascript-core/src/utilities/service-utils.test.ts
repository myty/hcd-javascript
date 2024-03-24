import { Factory } from "rosie";
import type { AxiosResponse } from "axios";
import {
    FactoryType as JavascriptTestingFactoryType,
    StubResourceRecord,
    TestUtils,
} from "@rsm-hcd/javascript-testing";
import axios from "axios";
import { FactoryType } from "../tests/factories/factory-type";
import { ResultRecord } from "../view-models/result-record";
import { ServiceUtils } from "./service-utils";
import { LocalizationUtils } from "./localization-utils";

describe("ServiceUtils", () => {
    // -----------------------------------------------------------------------------------------
    // #region configure
    // -----------------------------------------------------------------------------------------

    describe("configure", () => {
        test.each`
            invalidCultureCode
            ${null}
            ${undefined}
            ${""}
            ${" "}
        `(
            "when supplied cultureCode is $invalidCultureCode, configures baseUrl with default culture code",
            ({ invalidCultureCode }) => {
                // Arrange
                const expected =
                    LocalizationUtils.defaultCultureCode().toLowerCase();

                // Act
                ServiceUtils.configure(invalidCultureCode);

                // Assert
                expect(axios.defaults.baseURL).toContain(expected);
            }
        );

        test("when cultureCode set, configures baseUrl with provided value", () => {
            // Arrange
            const expected = TestUtils.faker.word.sample({ length: 5 });

            // Act
            ServiceUtils.configure(expected);

            // Assert
            expect(axios.defaults.baseURL).toContain(expected.toLowerCase());
        });

        test("when API response handlers set, configures axio response interceptors", () => {
            // Arrange
            const expectedErrorHandler = (): any => {};
            const expectedSuccessHandler = (): any => {};
            const interceptorSpy = jest.spyOn(
                axios.interceptors.response,
                "use"
            );

            // Act
            ServiceUtils.configure(
                TestUtils.faker.word.sample({ length: 5 }),
                expectedErrorHandler,
                expectedSuccessHandler
            );

            // Assert
            expect(interceptorSpy).toHaveBeenCalledWith(
                expectedSuccessHandler,
                expectedErrorHandler
            );
        });
    });

    // #endregion configure

    // -----------------------------------------------------------------------------------------
    // #region configureCultureCode
    // -----------------------------------------------------------------------------------------

    describe("configureCultureCode", () => {
        test.each`
            cultureCode
            ${null}
            ${undefined}
            ${""}
            ${" "}
        `(
            "when cultureCode of $cultureCode, configures baseUrl with default culture code",
            ({ cultureCode }) => {
                // Arrange
                const expected =
                    LocalizationUtils.defaultCultureCode().toLowerCase();

                // Act
                ServiceUtils.configureCultureCode(cultureCode);

                // Assert
                expect(axios.defaults.baseURL).toContain(expected);
            }
        );

        test("when cultureCode set, configures baseUrl with provided value", () => {
            // Arrange
            const expected = TestUtils.faker.word.sample({ length: 5 });

            // Act
            ServiceUtils.configureCultureCode(expected);

            // Assert
            expect(axios.defaults.baseURL).toContain(expected.toLowerCase());
        });
    });

    // #endregion configureCultureCode

    // -----------------------------------------------------------------------------------------
    // #region mapAxiosResponse
    // -----------------------------------------------------------------------------------------

    describe("mapAxiosResponse", () => {
        test("when axiosResponse is undefined, it returns null", () => {
            // Arrange & Act
            const result = ServiceUtils.mapAxiosResponse(
                StubResourceRecord,
                undefined
            );

            // Assert
            expect(result).toBeNull();
        });

        test("when axiosResponse is null, it returns null", () => {
            // Arrange & Act
            const result = ServiceUtils.mapAxiosResponse(
                StubResourceRecord,
                null
            );

            // Assert
            expect(result).toBeNull();
        });

        test("when response.data is undefined, it returns the mapped resultObject as undefined", () => {
            // Arrange
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                { data: undefined }
            );

            // Act
            const result = ServiceUtils.mapAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.resultObject).toBeUndefined();
        });

        test("when response.data is null, it returns the mapped resultObject as undefined", () => {
            // Arrange
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                { data: null }
            );

            // Act
            const result = ServiceUtils.mapAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.resultObject).toBeUndefined();
        });

        test("when response.data.resultObject is undefined, it returns the mapped resultObject as undefined", () => {
            // Arrange
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                {
                    data: {
                        resultObject: undefined,
                    },
                }
            );

            // Act
            const result = ServiceUtils.mapAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.resultObject).toBeUndefined();
        });

        test("when response.data.resultObject is null, it returns the mapped resultObject as undefined", () => {
            // Arrange
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                {
                    data: {
                        resultObject: null,
                    },
                }
            );

            // Act
            const result = ServiceUtils.mapAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.resultObject).toBeUndefined();
        });

        test("when response.data.resultObject is not null, it wraps the result object in a record.", () => {
            // Arrange
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                {
                    data: {
                        resultObject: {
                            test: 1, // <--- Intentionally not stubbing the object with record properties to ensure they're added by mapAxiosResponse
                        },
                    },
                }
            );

            // Act
            const result = ServiceUtils.mapAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.resultObject).toBeInstanceOf(StubResourceRecord);
        });

        test("it returns rowCount as 1", () => {
            // Arrange
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse
            );

            // Act
            const result = ServiceUtils.mapAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.rowCount).toBe(1);
        });

        test("it returns the mapped status from the original response", () => {
            // Arrange
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse
            );

            // Act
            const result = ServiceUtils.mapAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.status).toBe(axiosResponse.status);
        });

        test("it returns result as a ResultRecord", () => {
            // Arrange
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse
            );

            // Act
            const result = ServiceUtils.mapAxiosResponse(
                ResultRecord,
                axiosResponse
            );

            // Assert
            expect(result.resultObject).toBeInstanceOf(ResultRecord);
        });
    });

    // #endregion mapAxiosResponse

    // -----------------------------------------------------------------------------------------
    // #region mapPagedAxiosResponse
    // -----------------------------------------------------------------------------------------

    describe("mapPagedAxiosResponse", () => {
        test("when resultObject is empty array, it properly maps an empty array to resultObjects", () => {
            // Arrange
            const response = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                {
                    data: {
                        resultObject: [],
                        rowCount: 0,
                    },
                }
            );

            // Act
            const result = ServiceUtils.mapPagedAxiosResponse(
                StubResourceRecord,
                response
            );

            // Assert
            expect(result.resultObjects).not.toBeNil();
            expect(result.resultObjects).toBeArray();
            expect(result.resultObjects).toHaveLength(0);
        });

        test("when axiosResponse is undefined, it returns null", () => {
            // Arrange & Act
            const result = ServiceUtils.mapPagedAxiosResponse(
                StubResourceRecord,
                undefined
            );

            // Assert
            expect(result).toBeNull();
        });

        test("when axiosResponse is null, it returns null", () => {
            // Arrange & Act
            const result = ServiceUtils.mapPagedAxiosResponse(
                StubResourceRecord,
                null
            );

            // Assert
            expect(result).toBeNull();
        });

        test("when response.data is undefined, it returns the mapped resultObjects as empty array", () => {
            // Arrange
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                { data: undefined }
            );

            // Act
            const result = ServiceUtils.mapPagedAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.resultObjects).toBeArrayOfSize(0);
        });

        test("when response.data is null, it returns the mapped resultObjects as empty array", () => {
            // Arrange
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                { data: null }
            );

            // Act
            const result = ServiceUtils.mapPagedAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.resultObjects).toBeArrayOfSize(0);
        });

        test("when response.data.resultObject is undefined, it returns the mapped resultObjects as empty array", () => {
            // Arrange
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                {
                    data: {
                        resultObject: undefined,
                    },
                }
            );

            // Act
            const result = ServiceUtils.mapPagedAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.resultObjects).toBeArrayOfSize(0);
        });

        test("when response.data.resultObject is null, it returns the mapped resultObjects as empty array", () => {
            // Arrange
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                {
                    data: {
                        resultObject: null,
                    },
                }
            );

            // Act
            const result = ServiceUtils.mapPagedAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.resultObjects).toBeArrayOfSize(0);
        });

        test("when response.data.rowCount is undefined, it returns rowCount equal to the resultObject list length", () => {
            // Arrange
            const resultObject: StubResourceRecord[] = Factory.buildList(
                FactoryType.StubResourceRecord,
                2
            );
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                {
                    data: {
                        resultObject,
                        rowCount: undefined, // This is the important setup
                    },
                }
            );

            // Act
            const result = ServiceUtils.mapPagedAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.rowCount).toBe(resultObject.length);
        });

        test("when response.data.rowCount is null, it returns rowCount equal to the resultObject list length", () => {
            // Arrange
            const resultObject: StubResourceRecord[] = Factory.buildList(
                FactoryType.StubResourceRecord,
                2
            );
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                {
                    data: {
                        resultObject,
                        rowCount: null, // This is the important setup
                    },
                }
            );

            // Act
            const result = ServiceUtils.mapPagedAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.rowCount).toBe(resultObject.length);
        });

        test("when response.data.rowCount has a value, it returns the mapped rowCount from the original response", () => {
            // Arrange
            const resultObject: StubResourceRecord[] = Factory.buildList(
                FactoryType.StubResourceRecord,
                2
            );
            const rowCount = TestUtils.faker.number.int({
                min: resultObject.length + 1,
            }); // This is the important setup (should be different from resultObject.length)
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                {
                    data: {
                        resultObject,
                        rowCount,
                    },
                }
            );

            // Act
            const result = ServiceUtils.mapPagedAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.rowCount).toBe(rowCount);
        });

        test("it returns the mapped status from the original response", () => {
            // Arrange
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                { data: { resultObject: [{}, {}] } }
            );

            // Act
            const result = ServiceUtils.mapPagedAxiosResponse(
                StubResourceRecord,
                axiosResponse
            );

            // Assert
            expect(result.status).toBe(axiosResponse.status);
        });

        test("it returns results as a ResultRecord", () => {
            // Arrange
            const axiosResponse = Factory.build<AxiosResponse>(
                JavascriptTestingFactoryType.AxiosResponse,
                { data: { resultObject: [{}, {}] } }
            );

            // Act
            const result = ServiceUtils.mapPagedAxiosResponse(
                ResultRecord,
                axiosResponse
            );

            // Assert
            expect(result.results).toBeInstanceOf(ResultRecord);
        });
    });

    // #endregion mapPagedAxiosResponse
});
