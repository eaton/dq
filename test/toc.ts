import test from 'ava';
import { parseToc } from '../src/parse-toc.js';

test('parse table of contents', async t => {
  const file = './test/fixtures/content-strategy.epub';
  
  const toc = await parseToc(file);
  t.not(toc, undefined);
  t.deepEqual(toc[0],   {
    "id": "navpoint1",
    "playOrder": 1,
    "navLabel": "Foreword",
    "content": "foreword.xhtml"
  });
});