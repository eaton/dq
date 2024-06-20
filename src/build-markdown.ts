import TurndownService, { type Options as TurndownOptions } from 'turndown';
import matter from 'gray-matter';

import { BookTocItem } from './get-toc.js';

export interface MarkdownOptions extends TurndownService.Options {
  highlightedCodeBlock?: boolean,
  strikethrough?: boolean,
  tables?: boolean,
};

export function buildMarkdownFile(xhtml: string, toc?: BookTocItem) {
  const service = xhtmlToMarkdownService();

  const data: Record<string, unknown> = {
    title: toc?.navLabel,
    order: toc?.playOrder
  };
  const content = service.turndown(xhtml);
  return { data, content };
}

export function serializeFrontmatter(data: Record<string, unknown>, content: string) {
  return matter.stringify({ content }, data);
}
export function xhtmlToMarkdownService(options: MarkdownOptions = {}) {
  const opt: TurndownOptions = {
    hr: '---',
    emDelimiter: '*',
    headingStyle: 'atx',
    bulletListMarker: '*',
    codeBlockStyle: 'fenced',
    blankReplacement: (content, node) => node.isBlock && !node.matches("figure") ? "\n\n" : node.outerHTML,
    ...options
  };

  const service = new TurndownService(opt);

  service.addRule('listItem', {
    filter: 'li',
    replacement: (content, node, opt) => {
      content = content
      .replace(/^\n+/, '') // remove leading newlines
      .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
      .replace(/\n/gm, '\n    ') // indent
      let prefix = opt.bulletListMarker + ' '
      const parent = node.parentNode
      if (parent.nodeName === 'OL') {
        const start = parent.getAttribute('start')
        const index = Array.prototype.indexOf.call(parent.children, node)
        prefix = (start ? Number(start) + index : index + 1) + '. '
      }
      return (
        prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
      )
    }
  });

  service.addRule('aba-figure', {
    filter: 'figure',
    replacement: function (content, node, opt) {
      const img = node.firstChild.firstChild.firstChild;
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt');
      const caption = node.firstChild.children[1].textContent;

      // const image = node.children.find(n => n.nodeName === 'IMG');
      // const src = image.getAttribute('src');
      // const alt = image.getAttribute('alt');
      // const caption = node.children.find(n => n.nodeName === 'P');
      return `![${alt}](${src} "${caption}")`;
    }
  })

  return service;
}