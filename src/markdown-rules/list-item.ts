import TurndownService from 'turndown';

export function noIndentListItem(service: TurndownService) {
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
      if (parent?.nodeName === 'OL') {
        const start = parent.getAttribute('start')
        const index = Array.prototype.indexOf.call(parent.children, node)
        prefix = (start ? Number(start) + index : index + 1) + '. '
      }
      return (
        prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
      )
    }
  });
}

