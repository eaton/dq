import TurndownService, { type Options as TurndownOptions } from 'turndown';

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
  return parser.turndown(xhtml);
}

export function toMarkdownParser(options: MarkdownOptions = {}) {
  const opt: TurndownOptions = {
    ...defaults,
    blankReplacement: (content, node) => node.isBlock && !node.matches("figure") ? "\n\n" : node.outerHTML,
    ...options
  };

  const service = new TurndownService(opt);

  // Strip the page title; we don't want it appearing in the body.
  service.remove('title');

  // List items should get a single space intentation, not four.
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

  // ABA images are figures with captions; convert them to alt / src / title combos
  // that can be processed later.
  service.addRule('aba-figure', {
    filter: 'figure',
    replacement: function (content, node) {
      const img = node.firstChild.firstChild.firstChild;
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt');
      const caption = node.firstChild.children[1].textContent;
      return `![${alt}](${src} "${caption}")`;
    }
  })

  return service;
}