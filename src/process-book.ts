import jetpack from 'fs-jetpack';
import matter from 'gray-matter';

import { loadBook } from './load-book.js';
import { getMeta } from './get-meta.js';
import { getCoverColor } from './get-cover-color.js';
import { getToc } from './get-toc.js';
import { getChapter } from './get-chapter.js';
import { copyFiles } from './copy-files.js';
import { LinkStatus } from './expand-links.js';

export interface BookOptions {
  root?: string,
  data?: false | string,
  images?: false | string,
  fonts?: false | string,
  chapters?: false | string,
  expandLinks?: boolean,
}

const defaults: Required<BookOptions> = {
  root: './output',
  data: '_data',
  chapters: '_src',
  images: '_src/image',
  fonts: false,
  expandLinks: true,
}

export async function processBook(path: string, options: BookOptions = {}) {
  const opt = { ...defaults, ...options };
  const book = await loadBook(path);
  const root = jetpack.dir(opt.root);

  if (opt.data) {
    const meta = await getMeta(book);
    const color = await getCoverColor(book, 'hex');
    root.dir(opt.data).write('meta.json', { color, ...meta });
  }

  if (opt.chapters) {
    const links: LinkStatus[] = [];
    const toc = await getToc(book);
    for (const chapter of toc) {
      // These are deep links to portions of individual chapters; we 
      // can safely skip them.
      if (chapter.content.indexOf('#') > -1) continue;
      const chapterData = await getChapter(book, chapter.content);
      if (chapterData.xhtml) {
        const frontmatter: Record<string, unknown> = {
          title: chapter.navLabel,
          order: chapter.playOrder,
        };
        if (chapterData.chapterHeading) frontmatter.chapterHeading = chapterData.chapterHeading;

        if (opt.expandLinks) {
          links.push(...chapterData.links?.map(url => ({ url })) ?? []);
        }

        const content = chapterData.markdown ?? '';
        const filename = chapter.content.replace('.xhtml', '.md');
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