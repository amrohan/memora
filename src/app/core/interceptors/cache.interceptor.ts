import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface CacheEntry {
  url: string;
  response: HttpResponse<any>;
  addedTime: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 300000;

export const CachingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<any> => {
  const { method, urlWithParams } = req;
  const normalizedUrl = normalizeUrl(urlWithParams);

  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const baseUrlsToInvalidate = [
      `${environment.API_URL}/collections`,
      `${environment.API_URL}/bookmarks`,
      `${environment.API_URL}/tags`,
      `${environment.API_URL}/user`,
    ];
    invalidateCacheByPrefixes(baseUrlsToInvalidate);
    return next(req);
  }

  if (method === 'GET') {
    const cached = cache.get(normalizedUrl);
    if (cached) {
      const isExpired = Date.now() - cached.addedTime > CACHE_TTL;
      if (!isExpired) {
        return of(cached.response.clone());
      } else {
        cache.delete(normalizedUrl);
      }
    }

    return next(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          cache.set(normalizedUrl, {
            url: normalizedUrl,
            response: event.clone(),
            addedTime: Date.now(),
          });
        }
      }),
    );
  }

  return next(req);
};

function invalidateCacheByPrefixes(prefixes: string[]): void {
  for (const key of cache.keys()) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      cache.delete(key);
    }
  }
}

function normalizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    parsedUrl.searchParams.sort();
    return parsedUrl.toString();
  } catch {
    return url;
  }
}
