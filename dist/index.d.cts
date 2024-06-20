import { z } from 'zod';

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
declare function getMeta(path: string, options?: MetaOptions): Promise<{
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
declare function getRawMeta(path: string): Promise<string>;
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

interface TocOptions {
}
declare function getToc(path: string, options?: TocOptions): Promise<{
    id: string;
    playOrder: number;
    navLabel: string;
    content: string;
}[]>;
declare function getRawToc(path: string): Promise<string>;
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

export { type BookMetadata, type BookTocItem, type CopyFileOptions, type MetaOptions, type TocOptions, copyFiles, getMeta, getRawMeta, getRawToc, getToc, listContents };
