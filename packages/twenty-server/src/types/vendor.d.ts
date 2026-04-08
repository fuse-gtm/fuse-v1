// Stub type declarations for third-party modules that lack their own types.

declare module 'tar' {
  export function extract(options: {
    file: string;
    cwd: string;
    filter?: (path: string, entry: any) => boolean;
  }): Promise<void>;

  export function create(
    options: {
      gzip?: boolean;
      cwd?: string;
      portable?: boolean;
      file?: string;
    },
    fileList: string[],
  ): Promise<void> & NodeJS.ReadableStream;
}

declare module 'exa-js' {
  export default class Exa {
    constructor(apiKey: string);
    search(
      query: string,
      options?: Record<string, any>,
    ): Promise<{ results: any[] }>;
  }
}

declare module 'twenty-client-sdk/generate' {
  export function replaceCoreClient(...args: any[]): any;
}

declare module 'twenty-sdk/front-component-renderer/build' {
  export function getFrontComponentBuildPlugins(...args: any[]): any[];
}

declare module '@clickhouse/client' {
  export enum ClickHouseLogLevel {
    OFF = 'OFF',
  }
  export interface ClickHouseClient {
    ping(): Promise<boolean>;
    close(): Promise<void>;
    query(params: {
      query: string;
      format?: string;
      query_params?: Record<string, any>;
    }): Promise<{ json<T>(): Promise<T[] & { data: T[] }> }>;
    insert(params: {
      table: string;
      values: any[];
      format?: string;
    }): Promise<void>;
    exec(params: { query: string }): Promise<void>;
    command(params: {
      query: string;
      query_params?: Record<string, any>;
    }): Promise<void>;
  }
  export function createClient(options: Record<string, any>): ClickHouseClient;
}

declare module '@file-type/pdf' {
  import { type Detector } from 'file-type';

  export const detectPdf: Detector;
}
