import test from 'ava';
import { getCoverColor } from '../src/get-cover-color.js';

test('get cs color', async t => {
  const file = './test/fixtures/content-strategy.epub';
  const color = await getCoverColor(file);

  t.not(color, undefined);
  t.deepEqual(color, { a: 255, r: 59, b: 156, g: 126 });
});


test('get ip color', async t => {
  const file = './test/fixtures/image-performance.epub';
  const color = await getCoverColor(file);

  t.not(color, undefined);
  t.deepEqual(color, { a: 255, r: 241, b: 110, g: 109 });
});

test('get ip in hex', async t => {
  const file = './test/fixtures/image-performance.epub';
  const color = await getCoverColor(file, 'hex');

  t.not(color, undefined);
  t.deepEqual(color, '#f16d6e');
});