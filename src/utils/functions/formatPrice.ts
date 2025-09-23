/**
 * Formate un prix en ajoutant des séparateurs de milliers.
 * @param value number | string
 * @returns string formatée (ex: "12 000")
 */

export function formatPrice(value: number | string): string {
    if (value === null || value === undefined) return "";
    const num = typeof value === "string" ? Number(value.replace(/\s/g, "")) : value;
    if (isNaN(num)) return "";
    return num.toLocaleString("fr-FR");
}