import getInspiration from "./getInsipartion.js";
import getStyles from "./getStyles.js";
import generateNewAccount from "./generateNewAccount.js";
import generateNewImage from "./generateNewImage.js";

/**
 * Dokumentasi untuk DavinciUnlimited
 *
 * Objek DavinciUnlimited ini merupakan kumpulan dari beberapa fungsi yang membantu dalam proses
 * pengambilan inspirasi, gaya, pembuatan akun baru, dan generasi gambar baru. Setiap fungsi
 * memiliki tujuan spesifik dan dapat digunakan secara independen berdasarkan kebutuhan.
 *
 * Fungsi yang tersedia:
 * - getInspiration: Fungsi untuk mendapatkan judul inspirasi dari API.
 * - getStyles: Fungsi untuk mengambil gaya dari API.
 * - generateNewAccount: Fungsi untuk menghasilkan akun baru dengan token akses, token refresh, dan id token.
 * - generateNewImage: Fungsi untuk menghasilkan gambar baru berdasarkan prompt dan gaya yang diberikan.
 *
 * Cara menggunakan:
 * Untuk menggunakan salah satu fungsi, cukup impor objek DavinciUnlimited dan panggil fungsi yang diinginkan.
 * Contoh:
 * ```
 * import DavinciUnlimited from './DavinciUnlimited/index.js';
 *
 * // Untuk mendapatkan inspirasi
 * const inspiration = await DavinciUnlimited.getInspiration(bearerToken);
 *
 * // Untuk mendapatkan gaya
 * const styles = await DavinciUnlimited.getStyles(bearerToken);
 *
 * // Untuk menghasilkan akun baru
 * const account = await DavinciUnlimited.generateNewAccount();
 *
 * // Untuk menghasilkan gambar baru
 * const image = await DavinciUnlimited.generateNewImage(bearerToken, prompt, aspect, style, substyles, seed, step, customImageToPath);
 * ```
 *
 * Pastikan untuk mengganti parameter yang diperlukan sesuai dengan kebutuhan.
 */
const DavinciUnlimited = {
  getInspiration,
  getStyles,
  generateNewAccount,
  generateNewImage,
};

export default DavinciUnlimited;
