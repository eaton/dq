import test from 'ava';
import { parseMeta } from '../src/parse-meta.js';

test('parse cs metadata', async t => {
  const file = './test/fixtures/content-strategy.epub';

  const metadata = await parseMeta(file);
  t.not(metadata, undefined);
  t.is(metadata.title, 'Content Strategy for Mobile');
  t.is(metadata.creator, 'Karen McGrane');
});

test('parse ip contents', async t => {
  const file = './test/fixtures/image-performance.epub';
  const metadata = await parseMeta(file);

  t.not(metadata, undefined);
  t.is(metadata.title, 'Image Performance');
});