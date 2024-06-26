import TurndownService, { type Options as TurndownOptions } from 'turndown';
import { tables } from './markdown-rules/tables.js';
import { abaNobrSpans } from './markdown-rules/aba-nobr-spans.js';
import { abaFigures } from './markdown-rules/aba-figures.js';
import { abaCodeBlocks } from './markdown-rules/aba-codeblocks.js';
import { noIndentListItem } from './markdown-rules/list-item.js';

export interface MarkdownOptions extends TurndownService.Options {
  highlightedCodeBlock?: boolean,
  strikethrough?: boolean,
  tables?: boolean,
};

const defaults: MarkdownOptions = {
  hr: '---',
  emDelimiter: '*',
  headingStyle: 'atx',
  bulletListMarker: '*',
  codeBlockStyle: 'fenced',
}

export function toMarkdown(xhtml: string, options: MarkdownOptions = {}) {
  const parser = toMarkdownParser(options);
  return parser.turndown(xhtml).trim();
}

export function toMarkdownParser(options: MarkdownOptions = {}) {
  const opt: TurndownOptions = {
    ...defaults,

    blankReplacement: (content, node) => {
      if (node.isBlock && !node.matches("figure")) {
        return "\n\n";
      } else if (!node.isBlock && !node.children?.length && node.textContent?.trim() === '') {
        return "";
      } else {
        return node.outerHTML;
      }
    },
    ...options
  };

  const service = new TurndownService(opt).use([tables, abaNobrSpans, abaFigures, abaCodeBlocks, noIndentListItem]);

  // Strip the page title; we don't want it appearing in the body.
  service.remove('title');

  service.addRule('cite', {
    filter: 'cite',
    replacement: function (content) {
      return '*' + content + '*';
    }
  });

  service.remove(node => (node.nodeName === 'SPAN') && (node.textContent === ' '));

  return service;
}