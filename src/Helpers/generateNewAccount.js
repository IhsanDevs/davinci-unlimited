import fetch from "node-fetch";

/**
 * Fungsi untuk menghasilkan akun baru.
 *
 * Fungsi ini bertugas untuk menghasilkan token akses baru, token refresh, dan id token
 * dengan memanfaatkan API Google Identity Toolkit. Pertama, fungsi ini akan memanggil
 * `generateNewRefreshToken` untuk mendapatkan token refresh baru. Kemudian, menggunakan
 * token refresh tersebut untuk meminta token akses dan id token dari API Google.
 *
 * @returns {Promise<Object>} Objek yang berisi accessToken, refreshToken, dan idToken.
 * @throws {Error} Menangkap dan melempar kesalahan yang mungkin terjadi selama proses.
 */
const generateNewAccount = async () => {
  try {
    const refreshToken = await generateNewRefreshToken();
    const response = await fetch(
      "https://securetoken.googleapis.com/v1/token?key=AIzaSyA8z0UUOEpvq9n4BpLBCQUN1jaSZeKYxuM",
      {
        method: "POST",
        body: JSON.stringify({
          grantType: "refresh_token",
          refreshToken: refreshToken,
        }),
      }
    );
    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      idToken: data.id_token,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Dokumentasi Fungsi generateNewAccount
 *
 * Fungsi `generateNewAccount` adalah fungsi asinkron yang bertujuan untuk menghasilkan
 * akun baru dengan memanfaatkan API Google Identity Toolkit. Fungsi ini melakukan beberapa
 * langkah utama untuk mencapai tujuannya:
 *
 * 1. Memanggil fungsi `generateNewRefreshToken` untuk mendapatkan token refresh baru.
 *    Fungsi ini mengirim permintaan ke API Google untuk mendaftarkan pengguna baru dan
 *    mendapatkan token refresh sebagai respons.
 *
 * 2. Menggunakan token refresh yang diperoleh untuk meminta token akses dan id token
 *    dari API Google. Ini dilakukan dengan mengirim permintaan POST ke endpoint API
 *    Google dengan menyertakan token refresh dalam badan permintaan.
 *
 * 3. Mengembalikan objek yang berisi accessToken, refreshToken, dan idToken yang diperoleh
 *    dari respons API.
 *
 * Fungsi ini menggunakan `try-catch` untuk menangani kemungkinan kesalahan yang mungkin
 * terjadi selama proses permintaan. Jika terjadi kesalahan, fungsi akan mencetak kesalahan
 * ke konsol dan melempar kesalahan tersebut untuk ditangani oleh pemanggil fungsi.
 *
 * @returns {Promise<Object>} Objek Promise yang mengembalikan objek dengan properti
 *                            accessToken, refreshToken, dan idToken.
 * @throws {Error} Melempar kesalahan jika terjadi masalah selama pemanggilan API atau
 *                 proses lainnya.
 */
const generateNewRefreshToken = async () => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyA8z0UUOEpvq9n4BpLBCQUN1jaSZeKYxuM",
      {
        method: "POST",
        body: JSON.stringify({
          returnSecureToken: true,
        }),
      }
    );
    const data = await response.json();
    return data.refreshToken;
  } catch (error) {
    throw error;
  }
};

export default generateNewAccount;
