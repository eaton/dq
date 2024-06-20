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

interface MetaOptions {
}
declare function parseMeta(path: string, options?: MetaOptions): Promise<{
    date: string;
    title: string;
    creator: string;
    contributor: string[];
    publisher: string;
    rights: string;
    subject: string[];
    language: string;
    identifier: string;
    source: string;
}>;
declare function getRawMeta(path: string): Promise<string>;

interface TocOptions {
}
declare function parseToc(path: string, options?: TocOptions): Promise<any>;
declare function getRawToc(path: string): Promise<string>;

export { type CopyFileOptions, type MetaOptions, type TocOptions, copyFiles, getRawMeta, getRawToc, listContents, parseMeta, parseToc };
