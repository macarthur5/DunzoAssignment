type TNode<T> = {
  data: T;
  next: TNode<T> | null;
};

class Queue<T> {
  private _head: TNode<T> | null;
  private _tail: TNode<T> | null;

  constructor() {
    this._head = this._tail = null;
  }

  public push(value: T): void {
    if (this._tail === null) {
      this._head = this._tail = { data: value, next: null };
    } else {
      this._tail.next = { data: value, next: null };
      this._tail = this._tail.next;
    }
  }

  public pop(): T | null {
    let value: T | null = null;

    if (this._head) {
      value = this._head.data;
      this._head = this._head.next;

      if (!this._head) {
        this._head = this._tail = null;
      }
    }

    return value;
  }

  public front(): T | null {
    return this._head ? this._head.data : null;
  }
}

export default Queue;
