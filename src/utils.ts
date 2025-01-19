export function capitalizeFirst(char: string) {
    if (!char) return '';
    return char[0].toUpperCase() + char.slice(1);
}