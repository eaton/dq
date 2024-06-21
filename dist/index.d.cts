import JSZip from 'jszip';
import { z } from 'zod';

/**
 * Ensures a given input is either a functioning Zip file, or a path
 * where a zip file lives.
 *
 * Returns a Promise for a loaded zip file.
 */
declare function loadBook(input: string | JSZip): Promise<JSZip>;

/**
 * Returns a list of all the EPUB's internal files.
 */
declare function listContents(input: string | JSZip): Promise<string[]>;

declare function getMeta(input: string | JSZip): Promise<{
    date: string;
    title: string;
    language: string;
    identifier: string;
    creator?: string | string[] | undefined;
    contributor?: string[] | undefined;
    publisher?: string | undefined;
    rights?: string | undefined;
    subject?: string[] | undefined;
    source?: string | undefined;
}>;
declare function getRawMeta(input: string | JSZip): Promise<string>;
declare const metadata: z.ZodObject<{
    title: z.ZodString;
    creator: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodEffects<z.ZodObject<{
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
    }, {
        text: string;
    }>, string, {
        text: string;
    }>]>, "many">, z.ZodUnion<[z.ZodString, z.ZodEffects<z.ZodObject<{
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
    }, {
        text: string;
    }>, string, {
        text: string;
    }>]>]>>;
    contributor: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodEffects<z.ZodObject<{
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
    }, {
        text: string;
    }>, string, {
        text: string;
    }>]>, "many">>>;
    publisher: z.ZodOptional<z.ZodString>;
    rights: z.ZodOptional<z.ZodString>;
    subject: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    language: z.ZodString;
    identifier: z.ZodUnion<[z.ZodString, z.ZodEffects<z.ZodObject<{
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
    }, {
        text: string;
    }>, string, {
        text: string;
    }>]>;
    source: z.ZodOptional<z.ZodString>;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    date: string;
    title: string;
    language: string;
    identifier: string;
    creator?: string | string[] | undefined;
    contributor?: string[] | undefined;
    publisher?: string | undefined;
    rights?: string | undefined;
    subject?: string[] | undefined;
    source?: string | undefined;
}, {
    date: string;
    title: string;
    language: string;
    identifier: string | {
        text: string;
    };
    creator?: string | {
        text: string;
    } | (string | {
        text: string;
    })[] | undefined;
    contributor?: (string | {
        text: string;
    })[] | undefined;
    publisher?: string | undefined;
    rights?: string | undefined;
    subject?: string[] | undefined;
    source?: string | undefined;
}>;
type BookMetadata = z.infer<typeof metadata>;

declare function getToc(input: string | JSZip): Promise<{
    id: string;
    playOrder: number;
    navLabel: string;
    content: string;
}[]>;
declare function getRawToc(input: string | JSZip): Promise<string>;
declare const navPoint: z.ZodObject<{
    id: z.ZodString;
    playOrder: z.ZodNumber;
    navLabel: z.ZodUnion<[z.ZodString, z.ZodEffects<z.ZodObject<{
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
    }, {
        text: string;
    }>, string, {
        text: string;
    }>]>;
    content: z.ZodUnion<[z.ZodString, z.ZodEffects<z.ZodObject<{
        src: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        src: string;
    }, {
        src: string;
    }>, string, {
        src: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    playOrder: number;
    navLabel: string;
    content: string;
}, {
    id: string;
    playOrder: number;
    navLabel: string | {
        text: string;
    };
    content: string | {
        src: string;
    };
}>;
type BookTocItem = z.infer<typeof navPoint>;

/**
 * Given the `content` key from a TOC chapter entry, return the XHTML text of that chapter.
 */
declare function getChapter(input: string | JSZip, chapter: string): Promise<string | undefined>;

interface CopyFileOptions {
    matching?: string | string[];
    output?: string;
    preserveDates?: boolean;
    rewritePaths?: (path: string) => string;
}
/**
 * Copies matching items from the EPUB to real honest-to-god files.
 */
declare function copyFiles(input: string | JSZip, options?: CopyFileOptions): Promise<void>;

interface BookOptions {
    data?: false | string;
    images?: false | string;
    fonts?: false | string;
    chapters?: false | string;
    expandLinks?: boolean;
}
declare function processBook(path: string, options?: BookOptions): Promise<void>;

export { type BookMetadata, type BookOptions, type BookTocItem, type CopyFileOptions, copyFiles, getChapter, getMeta, getRawMeta, getRawToc, getToc, listContents, loadBook, processBook };
