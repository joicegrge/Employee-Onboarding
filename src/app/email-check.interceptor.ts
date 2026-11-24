import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';

const existingEmails = new Set(['admin@company.com', 'hr@company.com']);

export const emailCheckInterceptor: HttpInterceptorFn = (request, next) => {
  const url = new URL(request.urlWithParams, 'http://localhost');

  if (request.method !== 'GET' || url.pathname !== '/api/check-email') {
    return next(request);
  }

  const email = url.searchParams.get('email') ?? '';
  const exists = existingEmails.has(email);

  return of(new HttpResponse<{ exists: boolean }>({ body: { exists } })).pipe(delay(800));
};
