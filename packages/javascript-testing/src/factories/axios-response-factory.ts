import type { AxiosResponse } from "axios";
import type { FactoryInitializer } from "./factory-initializer";
import { FactoryType } from "./factory-type";

// -----------------------------------------------------------------------------------------
// #region Factory
// -----------------------------------------------------------------------------------------

const axiosResponseFactoryInitializer: FactoryInitializer = ({ define }) => {
    define<AxiosResponse>(FactoryType.AxiosResponse)
        .sequence("status", () => 200)
        .sequence("statusText", () => "OK")
        .sequence("data", () => ({
            resultObject: {},
            errors: [],
        }));
};

// #endregion Factory

// -----------------------------------------------------------------------------------------
// #region Export
// -----------------------------------------------------------------------------------------

export { axiosResponseFactoryInitializer };

// #endregion Export
