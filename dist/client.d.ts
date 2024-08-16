import * as _sinclair_typebox from '@sinclair/typebox';
import * as _sinclair_typebox_value from '@sinclair/typebox/value';

declare function createClient<S extends Schema, F extends typeof globalThis.fetch>(options: {
    schema: S;
    baseUrl: string;
    fetch?: F;
    getRequestContentType?: FunctionRequestContentType;
    queryParser?: FunctionQueryParser;
    bodyParser?: FunctionBodyParser;
    preValidation?: FunctionPreValidation;
    argsValidator?: FunctionValidationArgs;
}): {
    fetch: <Path extends keyof S, Method extends keyof { [Path_1 in keyof S]: { [Method_1 in keyof S[Path_1]]: {
        args: Static<S[Path_1][Method_1]["args"]>;
        data?: Static<S[Path_1][Method_1]["data"]>;
        error?: Static<S[Path_1][Method_1]["error"]>;
    }; }; }[Path]>(req: {
        path: Path;
        method: Method;
    } & ({ [Path_1 in keyof S]: { [Method_1 in keyof S[Path_1]]: {
        args: Static<S[Path_1][Method_1]["args"]>;
        data?: Static<S[Path_1][Method_1]["data"]>;
        error?: Static<S[Path_1][Method_1]["error"]>;
    }; }; }[Path][Method]["args"] extends void ? {} : Pick<{ [Path_1 in keyof S]: { [Method_1 in keyof S[Path_1]]: {
        args: Static<S[Path_1][Method_1]["args"]>;
        data?: Static<S[Path_1][Method_1]["data"]>;
        error?: Static<S[Path_1][Method_1]["error"]>;
    }; }; }[Path][Method], "args">) & Omit<RequestInit, "body" | "method">) => Promise<Pick<Pick<{ [Path_1 in keyof S]: { [Method_1 in keyof S[Path_1]]: {
        args: Static<S[Path_1][Method_1]["args"]>;
        data?: Static<S[Path_1][Method_1]["data"]>;
        error?: Static<S[Path_1][Method_1]["error"]>;
    }; }; }[Path][Method], "data" | "error">, "data" | "error"> & {
        clientError?: FetchClientErrorType;
        res?: Response;
    }>;
    bind: /**
     * Create a fetch endpoint function based on the `schema` provided.
     * @template {keyof Paths} Path
     * @template {keyof Paths[Path]} Method
     * @overload
     * @param {{ path: Path, method: Method } & FetchInit} endpoint
     * @returns {Paths[Path][Method]['args'] extends void ?
     *  (fetchInit?: FetchInit) => Promise<Response<SchemaResponse<Path, Method>>> :
     *  (args: Paths[Path][Method]['args'], fetchInit?: FetchInit) => Promise<Response<SchemaResponse<Path, Method>>>
     * }
     */
    <Path extends keyof S, Method_1 extends keyof { [Path_1 in keyof S]: { [Method_1 in keyof S[Path_1]]: {
        args: Static<S[Path_1][Method_1]["args"]>;
        data?: Static<S[Path_1][Method_1]["data"]>;
        error?: Static<S[Path_1][Method_1]["error"]>;
    }; }; }[Path]>(endpoint: {
        path: Path;
        method: Method_1;
    } & Omit<RequestInit, "body" | "method">) => { [Path_1 in keyof S]: { [Method_1 in keyof S[Path_1]]: {
        args: Static<S[Path_1][Method_1]["args"]>;
        data?: Static<S[Path_1][Method_1]["data"]>;
        error?: Static<S[Path_1][Method_1]["error"]>;
    }; }; }[Path][Method_1]["args"] extends void ? (fetchInit?: Omit<RequestInit, "body" | "method">) => Promise<Pick<Pick<{ [Path_1 in keyof S]: { [Method_1 in keyof S[Path_1]]: {
        args: Static<S[Path_1][Method_1]["args"]>;
        data?: Static<S[Path_1][Method_1]["data"]>;
        error?: Static<S[Path_1][Method_1]["error"]>;
    }; }; }[Path][Method_1], "data" | "error">, "data" | "error"> & {
        clientError?: FetchClientErrorType;
        res?: Response;
    }> : (args: { [Path_1 in keyof S]: { [Method_1 in keyof S[Path_1]]: {
        args: Static<S[Path_1][Method_1]["args"]>;
        data?: Static<S[Path_1][Method_1]["data"]>;
        error?: Static<S[Path_1][Method_1]["error"]>;
    }; }; }[Path][Method_1]["args"], fetchInit?: Omit<RequestInit, "body" | "method">) => Promise<Pick<Pick<{ [Path_1 in keyof S]: { [Method_1 in keyof S[Path_1]]: {
        args: Static<S[Path_1][Method_1]["args"]>;
        data?: Static<S[Path_1][Method_1]["data"]>;
        error?: Static<S[Path_1][Method_1]["error"]>;
    }; }; }[Path][Method_1], "data" | "error">, "data" | "error"> & {
        clientError?: FetchClientErrorType;
        res?: Response;
    }>;
};
type ValueError = _sinclair_typebox_value.ValueError;
type TSchema = _sinclair_typebox.TSchema;
type Static<T extends TSchema> = _sinclair_typebox.Static<T>;
type ValidationErrorType = {
    message: string;
    path: string;
    value: any;
};
type FetchClientErrorType = {
    code: "ERR_ENDPOINT_NOT_FOUND" | "ERR_CLIENT_VALIDATION" | "ERR_FETCH_CLIENT";
    message: string;
    stack?: string;
    errors?: ValidationErrorType[] | null;
};
type Schema = {
    [path: string]: {
        [method: string]: {
            args: TSchema;
            data: TSchema;
            error: TSchema;
        };
    };
};
type FunctionRequestContentType = (req: RequestInfo) => Promise<string | null>;
type FunctionQueryParser = (value: any) => string;
type FunctionBodyParser = (req: RequestInfo) => Promise<BodyInit>;
type FunctionPreValidation = (req: RequestInfo) => Promise<void>;
type FunctionValidationArgs = (req: RequestInfo) => Promise<ValidationErrorType[]>;
type Args = {
    headers: any;
    params: any;
    query: any;
    body: any;
};
type RequestInfo = {
    path: string;
    method: string;
    headers: Headers;
    contentType?: string;
    args?: any;
    endpoint: {
        args: TSchema;
        data: TSchema;
        error: TSchema;
    };
};

export { type Args, type FetchClientErrorType, type FunctionBodyParser, type FunctionPreValidation, type FunctionQueryParser, type FunctionRequestContentType, type FunctionValidationArgs, type RequestInfo, type Schema, type Static, type TSchema, type ValidationErrorType, type ValueError, createClient };
