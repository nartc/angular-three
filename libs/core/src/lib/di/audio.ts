import { createRefInjection } from '../utils/inject';
import { provideObjectRef } from './object';

export const [
  injectCommonAudioRef,
  provideCommonAudioRef,
  NGT_COMMON_AUDIO_REF,
] = createRefInjection('NgtCommonAudio ref', provideObjectRef);
