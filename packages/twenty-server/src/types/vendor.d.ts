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

declare module '@file-type/pdf' {
  import { type Detector } from 'file-type';

  export const detectPdf: Detector;
}
