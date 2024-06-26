import TurndownService from 'turndown';

export function abaFigures(service: TurndownService) {
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
        return `![${alt || ''}](${src} "${caption}")\n\n`;
      } else if (caption && !src) {
        return `![${alt || ''}](image/missing-image.png "${caption}")\n\n`;
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
        return `![${alt || ''}](${src} "${caption}")`;
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
        return `![${alt || ''}](${src} "${caption}")`;
      } else {
        return node.outerHTML;
      }
    }
  });

  // figure.figFrame
  //   div.figure img
  //   figcaption
  service.addRule('aba-figure-4', {
    filter: function (node) {
      const classAttr = node.getAttribute('class')
      return (
        (node.nodeName === 'FIGURE') &&
        (classAttr && classAttr.indexOf('figFrame') !== -1)
      )
    },
    replacement: function (content, node) {
      const img = node.firstChild?.firstChild;
      const src = img?.getAttribute && img?.getAttribute('src');
      const alt = img?.getAttribute && img?.getAttribute('alt');
      const caption = node.textContent;
      if (src && caption) {
        return `![${alt || ''}](${src} "${caption}")\n\n`;
      } else if (caption && !src) {
        return `![${alt || ''}](image/missing-image.png "${caption}")\n\n`;
      } else {
        return node.outerHTML;
      }
    }
  })
}

