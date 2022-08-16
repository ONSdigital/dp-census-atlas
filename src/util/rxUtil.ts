// let's not install svelte-rx - it's a tiny package
import { BehaviorSubject } from "rxjs";

/** Use Svelte's `set` instead of Rxjs's `next`.
 * https://github.com/ReactiveX/rxjs/issues/4740#issuecomment-490601347
 */
export class SvelteSubject<T> extends BehaviorSubject<T> {
  set(value: T) {
    super.next(value);
  }
}
