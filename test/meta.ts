import test from 'ava';
import { parseMeta } from '../src/parse-meta.js';

test('parse book metadata', async t => {
  const file = './test/fixtures/content-strategy.epub';
  
  const metadata = await parseMeta(file);
  t.is(metadata.title, 'Content Strategy for Mobile');
  t.is(metadata.creator, 'Karen McGrane');
  t.not(metadata, undefined);
});