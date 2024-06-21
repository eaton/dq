import wretch from 'wretch';
import { WretchError } from 'wretch/resolver';

export type LinkStatus = {
  url: string,
  redirected?: string,
  status?: number,
  statusText?: string | undefined,
  checked?: Date,
};

export async function expandLinks(links: LinkStatus[]): Promise<LinkStatus[]> {
  return links;
}

export async function expand(url: string): Promise<LinkStatus> {
  const parsed = new URL(url);
  parsed.protocol = 'https:';

  return await wretch(url)
    .get()
    .notFound(r => ({
      url,
      redirected: r.url,
      status: r.status,
      statusText: r.response?.statusText ?? 'not found',
    }))
    .unauthorized(r => ({
      url,
      redirected: r.url,
      status: r.status,
      statusText: r.response?.statusText ?? 'unauthorized',
    }))
    .forbidden(r => ({
      url,
      redirected: r.url,
      status: r.status,
      statusText: r.response?.statusText ?? 'forbidden',
    }))
    .timeout(r => ({
      url,
      redirected: r.url,
      status: r.status,
      statusText: r.response?.statusText ?? 'timeout',
    }))
    .fetchError((err: WretchError) => {
      return {
        url,
        redirected: err.response?.url ? err.response.url : err.url,
        status: err.response?.status ? err.response?.status : err.status,
        statusText: err.response?.statusText ? err.response.statusText : err.text ?? err.message,
      }
    })
    .res(r => ({
      url,
      redirected: r.url,
      status: r.status,
      statusText: r.statusText
    }))
    .catch((err: WretchError) => {
      return {
        url,
        redirected: err.response?.url ? err.response.url : err.url,
        status: err.response?.status ? err.response?.status : err.status,
        statusText: err.response?.statusText ? err.response.statusText : err.text ?? err.message,
      }
    });
}