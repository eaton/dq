import test from 'ava';
import { getToc } from '../src/get-toc.js';

test('parse cs toc', async t => {
  const file = './test/fixtures/content-strategy.epub';
  
  const toc = await getToc(file);
  t.not(toc, undefined);
  t.deepEqual(toc[0],   {
    "id": "navpoint1",
    "playOrder": 1,
    "navLabel": "Foreword",
    "content": "foreword.xhtml"
  });
});

test('parse ip toc', async t => {
  const file = './test/fixtures/image-performance.epub';
  const toc = await getToc(file);

  t.not(toc, undefined);
  t.deepEqual(toc[0],   {
    content: 'cover.xhtml',
    id: 'navpoint12',
    navLabel: 'Cover',
    playOrder: 12
  });
});