export function generateSlug(name: string): string {
    const generatedfourdigitnumber = Math.floor(1000 + Math.random() * 9000).toString();
    return name
      .normalize('NFD')                     // separa acentos
      .replace(/[\u0300-\u036f]/g, '')      // remove acentos
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')         // remove caracteres especiais
      .replace(/\s+/g, '-')                 // espaços por hífen
      .replace(/-+/g, '-') + generatedfourdigitnumber                 // remove hífens duplicados
  }
  