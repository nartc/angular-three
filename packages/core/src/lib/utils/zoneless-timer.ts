import {
  cancelAnimationFrame,
  clearTimeout,
  requestAnimationFrame,
  setTimeout,
} from '@rx-angular/cdk/zone-less';

export const zonelessRequestAnimationFrame = requestAnimationFrame;
export const zonelessCancelAnimationFrame = cancelAnimationFrame;

export type RafId = ReturnType<typeof zonelessRequestAnimationFrame>;

export const zonelessSetTimeout = setTimeout;
export const zonelessClearTimeout = clearTimeout;

export type TimeoutId = ReturnType<typeof zonelessSetTimeout>;
