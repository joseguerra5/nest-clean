import { WatchedList } from "./watched-list";

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b;
  }
}

describe("WatchedList", () => {
  it("Shoud be abble to create a watched list with initial items", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    expect(list.currentItems).toHaveLength(3);
  })

  it("Shoud be abble to add new items to the list", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.add(4);
    expect(list.currentItems).toHaveLength(4);
    expect(list.getNewItems()).toEqual([4]);
  })

  it("Shoud be abble to add an item even if it was removed before", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.remove(2);
    list.add(2);

    expect(list.currentItems).toHaveLength(3);
    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([]);

  })

  it("Shoud be abble to add an item even if it was added before", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.add(4);
    list.remove(4);

    expect(list.currentItems).toHaveLength(3);
    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([]);

  })

  it("Shoud be abble to update watched list items", () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.update([1, 3, 5]);

    expect(list.currentItems).toHaveLength(3);
    expect(list.getRemovedItems()).toEqual([2]);
    expect(list.getNewItems()).toEqual([5]);

  })
});