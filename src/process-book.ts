import jetpack from 'fs-jetpack';
import matter from 'gray-matter';

import { loadBook } from './load-book.js';
import { getMeta } from './get-meta.js';
import { getCoverColor } from './get-cover-color.js';
import { getToc } from './get-toc.js';
import { getChapter } from './get-chapter.js';
import { copyFiles } from './copy-files.js';
import { listContents } from './list-contents.js';
import micromatch from 'micromatch';

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
   * Process chapter/section files even if they are not linked in the book's TOC file. 
   *
   * @defaultValue `true`
   */
  useToc?: boolean,

  /**
   * The glob pattern used to identify chapter files in the book's contents. If `includeUnlinkedChapters`
   * is set to `false`, this option is ignored.
   *
   * @defaultValue `**\/*.*html`
   */
  chapterPattern?: string

  /**
   * The glob pattern used to identify image and other media assets in the book's contents.
   *
   * @defaultValue `**\/image/*.*`
   */
  assetPattern?: string
}

const defaults: Required<BookOptions> = {
  root: './output',
  data: '_data',
  images: '_static/image',
  chapters: '_src',
  useToc: true,
  chapterPattern: '**/*.*html',
  assetPattern: '**/image*/*.*',
  convertToMarkdown: true,
  resolveLinks: true,
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
    const toc = await getToc(book);
    let chapters = opt.useToc ?
      toc.map(t => t.content) :
      (await listContents(book)).filter(f => micromatch.isMatch(f, opt.chapterPattern));

    // Remove anchor tags, then de-duplicate the list.
    chapters = chapters.map(c => c.split('#')[0]);
    chapters = [...(new Set(chapters)).values()];
    
    let chNum = 0;
    for (const chapter of chapters) {
      const chapterData = await getChapter(book, chapter);
      if (chapterData.markup) {
        const frontmatter: Record<string, unknown> = {};
        if (chapterData.title) {
          // Pull out the words 'Chapter x.' at the beginning of the title
          frontmatter.title = chapterData.title.replace(/Chapter \d+\.\s*/, '');
        }
        if (chapterData.chapterImage) {
          frontmatter.headerImage = chapterData.chapterImage;
          frontmatter.chapterNumber = ++chNum;
        }

        // Fill in frontmatter gaps with the TOC data
        const tocEntry = toc.find(e => e.content === chapter);
        if (tocEntry) {
           if (tocEntry.playOrder) frontmatter.tocOrder = tocEntry.playOrder;
         if (tocEntry.navLabel) frontmatter.title ??= tocEntry.navLabel;
        }

        const content = chapterData.markdown ?? '';
        const filename = chapter.replace(/\..?html/, '.md');
        root.dir(opt.chapters).write(filename, matter.stringify(content, frontmatter));
      }
    }
  }

  if (opt.images) {
    await copyFiles(book, {
      matching: opt.assetPattern,
      preserveDates: true,
      rewritePaths: path => path.replace('OEBPS/image/', ''),
      output: root.dir(opt.images).path()
    });
  }
}

