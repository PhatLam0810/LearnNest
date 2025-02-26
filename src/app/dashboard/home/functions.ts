export const splitData = <T>(array: T[], numOfCol: number = 2) => {
  const arr: T[][] = Array.from({ length: numOfCol }, () => []);
  array.forEach((item, index) => {
    const colIndex = index % numOfCol; // Xác định cột cần thêm
    arr[colIndex].push(item);
  });
  return arr;
};
