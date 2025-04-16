export function generateSlug(name: string): string {
    return name
      .normalize('NFD')                     // separa acentos
      .replace(/[\u0300-\u036f]/g, '')      // remove acentos
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')         // remove caracteres especiais
      .replace(/\s+/g, '-')                 // espaços por hífen
      .replace(/-+/g, '-');                 // remove hífens duplicados
  }
  