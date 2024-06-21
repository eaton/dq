import wretch from 'wretch';
import pSettle from 'p-settle';
import * as cheerio from 'cheerio';
import { WretchError } from 'wretch/resolver';

export type LinkStatus = {
  requested: string,
  redirected: string,
  status: number,
  statusText?: string | undefined
};

export async function expandLinks(xhtml: string): Promise<LinkStatus[]> {
  const $ = cheerio.load(xhtml);
  const links = new Map<string, string | undefined>();
  $('a[href]').each((i, link) => {
    const href = $(link).attr('href');
    if (href) links.set(href, undefined);
  });

  const promises: Promise<LinkStatus>[] = [];
  for (const url of links.keys()) {
    if (url.includes('bkaprt.com')) {
      promises.push(expand(url));
    }
  }
  const output: LinkStatus[] = [];
  for (const r of await pSettle(promises, { concurrency: 1 })) {
    if (r.isFulfilled) output.push(r.value)
  }
  return output;
}

async function expand(url: string): Promise<LinkStatus> {
  const parsed = new URL(url);
  parsed.protocol = 'https:';

  return await wretch(url)
    .get()
    .notFound(r => ({
      requested: url,
      redirected: r.url,
      status: r.status,
      statusText: r.response?.statusText ?? 'not found',
    }))
    .unauthorized(r => ({
      requested: url,
      redirected: r.url,
      status: r.status,
      statusText: r.response?.statusText ?? 'unauthorized',
    }))
    .forbidden(r => ({
      requested: url,
      redirected: r.url,
      status: r.status,
      statusText: r.response?.statusText ?? 'forbidden',
    }))
    .timeout(r => ({
      requested: url,
      redirected: r.url,
      status: r.status,
      statusText: r.response?.statusText ?? 'timeout',
    }))
    .fetchError((err: WretchError) => {
      return {
        requested: url,
        redirected: err.response?.url ? err.response.url : err.url,
        status: err.response?.status ? err.response?.status : err.status,
        statusText: err.response?.statusText ? err.response.statusText : err.text ?? err.message,
      }
    })
    .res(r => ({
      requested: url,
      redirected: r.url,
      status: r.status,
      statusText: r.statusText
    }))
    .catch((err: WretchError) => {
      return {
        requested: url,
        redirected: err.response?.url ? err.response.url : err.url,
        status: err.response?.status ? err.response?.status : err.status,
        statusText: err.response?.statusText ? err.response.statusText : err.text ?? err.message,
      }
    });
}