interface CopyFileOptions {
    matching?: string | string[];
    output?: string;
    preserveDates?: boolean;
    preservePath?: boolean;
}
/**
 * Copies matching items from the EPUB to real honest-to-god files.
 */
declare function copyFiles(path: string, options?: CopyFileOptions): Promise<void>;

/**
 * Returns a list of all the EPUB's internal files.
 */
declare function listContents(path: string): Promise<string[]>;

declare function parseMeta(path: string): Promise<string>;

declare function parseToc(path: string): Promise<string>;

export { type CopyFileOptions, copyFiles, listContents, parseMeta, parseToc };
