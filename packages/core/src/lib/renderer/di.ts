import { createInjectionToken } from '../utils/di';

export const [injectNgtCompoundPrefixes, provideNgtCompoundPrefixes] = createInjectionToken<string[]>(
    'NgtRenderer compound prefixes'
);
