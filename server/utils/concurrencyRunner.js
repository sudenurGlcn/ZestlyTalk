/**
 * Basit concurrency runner. Maksimum 'limit' kadar task aynı anda çalışır.
 * tasks: () => Promise şeklinde fonksiyon dizisi
 * 
 * @param {Array<Function>} tasks - Promise dönen fonksiyon dizisi
 * @param {number} limit - Maksimum eşzamanlı çalışan task sayısı
 * @returns {Promise<Array>} - Tüm sonuçların array'i
 */
export async function runConcurrent(tasks, limit = 3) {
  const results = [];
  let index = 0;

  return new Promise((resolve, reject) => {
    let active = 0;

    function next() {
      if (index === tasks.length && active === 0) {
        resolve(results);
        return;
      }

      while (active < limit && index < tasks.length) {
        const currentIndex = index;
        const task = tasks[currentIndex];
        index++;
        active++;

        Promise.resolve()
          .then(() => task())
          .then(result => {
            results[currentIndex] = result;
          })
          .catch(err => {
            // Hataları burada loglayabilir veya farklı yönetebilirsin
            results[currentIndex] = { error: err.message || err };
          })
          .finally(() => {
            active--;
            next();
          });
      }
    }

    next();
  });
}
