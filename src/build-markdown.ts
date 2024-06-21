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

    blankReplacement: (content, node) => {
      if (node.isBlock && !node.matches("figure")) {
        return "\n\n";
      } else if (!node.isBlock && !node.children?.length && node.textContent.trim() === '') {
        return "";
      } else {
        return node.outerHTML;
      }
    },
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

  // figure.figFrame
  //   p.figHolder span img
  //   figcaption
  service.addRule('aba-figure-1', {
    filter: function (node) {
      const classAttr = node.getAttribute('class')
      return (
        (node.nodeName === 'FIGURE') &&
        (classAttr && classAttr.indexOf('figFrame') !== -1)
      )
    },
    replacement: function (content, node) {
      const img = node.firstChild?.firstChild?.firstChild;
      const src = img?.getAttribute && img?.getAttribute('src');
      const alt = img?.getAttribute && img?.getAttribute('alt');
      const caption = node.textContent;
      if (src && caption) {
        return `![${alt}](${src} "${caption}")\n\n`;
      } else {
        return node.outerHTML;
      }
    }
  })

  // figure div.figure 
  //   div.image img
  //   p.fig
  service.addRule('aba-figure-2', {
    filter: function (node) {
      const firstChild = node.firstChild;
      const classAttr = firstChild?.getAttribute && firstChild?.getAttribute('class')
      return (
        (node.nodeName === 'FIGURE') &&
        (firstChild.nodeName === 'DIV') &&
        (classAttr && classAttr.indexOf('figure') !== -1)
      )
    },
    replacement: function (content, node) {
      const img = node.firstChild?.firstChild?.firstChild;
      const src = img?.getAttribute && img?.getAttribute('src');
      const alt = img?.getAttribute && img?.getAttribute('alt');
      const caption = node.firstChild.children[1]?.textContent;
      if (src && caption) {
        return `![${alt}](${src} "${caption}")`;
      } else {
        return node.outerHTML;
      }
    }
  });

  // div.figure
  //   div.figure img
  //   div.figure p.FigureCaptionBorder
  service.addRule('aba-figure-3', {
    filter: function (node) {
      const classAttr = node.getAttribute('class')
      const firstChild = node.children[0];
      const secondChild = node.children[1];
      return (
        (node.nodeName === 'DIV') &&
        (classAttr && classAttr.indexOf('figure') !== -1) &&
        (firstChild?.nodeName === 'DIV') && (firstChild?.firstChild?.nodeName === 'IMG') && 
        (secondChild?.nodeName === 'DIV') && (secondChild?.firstChild?.nodeName === 'P')
      )
    },
    replacement: function (content, node) {
      const img = node.children[0]?.firstChild;
      const src = img?.getAttribute && img?.getAttribute('src');
      const alt = img?.getAttribute && img?.getAttribute('alt');
      const caption = node.children[1]?.textContent;
      if (src && caption) {
        return `![${alt}](${src} "${caption}")`;
      } else {
        return node.outerHTML;
      }
    }
  });

  // div.figure
  //   div.figure img
  //   div.figure p.FigureCaptionBorder
  service.addRule('aba-pre-code', {
    // hahah. get it? precode?

    filter: function (node) {
      const classAttr = node.getAttribute('class')
      return (
        (node.nodeName === 'PRE') &&
        (classAttr && classAttr.indexOf('Code') !== -1)
      )
    },
    replacement: function (content) {
      return '    ' + content + '\n';
    }
  });

  service.addRule('nobreak spans', {
    filter: function (node) {
      return (
        (node.nodeName === 'SPAN') &&
        (node.getAttribute('class') === 'NoBreak')
      )
    },
    replacement: (content) => content.trim(),
  })

  service.addRule('cite', {
    filter: 'cite',
    replacement: function (content) {
      return '*' + content + '*';
    }
  });

  service.remove(node => (node.nodeName === 'SPAN') && (node.textContent === ' '));

  return service;
}