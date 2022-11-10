import { Injectable } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { map, of, timer } from 'rxjs';
import { NgtComponentStore } from './component-store';

@Injectable()
class Store extends NgtComponentStore {}

describe(NgtComponentStore.name, () => {
  function setup(initialState: Record<string, unknown> = {}) {
    const store = new Store();
    store.set(initialState);
    return { store };
  }

  it('should be created', () => {
    const { store } = setup({ init: true });
    const spy = subscribeSpyTo(store.select());
    expect(store).toBeTruthy();
    expect(spy.getValues()).toEqual([{ init: true }]);
  });

  describe('set', () => {
    let store: Store;
    let spy: SubscriberSpy<any>;

    beforeEach(() => {
      const result = setup({ init: 1, foo: 'bar' });
      store = result.store;
      spy = subscribeSpyTo(store.select());
    });

    it('should set the whole state', () => {
      store.set({ init: 2, foo: 'baz' });
      expect(spy.getValues()).toEqual([
        { init: 1, foo: 'bar' },
        { init: 2, foo: 'baz' },
      ]);
    });

    it('should set partial state', () => {
      store.set({ init: 2 });
      expect(spy.getValues()).toEqual([
        { init: 1, foo: 'bar' },
        { init: 2, foo: 'bar' },
      ]);
    });

    it('should set state based on previous state', () => {
      store.set((state) => ({ init: state.init + 10 }));
      expect(spy.getValues()).toEqual([
        { init: 1, foo: 'bar' },
        { init: 11, foo: 'bar' },
      ]);
    });

    it('should set state with synchronous observable of state', () => {
      store.set(of({ init: 2 }));
      expect(spy.getValues()).toEqual([
        { init: 1, foo: 'bar' },
        { init: 2, foo: 'bar' },
      ]);
    });

    it('should set state with async observable', fakeAsync(() => {
      store.set(timer(100).pipe(map(() => ({ init: 2 }))));
      expect(spy.getValues()).toEqual([{ init: 1, foo: 'bar' }]);
      tick(150);
      expect(spy.getValues()).toEqual([
        { init: 1, foo: 'bar' },
        { init: 2, foo: 'bar' },
      ]);
    }));

    it('should set state with an observable based on previous state', () => {
      store.set((state) => of({ init: state.init + 10 }));
      expect(spy.getValues()).toEqual([
        { init: 1, foo: 'bar' },
        { init: 11, foo: 'bar' },
      ]);
    });
  });
});
