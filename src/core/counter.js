export async function getCountByName({ store, name, num }) {
  if (name === "demo") {
    return { name, num: "0123456789" };
  }

  if (num > 0) {
    return { name, num };
  }

  return store.incrementAndGet(name);
}
