import test from 'ava';
import { parseToc } from '../src/parse-toc.js';
import jetpack
  from 'fs-jetpack';
test('list ebook contents', async t => {
  const file = './test/fixtures/content-strategy.epub';
  
  const toc = await parseToc(file);
  t.not(toc, undefined);
  jetpack.write('./output/toc.json', toc);
});