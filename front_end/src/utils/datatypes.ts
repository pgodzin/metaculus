// Generic Minified Response Type

// Generic Minified Response Type
export type MinifiedResponse<T> = {
  columns: (keyof T)[];
  rows: (T[keyof T] | null)[][];
};

// Function to convert minified response back to original type
export function convertMinifiedToOriginal<T>(
  minified: MinifiedResponse<T>
): T[] {
  return minified.rows.map((row) => {
    const result = {} as T;

    minified.columns.forEach((column, index) => {
      // Assign each value in row to the corresponding column based on index
      result[column] = row[index] as T[typeof column];
    });

    return result;
  });
}
