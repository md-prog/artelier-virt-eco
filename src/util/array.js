import slice from "lodash/slice";
import isUndefined from "lodash/isUndefined";
import sortedIndexBy from "lodash/sortedIndexBy";
import concat from "lodash/concat";

export function insert(array, item, index) {
    const length = array == null ? 0 : array.length;
    const itemIndex = index == null ? length : parseInt(index);
    return !isUndefined(item)
        ? concat(slice(array, 0, itemIndex), item, slice(array, itemIndex))
        : array;
}

export function insertSorted(array, item, comparator) {
    const index = sortedIndexBy(array, item, comparator);
    return insert(array, item, index);
}
