function checkValid(n: number): void {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("n must be a non-negative number");
  }
}

export function sum_to_n_a(n: number): number {
  checkValid(n);
  let sum = 0;
  for (let i = 0; i <= n; i++) sum += i;
  return sum;
}

export function sum_to_n_b(n: number): number {
  checkValid(n);
  const sumOfAPair = n + 1;
  const countPairs = n / 2;
  return sumOfAPair * countPairs;
}

export function sum_to_n_c(n: number): number {
  checkValid(n);
  let sum = 0;
  let left = 1;
  let right = n;
  while (left < right) {
    sum += left + right;
    left++;
    right--;
  }
  if (left === right) sum += left;
  return sum;
}
