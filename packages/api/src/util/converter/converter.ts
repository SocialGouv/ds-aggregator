export const asTimestamp = (dateUTC?: string) => {
  if (dateUTC) {
    return new Date(dateUTC).getTime();
  }
  return null;
};

export const asArray = (args: string) => {
  if (args === undefined || args == null) {
    return [];
  }
  args = args.trim();
  return args.split(",").map((val: string) => val.trim());
};

export const asNumber = (args: string | undefined, defaultValue: number) => {
  if (args == null || args === undefined) {
    return defaultValue;
  }
  return Number.parseInt(args, 10);
};
