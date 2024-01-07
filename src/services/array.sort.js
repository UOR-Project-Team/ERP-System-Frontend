// sortingService.js

export const sortArray = (arr, primaryAttr, secondaryAttr) => {
    return arr.sort((a, b) => {
        // Compare by the primary attribute
        const primaryComparison = a[primaryAttr].localeCompare(b[primaryAttr]);

        // If primary attribute is the same, compare by the secondary attribute (ID in this case)
        if (primaryComparison === 0) {
        return a[secondaryAttr] - b[secondaryAttr];
        }

        return primaryComparison;
    });
};
  