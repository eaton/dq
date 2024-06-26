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
    identifier: string;
    title?: string | undefined;
    creator?: string | string[] | undefined;
    contributor?: string[] | undefined;
    publisher?: string | undefined;
    rights?: string | undefined;
    subject?: string | string[] | undefined;
    language?: string | string[] | undefined;
    source?: string | undefined;
}>;
declare function getRawMeta(input: string | JSZip): Promise<string>;
declare const metadata: z.ZodObject<{
    title: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodEffects<z.ZodObject<{
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
    }, {
        text: string;
    }>, string, {
        text: string;
    }>]>>;
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
    subject: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    language: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodString, z.ZodEffects<z.ZodObject<{
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
    }, {
        text: string;
    }>, string, {
        text: string;
    }>]>, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodEffects<z.ZodObject<{
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
    }, {
        text: string;
    }>, string, {
        text: string;
    }>]>, "many">]>>;
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
    identifier: string;
    title?: string | undefined;
    creator?: string | string[] | undefined;
    contributor?: string[] | undefined;
    publisher?: string | undefined;
    rights?: string | undefined;
    subject?: string | string[] | undefined;
    language?: string | string[] | undefined;
    source?: string | undefined;
}, {
    date: string;
    identifier: string | {
        text: string;
    };
    title?: string | {
        text: string;
    } | undefined;
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
    subject?: string | string[] | undefined;
    language?: string | {
        text: string;
    } | (string | {
        text: string;
    })[] | undefined;
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

type ChapterData = {
    [index: string]: unknown;
    title?: string;
    order?: number;
    chapterImage?: string;
    markdown?: string;
    markup?: string;
    links?: string[];
};
/**
 * Given the `content` key from a TOC chapter entry, return the XHTML text of that chapter.
 */
declare function getChapter(input: string | JSZip, file: string): Promise<ChapterData>;
/**
 * Given the `content` key from a TOC chapter entry, return the XHTML text of that chapter.
 */
declare function getRawChapter(input: string | JSZip, chapter: string): Promise<string | undefined>;

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

/**
 * Options to control Dancing Queen's book conversion process.
 */
interface BookOptions {
    /**
     * The root directory the book's files should be exported to.
     *
     * @defaultValue `./output`
     */
    root?: string;
    /**
     * The root-relative directory where data files (book metadata, link
     * status checks, etc) should go.
     *
     * If set to `false`, these metadata files will not be generated.
     *
     * @defaultValue `_data`
     */
    data?: false | string;
    /**
     * The root-relative directory where html chapter/section files should
     * be copied.
     *
     * If set to `false`, these files will not be copied over.
     *
     * @defaultValue `_src`
     */
    chapters?: false | string;
    /**
     * The root-relative directory where image files for the ebook should
     * be copied.
     *
     * If set to `false`, these files will not be copied over.
     *
     * @defaultValue `_src/image`
     */
    images?: false | string;
    /**
     * Convert the chapter/section files to markdown and store their metadata
     * in the file's frontmatter.
     *
     * @defaultValue `true`
     */
    convertToMarkdown?: boolean;
    /**
     * Attempt to replace shortened `bookapt.com` links with their expanded
     * equivalents.
     *
     * Note: This feature is not yet complete.
     *
     * @defaultValue `true`
     */
    resolveLinks?: boolean;
    /**
     * Process chapter/section files even if they are not linked in the book's TOC file.
     *
     * @defaultValue `true`
     */
    useToc?: boolean;
    /**
     * The glob pattern used to identify chapter files in the book's contents. If `includeUnlinkedChapters`
     * is set to `false`, this option is ignored.
     *
     * @defaultValue `**\/*.*html`
     */
    chapterPattern?: string;
    /**
     * The glob pattern used to identify image and other media assets in the book's contents.
     *
     * @defaultValue `**\/image/*.*`
     */
    assetPattern?: string;
}
declare function processBook(path: string, options?: BookOptions): Promise<void>;

export { type BookMetadata, type BookOptions, type BookTocItem, type ChapterData, type CopyFileOptions, copyFiles, getChapter, getMeta, getRawChapter, getRawMeta, getRawToc, getToc, listContents, loadBook, processBook };
