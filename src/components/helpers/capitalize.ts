export function capitalize(texto: string) {
    return texto.charAt(0).toUpperCase() + texto.slice(1) || "";
}