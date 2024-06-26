import TurndownService from 'turndown';

export function abaNobrSpans(service: TurndownService) {
  service.addRule('nobreak spans', {
    filter: function (node) {
      return (
        (node.nodeName === 'SPAN') &&
        (node.getAttribute('class') === 'NoBreak')
      )
    },
    replacement: (content) => content.trim(),
  })
}

