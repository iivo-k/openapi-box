var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/writer.js
var writer_exports = {};
__export(writer_exports, {
  write: () => write
});
module.exports = __toCommonJS(writer_exports);
var import_json_schema_ref_parser = __toESM(require("@apidevtools/json-schema-ref-parser"), 1);
var import_code_block_writer = __toESM(require("code-block-writer"), 1);
var import_pascalcase = __toESM(require("pascalcase"), 1);
var prettier = __toESM(require("prettier"), 1);

// src/cleanup.js
var validFields = /* @__PURE__ */ new Set([
  "x-status-code",
  "x-content-type",
  "x-in",
  "type",
  "properties",
  "items",
  "required",
  "pattern",
  "enum",
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "multipleOf",
  "minLength",
  "maxLength",
  "minItems",
  "maxItems",
  "uniqueItems",
  "minProperties",
  "maxProperties",
  "format",
  "additionalProperties",
  "default",
  "allOf",
  "oneOf",
  "anyOf",
  "not",
  "readOnly",
  "writeOnly"
]);
var schemaOptions = /* @__PURE__ */ new Set(["x-status-code", "x-content-type", "x-in", "default", "readOnly", "writeOnly"]);
var kRef = Symbol("ref");
function cleanupSchema(val) {
  const out = {};
  let k;
  for (k in val) {
    if (validFields.has(k)) {
      out[k] = val[k];
    }
  }
  if (val[kRef]) {
    out[kRef] = val[kRef];
  }
  return out;
}
function extractSchemaOptions(val) {
  const out = {};
  let k;
  for (k in val) {
    if (schemaOptions.has(k)) {
      out[k] = val[k];
    }
  }
  return out;
}

// src/head-template.js
var head_template_default = (cjs = false) => `/* eslint eslint-comments/no-unlimited-disable: off */
  /* eslint-disable */
  // This document was generated automatically by openapi-box

  /**
   * @typedef {import('@sinclair/typebox').TSchema} TSchema
   */

  /**
   * @template {TSchema} T
   * @typedef {import('@sinclair/typebox').Static<T>} Static
   */

  /**
   * @typedef {import('@sinclair/typebox').SchemaOptions} SchemaOptions
   */

  /**
   * @typedef {{
   *  [Path in keyof typeof schema]: {
   *    [Method in keyof typeof schema[Path]]: {
   *      [Prop in keyof typeof schema[Path][Method]]: typeof schema[Path][Method][Prop] extends TSchema ?
   *        Static<typeof schema[Path][Method][Prop]> :
   *        undefined
   *    }
   *  }
   * }} SchemaType
   */

  /**
   * @typedef {{
   *  [ComponentType in keyof typeof _components]: {
   *    [ComponentName in keyof typeof _components[ComponentType]]: typeof _components[ComponentType][ComponentName] extends TSchema ?
   *      Static<typeof _components[ComponentType][ComponentName]> :
   *      undefined
   *  }
   * }} ComponentType
   */

  ${cjs ? "const { Type: T, TypeRegistry, Kind, CloneType } = require('@sinclair/typebox')" : "import { Type as T, TypeRegistry, Kind, CloneType } from '@sinclair/typebox'"}
  ${cjs ? "const { Value } = require('@sinclair/typebox/value')" : "import { Value } from '@sinclair/typebox/value'"}

  /**
   * @typedef {{
   *  [Kind]: 'Binary'
   *  static: string | File | Blob | Uint8Array
   *  anyOf: [{
   *    type: 'object',
   *    additionalProperties: true
   *  }, {
   *    type: 'string',
   *    format: 'binary'
   *  }]
   * } & TSchema} TBinary
   */

  /**
   * @returns {TBinary}
   */
  const Binary = () => {
    /**
     * @param {TBinary} schema
     * @param {unknown} value
     * @returns {boolean}
     */
    function BinaryCheck(schema, value) {
      const type = Object.prototype.toString.call(value)
      return type === '[object Blob]' || type === '[object File]' || type === '[object String]' || type === '[object Uint8Array]'
    }

    if (!TypeRegistry.Has('Binary'))
      TypeRegistry.Set('Binary', BinaryCheck)

    return /** @type {TBinary} */({
      anyOf: [{
        type: 'object',
        additionalProperties: true
      }, {
        type: 'string',
        format: 'binary'
      }],
      [Kind]: 'Binary'
    })
  }`;

// src/resolver.js
var import_undici = require("undici");
var resolver_default = (headers, onError) => ({
  http: {
    read: (file) => {
      const h = new Headers();
      Object.keys(headers).forEach((value, key) => {
        h.set(String(key), value);
      });
      return (0, import_undici.fetch)(file.url, {
        redirect: "follow",
        headers
      }).catch((err) => {
        onError(new Error(`FetchError: ${err.message}`));
        throw err;
      }).then((res) => {
        if (res.ok) return res;
        const fetchError = new Error(`FetchError: [${res.status}] ${res.statusText}`);
        onError(fetchError);
        throw fetchError;
      }).then((res) => res.arrayBuffer()).then((buf) => Buffer.from(buf));
    }
  }
});

// src/writer.js
var scalarTypes = {
  string: "String",
  number: "Number",
  boolean: "Boolean",
  integer: "Integer",
  null: "Null"
};
var createCodeBlockWriter = () => new import_code_block_writer.default({
  // optional options
  newLine: "\r\n",
  // default: "\n"
  indentNumberOfSpaces: 2,
  // default: 4
  useTabs: false,
  // default: false
  useSingleQuote: true
});
var write = async (source, opts = {}) => {
  const { cjs = false, headers = {} } = opts;
  let removePrefix;
  if (opts.removePrefix) {
    removePrefix = new RegExp(`^${opts.removePrefix}`);
  }
  const responseSchemas = [];
  const requestSchemas = [];
  let w = createCodeBlockWriter();
  w.writeLine(head_template_default(cjs));
  w.blankLineIfLastNot();
  const refs = /* @__PURE__ */ new Map();
  let fetchError;
  const openapi = await import_json_schema_ref_parser.default.dereference(source, {
    resolve: resolver_default(headers, (err) => {
      fetchError = err;
    }),
    dereference: {
      onDereference: (path, value) => {
        path = (0, import_pascalcase.default)(path);
        if (!refs.has(path)) {
          refs.set(path, getWriterString(() => writeType(value, true)));
          value[kRef] = path;
        }
      }
    }
  }).catch((err) => {
    if (fetchError) throw fetchError;
    throw err;
  });
  refs.forEach((schema, path) => {
    w.writeLine(`const ${path} = ${schema}`);
  });
  w.blankLineIfLastNot();
  const { paths, components } = openapi;
  if (paths) {
    Object.keys(paths).forEach((pathKey) => {
      Object.keys(paths[pathKey]).forEach((method) => {
        buildSchema(paths, pathKey, method);
      });
    });
    w.write("const schema = ").inlineBlock(() => {
      Object.keys(paths).forEach((pathKey) => {
        const pathStr = removePrefix ? pathKey.replace(removePrefix, "") : pathKey;
        w.write(`'${pathStr}': `).inlineBlock(() => {
          Object.keys(paths[pathKey]).forEach((method) => {
            w.write(`${method.toUpperCase()}: `).inlineBlock(() => {
              const request = requestSchemas.find((r) => r.pathKey === pathKey && r.method === method);
              if (request.args.size > 0) {
                w.write(`args: ${request.isRequired ? "" : "T.Optional("}T.Object(`).inlineBlock(() => {
                  request.args.forEach((schema, type) => {
                    w.write(`${type}: ${schema},
`);
                  });
                }).write(`)${request.isRequired ? "" : ")"},
`);
              } else {
                w.write("args: T.Void(),\n");
              }
              const response = responseSchemas.find((r) => r.pathKey === pathKey && r.method === method);
              const success = response.list.filter((l) => l.success).map((l) => l.text).join(",");
              w.write(`data: ${success},
`);
              const errors = response.list.filter((l) => !l.success).map((l) => l.text).join(",");
              w.write(`error: T.Union([${errors}]),
`);
            }).write(",\n");
          });
        }).write(",\n");
      });
    });
  } else {
    w.write("const schema = {}");
  }
  w.blankLineIfLastNot();
  if (components) {
    w.write("const _components = ").inlineBlock(() => {
      Object.keys(components).forEach((componentType) => {
        writeComponents(componentType, components[componentType]);
      });
    });
  } else {
    w.write("const _components = {}");
  }
  w.blankLineIfLastNot();
  w.write(cjs ? "module.exports = { schema, components: _components }" : "export { schema, _components as components }");
  const text = w.toString();
  return await prettier.format(text, {
    semi: false,
    singleQuote: true,
    parser: "babel",
    trailingComma: "none"
  });
  function getWriterString(handler) {
    const parentW = w;
    w = createCodeBlockWriter();
    handler();
    const str = w.toString();
    w = parentW;
    return str;
  }
  function writeType(schema, isRequired = false) {
    const isNullable = !!schema.nullable;
    schema = cleanupSchema(schema);
    if (schema[kRef]) {
      writeRef(schema, isRequired, isNullable);
      return;
    }
    if (schema?.enum?.length === 1) {
      schema.const = schema.enum[0];
    }
    if (schema.const) {
      writeLiteral(schema, isRequired, isNullable);
      return;
    }
    if (schema.enum) {
      writeCompound({
        ...schema,
        anyOf: schema.enum
      }, isRequired, isNullable);
      return;
    }
    if (schema.anyOf || schema.allOf || schema.oneOf) {
      writeCompound(schema, isRequired, isNullable);
      return;
    }
    if (!schema.type) {
      if ("properties" in schema) {
        schema.type = "object";
      } else {
        w.write("T.Any()");
        return;
      }
    }
    if (schema.type === "object") {
      writeObject(schema, isRequired, isNullable);
      return;
    }
    if (schema.type === "array") {
      writeArray(schema, isRequired, isNullable);
      return;
    }
    if (schema.type in scalarTypes) {
      writeScalar(schema, isRequired, isNullable);
    }
  }
  function startNullish(isRequired, isNullable) {
    if (!isRequired) w.write("T.Optional(");
    if (isNullable) w.write("T.Union([T.Null(), ");
  }
  function endNullish(isRequired, isNullable) {
    if (isNullable) w.write("])");
    if (!isRequired) w.write(")");
  }
  function writeLiteral(schema, isRequired = false, isNullable = false) {
    let { const: value } = schema;
    let options = extractSchemaOptions(schema);
    value = JSON.stringify(value);
    if (Object.keys(options).length) {
      options = `,${JSON.stringify(options)}`;
    } else {
      options = "";
    }
    startNullish(isRequired, isNullable);
    w.write(`T.Literal(${value}${options})`);
    endNullish(isRequired, isNullable);
  }
  function writeRef(schema, isRequired = false, isNullable = false) {
    let options = extractSchemaOptions(schema);
    if (Object.keys(options).length) {
      options = `,${JSON.stringify(options)}`;
    } else {
      options = "";
    }
    const value = `CloneType(${schema[kRef]}${options})`;
    startNullish(isRequired, isNullable);
    w.write(`${value}`);
    endNullish(isRequired, isNullable);
  }
  function writeCompound(schema, isRequired = false, isNullable = false) {
    const { enum: _, type, anyOf, allOf, oneOf, ...options } = schema;
    startNullish(isRequired, isNullable);
    const compoundType = anyOf ? "T.Union" : allOf ? "T.Intersect" : "T.Union";
    const list = anyOf || allOf || oneOf;
    w.write(`${compoundType}(`);
    w.write("[");
    list.forEach((subSchema) => {
      if (typeof subSchema !== "object") {
        w.write(`T.Literal(${JSON.stringify(subSchema)})`);
      } else {
        if (!("type" in subSchema)) {
          subSchema.type = type;
        }
        writeType(subSchema, true);
      }
      w.write(",\n");
    });
    w.write("]");
    if (Object.keys(options).length > 0) {
      w.write(`,${JSON.stringify(options)}`);
    }
    w.write(")");
    endNullish(isRequired, isNullable);
  }
  function writeObject(schema, isRequired = false, isNullable = false) {
    const { type, properties = {}, required = [], ...options } = schema;
    startNullish(isRequired, isNullable);
    let optionsString;
    const optionsKeys = Object.keys(options);
    const propertyKeys = Object.keys(properties);
    if (propertyKeys.length === 0 && !optionsKeys.includes("additionalProperties")) {
      optionsKeys.push("additionalProperties");
      options.additionalProperties = true;
    }
    if (optionsKeys.length > 0) {
      optionsString = getWriterString(() => {
        w.inlineBlock(() => {
          optionsKeys.forEach((optionKey) => {
            const value = options[optionKey];
            w.write(`'${optionKey}': `);
            if (optionKey === "additionalProperties" && value?.type) {
              writeType(value, true);
            } else {
              w.write(JSON.stringify(value));
            }
            w.write(",\n");
          });
        });
      });
    }
    if (propertyKeys.length === 0) {
      w.write(`T.Object({}${optionsString ? "," + optionsString : ""})`);
    } else {
      w.write("T.Object(");
      if (propertyKeys.length > 0) {
        w.inlineBlock(() => {
          propertyKeys.forEach((subSchemaKey) => {
            const subSchema = properties[subSchemaKey];
            w.write(`'${subSchemaKey}': `);
            writeType(subSchema, required.includes(subSchemaKey));
            w.write(",\n");
          });
        });
      } else {
        w.write("{}");
      }
      if (optionsString) {
        w.write(`,${optionsString}`);
      }
      w.write(")");
    }
    endNullish(isRequired, isNullable);
  }
  function writeScalar(schema, isRequired = false, isNullable = false) {
    let { type, ...options } = schema;
    if (type === "string" && options?.format === "binary") {
      startNullish(isRequired, isNullable);
      w.write("Binary()");
      endNullish(isRequired, isNullable);
      return;
    }
    if (Object.keys(options).length) {
      options = JSON.stringify(options);
    } else {
      options = "";
    }
    startNullish(isRequired, isNullable);
    w.write(`T.${scalarTypes[type]}(${options})`);
    endNullish(isRequired, isNullable);
  }
  function writeArray(schema, isRequired = false, isNullable = false) {
    const { type, items, ...options } = schema;
    startNullish(isRequired, isNullable);
    const isArray = Array.isArray(items);
    if (!items || isArray && items.length === 0 || !isArray && Object.keys(items).length === 0) {
      w.write("T.Array(");
      w.write("T.Any()");
    } else {
      if (isArray) {
        delete options.additionalItems;
        delete options.minItems;
        delete options.maxItems;
        w.write("T.Tuple(");
        w.write("[");
        items.forEach((subSchema) => {
          writeType(subSchema, true);
          w.write(",");
        });
        w.write("]");
      } else {
        w.write("T.Array(");
        writeType(items, true);
      }
    }
    if (Object.keys(options).length > 0) {
      w.write(`,${JSON.stringify(options)}`);
    }
    w.write(")");
    endNullish(isRequired, isNullable);
  }
  function buildSchema(paths2, pathKey, method) {
    const endpoint = paths2[pathKey][method];
    const { responses, parameters = [], requestBody } = endpoint;
    const request = { pathKey, method, isRequired: false, args: /* @__PURE__ */ new Map() };
    requestSchemas.push(request);
    request.isRequired = !!(parameters.find((p) => p.required) || requestBody?.required);
    const headerParams = parameters.filter((p) => p.in === "header");
    if (headerParams.length > 0) {
      request.args.set("headers", getWriterString(() => {
        writeParameters(headerParams);
      }));
    }
    const pathParams = parameters.filter((p) => p.in === "path");
    if (pathParams.length > 0) {
      request.args.set("params", getWriterString(() => {
        writeParameters(pathParams);
      }));
    }
    const queryParams = parameters.filter((p) => p.in === "query");
    if (queryParams.length > 0) {
      request.args.set("query", getWriterString(() => {
        writeParameters(queryParams);
      }));
    }
    if (requestBody) {
      request.args.set("body", getWriterString(() => writeRequestBody(requestBody)));
    }
    const responseList = [];
    if (responses) {
      const responsesWithCode = Object.keys(responses).map((code) => ({
        code,
        ...responses[code]
      }));
      const defaultResponse = responsesWithCode.find((res) => res.code === "default") || { code: "default" };
      const successResponse = responsesWithCode.find((res) => `${res.code}`.startsWith("2")) || defaultResponse;
      const errorResponses = responsesWithCode.filter((res) => !`${res.code}`.startsWith("2"));
      const pushResponse = (success, response) => {
        responseList.push({
          success,
          text: getWriterString(() => writeResponse(response))
        });
      };
      pushResponse(true, successResponse);
      if (errorResponses.length > 0) {
        errorResponses.forEach((res) => pushResponse(false, res));
      } else {
        pushResponse(false, defaultResponse);
      }
    }
    responseSchemas.push({ pathKey, method, list: responseList });
  }
  function writeRequestBody(requestBody) {
    const contentType = "application/json" in requestBody.content ? "application/json" : Object.keys(requestBody.content)[0];
    const schema = requestBody.content[contentType].schema;
    writeType({
      "x-content-type": contentType,
      ...schema
    }, requestBody.required);
  }
  function writeResponse(response) {
    const obj = {};
    if ("code" in response) {
      obj["x-status-code"] = `${response.code}`.toLowerCase();
    }
    try {
      if (response.content) {
        const content = response.content;
        const contentType = "application/json" in content ? "application/json" : Object.keys(content)[0];
        return writeType({
          ...obj,
          "x-content-type": contentType,
          ...content[contentType].schema
        }, true);
      }
      if (response.schema) {
        return writeType({
          ...obj,
          ...response.schema
        }, true);
      }
      w.write(`T.Any(${JSON.stringify(obj)})`);
    } catch {
      w.write(`T.Any(${JSON.stringify(obj)})`);
    }
  }
  function writeParameters(parameters) {
    if (parameters.length === 0) return;
    const isRequired = parameters.find((p) => p.required);
    if (!isRequired) w.write("T.Optional(");
    w.write("T.Object(");
    w.inlineBlock(() => {
      parameters.forEach((param) => {
        w.write(`'${param.name}': `);
        writeParameter(param);
        w.write(",\n");
      });
    });
    w.write(")");
    if (!isRequired) w.write(")");
  }
  function writeParameter(param) {
    if (!param.schema) {
      param.schema = {
        items: param.items,
        type: param.type
      };
      if (param.format && param.format !== "string") {
        param.schema.format = param.format;
      }
    }
    if (param.in) {
      const inValue = param.in;
      delete param.in;
      param.schema["x-in"] = inValue;
    }
    writeType(param.schema, param.required);
  }
  function writeComponents(componentType, components2) {
    switch (componentType) {
      case "schemas": {
        writeComponent(componentType, components2, (c) => writeType(c, true));
        break;
      }
      case "parameters": {
        writeComponent(componentType, components2, (c) => writeParameter(c));
        break;
      }
      case "responses": {
        writeComponent(componentType, components2, (c) => writeResponse(c));
        break;
      }
      case "requestBodies": {
        writeComponent(componentType, components2, (c) => {
          c.required = true;
          writeRequestBody(c);
        });
        break;
      }
      case "headers": {
        writeComponent(componentType, components2, (c) => writeParameter(c));
        break;
      }
    }
  }
  function writeComponent(componentType, components2, cb) {
    const list = Object.keys(components2);
    if (list.length === 0) return;
    w.write(`'${componentType}': `).inlineBlock(() => {
      list.forEach((name) => {
        w.write(`'${name}': `);
        cb(components2[name]);
        w.write(",\n");
      });
    }).write(",\n");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  write
});
