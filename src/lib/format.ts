export const formatAmount = (value: number) => value.toFixed(2);

export const formatDate = (value: string) => new Date(value).toLocaleString();
