type Partition<TItem> = [TItem[], TItem[]];

export function arrayPartition<TItem>(
  array: TItem[],
  predicate: (item: TItem) => boolean
): Partition<TItem> {
  return array.reduce(
    (pair: Partition<TItem>, item) => {
      (predicate(item) ? pair[0] : pair[1]).push(item);
      return pair;
    },
    [[], []]
  );
}
