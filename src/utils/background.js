function database() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("persona-appearance", 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("background");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function backgroundFile(file) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      "background",
      file === undefined ? "readonly" : "readwrite",
    );
    const store = transaction.objectStore("background");
    const request =
      file === undefined
        ? store.get("image")
        : file === null
          ? store.delete("image")
          : store.put(file, "image");
    transaction.oncomplete = () => {
      db.close();
      resolve(request.result);
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
    transaction.onabort = () => {
      db.close();
      reject(transaction.error);
    };
  });
}
