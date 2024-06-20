import test from 'ava';
import { parseMeta } from '../src/parse-meta.js';
import jetpack from 'fs-jetpack';

test('list ebook contents', async t => {
  const file = './test/fixtures/content-strategy.epub';
  
  const metadata = await parseMeta(file);
  t.not(metadata, undefined);

  jetpack.write('./output/metadata.json', metadata);
});