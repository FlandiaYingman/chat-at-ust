// HKD to USD rate. For reference only.
const RATE = 7.8;

function toUSD(hkd: number): number {
  return hkd / RATE;
}

function toHKD(usd: number): number {
  return usd * RATE;
}

function usd(amount: number): string {
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
  });
}

function hkd(amount: number): string {
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: "HKD",
    minimumFractionDigits: 4,
  });
}

export function formatHKD(amount: number): string {
  return `${hkd(amount)} (~${usd(toUSD(amount))})`;
}

export function formatUSD(amount: number): string {
  return `${usd(amount)} (~${hkd(toHKD(amount))})`;
}
