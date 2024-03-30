// -----------------------------------------------------------------------------------------
// #region Components
// -----------------------------------------------------------------------------------------

// TODO: The original purpose for this was to provide a helper routes when using react-router-dom.This needs to be re-implemented in the new project structure.
// export {
//     AuthenticatedRoute,
//     AuthenticatedRouteProps,
// } from "./components/routing/authenticated-route";
// export {
//     NestedRoute,
//     NestedRouteProps,
// } from "./components/routing/nested-route";
// export { NestedRoutes } from "./components/routing/nested-routes";
// export type { NestedRoutesProps } from "./components/routing/nested-routes";
// export { NestedRoutesByProperty } from "./components/routing/nested-routes-by-property";
// export type { NestedRoutesByPropertyProps } from "./components/routing/nested-routes-by-property";
// export { Redirects } from "./components/routing/redirects";
// export type { RedirectsProps } from "./components/routing/redirects";

// #endregion Components

// -----------------------------------------------------------------------------------------
// #region Service Hooks
// -----------------------------------------------------------------------------------------

export { useListService } from "./hooks/service-hooks/use-list";
export { useGetService } from "./hooks/service-hooks/use-get";
export { useCreateService } from "./hooks/service-hooks/use-create";
export { useUpdateService } from "./hooks/service-hooks/use-update";
export { useDeleteService } from "./hooks/service-hooks/use-delete";

// #endregion

// -----------------------------------------------------------------------------------------
// #region Hooks
// -----------------------------------------------------------------------------------------

export { makeCancellable } from "./hooks/make-cancellable";
export { useAsyncEffect } from "./hooks/use-async-effect";
export { useCancellablePromise } from "./hooks/use-cancellable-promise";
export { useDebounce } from "./hooks/use-debounce";
export { useLocalization } from "./hooks/use-localization";
export { useOnClickOutside } from "./hooks/use-onclick-outside";
export { usePageErrors } from "./hooks/use-page-errors";
export { useSortedAlphabetically } from "./hooks/use-sorted-alphabetically";
export { useTextOverflow } from "./hooks/use-text-overflow";
export { useWindow } from "./hooks/use-window";

// #endregion

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

export type { RedirectDefinition } from "./interfaces/redirect-definition";
export type { RouteDefinition } from "./interfaces/route-definition";
export type { RouteMap } from "./interfaces/route-map";
export type { UnmatchedRoute } from "./interfaces/unmatched-route";

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Services
// -----------------------------------------------------------------------------------------

export { ServiceFactory } from "./services/service-factory";
export { ServiceHookFactory } from "./services/service-hook-factory";

// #endregion Services

// -----------------------------------------------------------------------------------------
// #region Types
// -----------------------------------------------------------------------------------------

export type { AsyncEffectCallback } from "./types/async-effect-callback-type";
export type { BulkUpdateService } from "./types/bulk-update-service-type";
export type { BulkUpdateServiceHook } from "./types/bulk-update-service-hook-type";
export type { CreateService } from "./types/create-service-type";
export type { CreateServiceHook } from "./types/create-service-hook-type";
export type { DeleteService } from "./types/delete-service-type";
export type { DeleteServiceHook } from "./types/delete-service-hook-type";
export type { GetService } from "./types/get-service-type";
export type { GetServiceHook } from "./types/get-service-hook-type";
export type { ListService } from "./types/list-service-type";
export type { ListServiceHook } from "./types/list-service-hook-type";
export type { NestedCreateService } from "./types/nested-create-service-type";
export type { NestedCreateServiceHook } from "./types/nested-create-service-hook-type";
export type { NestedListService } from "./types/nested-list-service-type";
export type { NestedListServiceHook } from "./types/nested-list-service-hook-type";
export type { UpdateService } from "./types/update-service-type";
export type { UpdateServiceHook } from "./types/update-service-hook-type";

// #endregion Types

// -----------------------------------------------------------------------------------------
// #region Utilities
// -----------------------------------------------------------------------------------------

export { RouteUtils } from "./utilities/route-utils";

// #endregion Utilities
