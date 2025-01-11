export function initials(fullName: string): string {
    return fullName
        .split(" ")
        .map((name) => name[0])
        .join("");
}