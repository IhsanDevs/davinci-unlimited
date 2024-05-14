import fetch from "node-fetch";

/**
 * Fungsi untuk mendapatkan inspirasi.
 *
 * Fungsi ini bertugas untuk mengambil judul inspirasi dari API. Fungsi ini akan mengirimkan
 * permintaan ke API dengan menggunakan token Bearer yang diberikan. Jika permintaan berhasil,
 * fungsi akan mengembalikan judul inspirasi yang diperoleh dari respons API.
 *
 * @param {string} BearerToken Token Bearer untuk autentikasi permintaan.
 * @returns {Promise<string>} Promise yang mengembalikan judul inspirasi.
 * @throws {Error} Menangkap dan melempar kesalahan yang mungkin terjadi selama proses.
 */
const getInspiration = async (BearerToken) => {
  try {
    const response = await fetch(
      "https://api.davinci.ai/asset/prompts/inspiration",
      {
        headers: {
          Authorization: `Bearer ${BearerToken}`,
        },
      }
    );

    const data = await response.json();
    const code = data.code; // integer
    const success = data.success; // boolean

    if (code !== 200 || !success) {
      console.error(data);
      throw new Error("Failed to fetch inspiration");
    }

    return data.data.title;
  } catch (error) {
    throw error;
  }
};

export default getInspiration;
