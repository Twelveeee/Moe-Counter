const DEFAULT_COUNT = 0;

export function createD1Store(db) {
  if (!db || typeof db.prepare !== "function") {
    throw new Error("D1 binding `DB` is missing or invalid");
  }

  return {
    async incrementAndGet(name) {
      const stmt = db.prepare(
        `INSERT INTO tb_count(name, num)
         VALUES (?1, 1)
         ON CONFLICT(name) DO UPDATE SET num = num + 1
         RETURNING name, num`
      );

      const row = await stmt.bind(name).first();
      if (!row) {
        return { name, num: DEFAULT_COUNT };
      }

      return { name: row.name, num: Number(row.num) };
    },

    async getNum(name) {
      const stmt = db.prepare("SELECT name, num FROM tb_count WHERE name = ?1");
      const row = await stmt.bind(name).first();

      if (!row) {
        return { name, num: DEFAULT_COUNT };
      }

      return { name: row.name, num: Number(row.num) };
    },
  };
}
