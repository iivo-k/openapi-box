// src/client.js
import { Value } from "@sinclair/typebox/value";
import qs from "fast-querystring";

// src/formats.js
import { FormatRegistry } from "@sinclair/typebox";
FormatRegistry.Set("date-time", (value) => IsDateTime(value, true));
FormatRegistry.Set("date", (value) => IsDate(value));
FormatRegistry.Set("time", (value) => IsTime(value));
FormatRegistry.Set("email", (value) => IsEmail(value));
FormatRegistry.Set("uuid", (value) => IsUuid(value));
FormatRegistry.Set("url", (value) => IsUrl(value));
var UUID = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
var DATE_TIME_SEPARATOR = /t|\s/i;
var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var URL2 = /^(?:https?|wss?|ftp):\/\/(?:\S+@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4])|(?:[a-z0-9\u{00A1}-\u{FFFF}]+-)*[a-z0-9\u{00A1}-\u{FFFF}]+(?:\.(?:[a-z0-9\u{00A1}-\u{FFFF}]+-)*[a-z0-9\u{00A1}-\u{FFFF}]+)*\.[a-z\u{00A1}-\u{FFFF}]{2,})(?::\d{2,5})?(?:\/\S*)?$/iu;
var EMAIL = /^[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
function IsLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function IsDate(str) {
  const matches = DATE.exec(str);
  if (!matches) return false;
  const year = +matches[1];
  const month = +matches[2];
  const day = +matches[3];
  return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && IsLeapYear(year) ? 29 : DAYS[month]);
}
function IsTime(str, strictTimeZone) {
  const matches = TIME.exec(str);
  if (!matches) return false;
  const hr = +matches[1];
  const min = +matches[2];
  const sec = +matches[3];
  const tz = matches[4];
  const tzSign = matches[5] === "-" ? -1 : 1;
  const tzH = +(matches[6] || 0);
  const tzM = +(matches[7] || 0);
  if (tzH > 23 || tzM > 59 || strictTimeZone && !tz) return false;
  if (hr <= 23 && min <= 59 && sec < 60) return true;
  const utcMin = min - tzM * tzSign;
  const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
  return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
}
function IsDateTime(value, strictTimeZone) {
  const dateTime = value.split(DATE_TIME_SEPARATOR);
  return dateTime.length === 2 && IsDate(dateTime[0]) && IsTime(dateTime[1], strictTimeZone);
}
function IsEmail(value) {
  return EMAIL.test(value);
}
function IsUuid(value) {
  return UUID.test(value);
}
function IsUrl(value) {
  return URL2.test(value);
}

// src/client.js
var defaultQueryParser = (value) => qs.stringify(value);
var defaultGetRequestContentType = (body, endpoint) => {
  const contentType = endpoint?.args?.properties?.body?.["x-content-type"];
  if (contentType) return contentType;
  if (body) {
    const type = Object.prototype.toString.call(body);
    if (type === "[object Object]") return "application/json";
    if (type === "[object FormData]") return "multipart/form-data";
  }
  return null;
};
var validateStatusCode = (a, b) => {
  if (!a) return false;
  if (a === b) return true;
  if (a === "default" && b.startsWith("2")) return true;
  if (a.endsWith("x") && a[0] === b[0]) return true;
  return false;
};
var findResponseContentType = (schema, statusCode) => {
  statusCode = String(statusCode);
  if (schema.anyOf) {
    schema = schema.anyOf.find((s) => validateStatusCode(s["x-status-code"], statusCode));
    return schema?.["x-content-type"];
  }
  if (validateStatusCode(schema["x-status-code"], statusCode)) {
    return schema?.["x-content-type"];
  }
};
var parseContentType = async (res, schema, contentType) => {
  contentType = contentType || findResponseContentType(schema, res.status);
  if (contentType?.includes("application/json")) return res.json();
  return null;
};
var parseResponse = async (endpoint, res) => {
  const contentType = res.headers.has("content-type") ? res.headers.get("content-type") : null;
  if (res.ok) {
    return {
      data: await parseContentType(res, endpoint.data, contentType)
    };
  }
  return {
    data: null,
    error: await parseContentType(res, endpoint.error, contentType)
  };
};
var defaultBodyParser = ({ args, contentType }) => {
  if (!args?.body) return;
  if (!contentType || contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = new FormData();
    Object.keys(args.body).forEach((prop) => {
      const value = args.body[prop];
      const type = Object.prototype.toString.call(value);
      if (type === "[object Uint8Array]") {
        form.append(prop, new Blob([value]));
        return;
      }
      if (type === "[object Object]") {
        form.append(prop, JSON.stringify(value));
        return;
      }
      form.append(prop, value);
    });
    return args.body;
  }
  if (contentType.includes("application/json")) {
    return typeof args.body === "string" ? args.body : JSON.stringify(args.body);
  }
  return args.body;
};
var defaultArgsValidator = async (req) => {
  const { args, endpoint } = req;
  if (Value.Check(endpoint.args, args)) return [];
  return [...Value.Errors(endpoint.args, args)].map((error) => ({
    message: error.message,
    path: error.path,
    value: error.value
  }));
};
var createClient = (options) => {
  const {
    schema,
    baseUrl,
    fetch = globalThis.fetch,
    getRequestContentType = defaultGetRequestContentType,
    queryParser = defaultQueryParser,
    bodyParser = defaultBodyParser,
    argsValidator = defaultArgsValidator,
    preValidation
  } = options;
  if (!schema) throw new Error("schema is required");
  if (!baseUrl) throw new Error("baseUrl is required");
  async function openapiFetch(req) {
    const { path, method, args, ...fetchInit } = (
      /** @type {{ path: string, method: string, args: Args } & FetchInit} */
      req
    );
    const endpoint = schema[path][method];
    if (!endpoint) {
      return {
        data: null,
        error: null,
        clientError: {
          code: "ERR_ENDPOINT_NOT_FOUND",
          message: `endpoint not found: ${path} ${method}`
        }
      };
    }
    try {
      const headers = new Headers(fetchInit.headers);
      let contentType;
      if (headers.has("content-type")) {
        contentType = headers.get("content-type");
      } else {
        contentType = getRequestContentType(args?.body, endpoint);
        if (contentType) headers.set("content-type", contentType);
      }
      const reqInfo = {
        path,
        method,
        headers,
        endpoint,
        args,
        contentType
      };
      if (preValidation) await preValidation(reqInfo);
      if (endpoint.args) {
        const errors = await argsValidator(reqInfo);
        if (errors.length > 0) {
          return {
            data: null,
            error: null,
            clientError: {
              code: "ERR_CLIENT_VALIDATION",
              message: "client validation error",
              errors
            }
          };
        }
      }
      if (args?.headers) {
        Object.keys(args.headers).forEach((prop) => {
          headers.set(prop, args.headers[prop]);
        });
      }
      let urlString = baseUrl + path;
      if (args?.params) {
        Object.keys(args.params).forEach((param) => {
          urlString = urlString.replace(`{${param}}`, args.params[param]);
        });
      }
      const url = new URL(urlString + (args?.query ? `?${queryParser(args.query)}` : ""));
      const res = await fetch(url, {
        ...fetchInit,
        method,
        headers: reqInfo.headers,
        body: await bodyParser(reqInfo)
      });
      const result = await parseResponse(endpoint, res);
      return {
        data: result?.data,
        error: result?.error,
        res
      };
    } catch (err) {
      return {
        data: null,
        error: null,
        clientError: {
          code: "ERR_FETCH_CLIENT",
          message: err.message,
          stack: err.stack
        }
      };
    }
  }
  function openapiFetchBind(endpoint) {
    return async (args, fetchInit = {}) => {
      const headers = new Headers();
      const headersA = new Headers(endpoint?.headers);
      const headersB = new Headers(fetchInit?.headers);
      headersA.forEach((value, key) => {
        headers.set(key, value);
      });
      headersB.forEach((value, key) => {
        headers.set(key, value);
      });
      return openapiFetch({
        ...endpoint,
        ...fetchInit,
        // force these properties
        headers,
        path: endpoint.path,
        method: endpoint.method,
        args
      });
    };
  }
  return {
    fetch: openapiFetch,
    bind: openapiFetchBind
  };
};
export {
  createClient
};
