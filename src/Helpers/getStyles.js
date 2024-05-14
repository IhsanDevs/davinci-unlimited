import fetch from "node-fetch";

/**
 * Dokumentasi Fungsi getStyles
 *
 * Fungsi `getStyles` adalah fungsi asinkron yang bertujuan untuk mengambil gaya dari API.
 * Fungsi ini mengirimkan permintaan ke API dengan menggunakan token Bearer yang diberikan.
 * Jika permintaan berhasil, fungsi akan mengembalikan objek yang berisi gaya utama dan sub-gaya
 * yang diperoleh dari respons API.
 *
 * @param {string} BearerToken Token Bearer untuk autentikasi permintaan.
 * @returns {Promise<Object>} Promise yang mengembalikan objek dengan properti mainStyles dan subStyles.
 * @throws {Error} Menangkap dan melempar kesalahan yang mungkin terjadi selama proses.
 */
const getStyles = async (BearerToken) => {
  try {
    const response = await fetch("https://api.davinci.ai/asset/v2/styles", {
      headers: {
        Authorization: `Bearer ${BearerToken}`,
      },
    });

    const data = await response.json();

    const code = data.code; // integer
    const success = data.success; // boolean
    const mainData = data.data; // object

    if (code !== 200 || !success) {
      console.error(data);
      throw new Error("Failed to fetch styles");
    }

    return {
      mainStyles: mainData.main,
      subStyles: mainData.sub,
    };
  } catch (error) {
    throw error;
  }
};

export default getStyles;
