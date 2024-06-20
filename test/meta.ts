import test from 'ava';
import { parseMeta } from '../src/parse-meta.js';

test('list ebook contents', async t => {
  const file = './test/fixtures/content-strategy.epub';
  
  const metadata = await parseMeta(file);
  t.not(metadata, undefined);

  t.log(metadata);
});