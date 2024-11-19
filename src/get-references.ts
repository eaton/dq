import * as cheerio from 'cheerio';
import { ChapterData } from './get-chapter.js';

// Takes a book, searches for its 'references' chapter,
// returns a dictionary of reference IDs and destination URLs.
//
// Later, we can use those to fix ABA redirect links.

export function getReferences(markup: string) {
  const $ = cheerio.load(markup);
  const data = $.extract({
    links: [{
      selector: 'p.Reference',
      value: {
        id: { selector: 'span.ReferenceNumber', value: 'innerText' },
        url: { selector: 'a', value: 'href' },
      }
    }]
  });

  const links = Object.fromEntries(data.links.map(l => ([
    l.id?.trim() ?? '00-00',
    l.url?.trim() ?? '',
  ])));

  return links;
}
