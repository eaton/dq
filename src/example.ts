import { processBook } from "./process-book.js";

await processBook('./test/fixtures/content-strategy.epub', { root: './output/strategy'});
await processBook('./test/fixtures/going-responsive.epub', { root: './output/responsive'});
await processBook('./test/fixtures/image-performance.epub', { root: './output/images'});