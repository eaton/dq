import jetpack from 'fs-jetpack';
import matter from 'gray-matter';

import { loadBook } from './load-book.js';
import { getMeta } from './get-meta.js';
import { getCoverColor } from './get-cover-color.js';
import { getToc } from './get-toc.js';
import { getChapter } from './get-chapter.js';
import { copyFiles } from './copy-files.js';
import { listContents } from './list-contents.js';
import { LinkStatus } from './expand-links.js';

/**
 * Options to control Dancing Queen's book conversion process.
 */
export interface BookOptions {
  
  /**
   * The root directory the book's files should be exported to.
   *
   * @defaultValue `./output`
   */
  root?: string,

  /**
   * The root-relative directory where data files (book metadata, link
   * status checks, etc) should go.
   * 
   * If set to `false`, these metadata files will not be generated.
   *
   * @defaultValue `_data`
   */
  data?: false | string,

  /**
   * The root-relative directory where html chapter/section files should
   * be copied.
   * 
   * If set to `false`, these files will not be copied over.
   *
   * @defaultValue `_src`
   */
  chapters?: false | string,

  /**
   * The root-relative directory where image files for the ebook should
   * be copied.
   * 
   * If set to `false`, these files will not be copied over.
   *
   * @defaultValue `_src/image`
   */
  images?: false | string,

  /**
   * Convert the chapter/section files to markdown and store their metadata
   * in the file's frontmatter.
   *
   * @defaultValue `true`
   */
  convertToMarkdown?: boolean,

  /**
   * Attempt to replace shortened `bookapt.com` links with their expanded
   * equivalents.
   * 
   * Note: This feature is not yet complete.
   *
   * @defaultValue `true`
   */
  resolveLinks?: boolean,
  
  /**
   * Attempt to rename the chapter/section files to follow their order in the
   * table of contents. 
   *
   * @defaultValue `true`
   */
  renameChapterFiles?: boolean,
}

const defaults: Required<BookOptions> = {
  root: './output',
  data: '_data',
  images: '_static/image',
  chapters: '_src',
  resolveLinks: true,
  renameChapterFiles: true,
  convertToMarkdown: true
}

export async function processBook(path: string, options: BookOptions = {}) {
  const opt = { ...defaults, ...options };
  const book = await loadBook(path);
  const root = jetpack.dir(opt.root);

  if (opt.data) {
    const meta = await getMeta(book);
    const color = await getCoverColor(book, 'hex');
    root.dir(opt.data).write('meta.json', { color, ...meta });
    root.dir(opt.data).write('files.json', await listContents(book));
    root.dir(opt.data).write('toc.json', await getToc(book))
  }

  if (opt.chapters) {

    const links: LinkStatus[] = [];
    const toc = await getToc(book);
    for (const chapter of toc) {
      const exportedChapters: string[] = [];
      // These are deep links to portions of individual chapters; we 
      // can safely skip them.
      const chapterFile = chapter.content.split('#')[0];
      if (exportedChapters.includes(chapterFile)) continue;

      const chapterData = await getChapter(book, chapterFile);
      if (chapterData.markup) {
        const frontmatter: Record<string, unknown> = {
          title: chapter.navLabel,
          order: chapter.playOrder,
        };
        if (chapterData.chapterHeading) frontmatter.chapterHeading = chapterData.chapterHeading;

        if (opt.resolveLinks) {
          links.push(...chapterData.links?.map(url => ({ url })) ?? []);
        }

        const content = chapterData.markdown ?? '';
        const filename = chapterFile.replace(/\..?html/, '.md');
        root.dir(opt.chapters).write(filename, matter.stringify({ content }, frontmatter));
      }
      if (opt.data && links.length) {
        root.dir(opt.data).write('links.json', links);
      }
    }
  }

  if (opt.images) {
    await copyFiles(book, {
      matching: '**/image/*.*',
      preserveDates: true,
      rewritePaths: path => path.replace('OEBPS/image/', ''),
      output: root.dir(opt.images).path()
    });
  }
}