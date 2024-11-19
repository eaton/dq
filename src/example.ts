import { processBook } from "./process-book.js";
import jetpack from "fs-jetpack";
import { parse as parsePath } from 'path';

for (const f of jetpack.find({ matching: './input/going*.epub' })) {
  await processBook(f, { root: `./output/${parsePath(f).name}` })
    .catch(err => {
      console.log(`Error processing ${f}`);
      console.log(err);
    });
}
