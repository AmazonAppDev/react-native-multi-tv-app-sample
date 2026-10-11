export type FocusDirection = 'up' | 'down' | 'left' | 'right';

export interface TVRemoteFocusOptions {
  columns: number;
  rows: number;
  loop?: boolean;
}

function normalizeCount(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function normalizeDimension(value: number): number {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
}

export function clampFocusIndex(index: number, itemCount: number): number {
  const count = normalizeCount(itemCount);

  if (count === 0) {
    return -1;
  }

  const normalizedIndex = Number.isFinite(index) ? Math.floor(index) : 0;
  return Math.min(Math.max(normalizedIndex, 0), count - 1);
}

export function getNextFocusIndex(
  currentIndex: number,
  direction: FocusDirection,
  itemCount: number,
  options: TVRemoteFocusOptions,
): number {
  const count = normalizeCount(itemCount);
  if (count === 0) {
    return -1;
  }

  const index = clampFocusIndex(currentIndex, count);
  const columns = normalizeDimension(options.columns);
  const rows = Math.max(normalizeDimension(options.rows), Math.ceil(count / columns));

  if (direction === 'left' || direction === 'right') {
    const column = index % columns;
    if (
      !options.loop &&
      ((direction === 'left' && column === 0) || (direction === 'right' && column === columns - 1))
    ) {
      return index;
    }

    const nextIndex = index + (direction === 'right' ? 1 : -1);
    if (options.loop) {
      return (nextIndex + count) % count;
    }
    return clampFocusIndex(nextIndex, count);
  }

  const column = index % columns;
  const currentRow = Math.floor(index / columns);
  const rowDelta = direction === 'down' ? 1 : -1;
  let nextRow = currentRow + rowDelta;

  for (let attempt = 0; attempt < rows; attempt += 1) {
    if (options.loop) {
      nextRow = (nextRow + rows) % rows;
    } else if (nextRow < 0 || nextRow >= rows) {
      return index;
    }

    const nextIndex = nextRow * columns + column;
    if (nextIndex < count) {
      return nextIndex;
    }

    nextRow += rowDelta;
  }

  return index;
}
