import * as _apidevtools_json_schema_ref_parser from '@apidevtools/json-schema-ref-parser';

declare function write(source: string | JSONSchema, opts?: {
    cjs?: boolean;
    headers?: object;
    removePrefix?: string;
}): Promise<string>;
type JSONSchema = _apidevtools_json_schema_ref_parser.JSONSchema;

export { type JSONSchema, write };
