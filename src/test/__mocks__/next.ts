export class NextResponse {
  static json<T>(data: T, init?: ResponseInit) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...init?.headers,
      },
    });
  }
}

export function headers() {
  return new Map([['authorization', 'Bearer test-key']]);
}