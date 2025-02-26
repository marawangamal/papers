export const getStringList = (value?: string | string[] | undefined) => {
    if (!value) return [];
    return typeof value === "string" ? [value] : value;
};
