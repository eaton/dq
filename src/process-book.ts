import jetpack from 'fs-jetpack';
import matter from 'gray-matter';

import { loadBook } from './load-book.js';
import { getMeta } from './get-meta.js';
import { getCoverColor } from './get-cover-color.js';
import { getToc } from './get-toc.js';
import { getChapter } from './get-chapter.js';
import { toMarkdown } from './build-markdown.js';
import { copyFiles } from './copy-files.js';
import { expandLinks, LinkStatus } from './expand-links.js';

export interface BookOptions {
  data?: false | string,
  images?: false | string,
  fonts?: false | string,
  chapters?: false | string,
  expandLinks?: boolean,
}

const defaults: BookOptions = {
  data: './output',
  images: './output/image',
  chapters: './output/src',
  fonts: false,
  expandLinks: true,
}

export async function processBook(path: string, options: BookOptions = {}) {
  const opt = { ...defaults, ...options };
  const book = await loadBook(path);

  if (opt.data) {
    const meta = await getMeta(book);
    const color = await getCoverColor(book, 'hex');
    jetpack.dir(opt.data).write('meta.json', { color, ...meta });
  }

  if (opt.chapters) {
    const links: LinkStatus[] = [];
    const toc = await getToc(book);
    for (const chapter of toc) {
      // These are deep links to portions of individual chapters; we 
      // can safely skip them.
      if (chapter.content.indexOf('#') > -1) continue;
      const xhtml = await getChapter(book, chapter.content);
      if (xhtml) {
        const frontmatter: Record<string, unknown> = {
          title: chapter.navLabel,
          order: chapter.playOrder,
        };

        if (opt.expandLinks) {
          links.push(...await expandLinks(xhtml));
        }

        const content = toMarkdown(xhtml);
        const filename = chapter.content.replace('.xhtml', '.md');
        jetpack.dir(opt.chapters).write(filename, matter.stringify({ content }, frontmatter));
      }
      if (opt.data && links.length) {
        jetpack.dir(opt.data).write('links.json', links);
      }
    }
  }

  if (opt.images) {
    await copyFiles(book, {
      matching: '**/image/*.*',
      preserveDates: true,
      rewritePaths: path => path.replace('OEBPS/image/', ''),
      output: opt.images
    });
  }
}