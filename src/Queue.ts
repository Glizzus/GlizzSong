export default class Queue<T> {
  array: Array<T>;

  constructor() {
    this.array = [];
  }

  enqueue(item: T) {
    this.array.push(item);
  }

  dequeue() {
    return this.array.shift()!;
  }

  empty() {
    return this.array.length === 0;
  }
}