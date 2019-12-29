export function createPromise<T = void>(): [Promise<T>, (r: T) => void, (e: any) => void] {
  let resolve: (r: T) => void;
  let reject: (e: string | Error) => void;
  const prom: Promise<T> = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return [prom, resolve!, reject!];
}
