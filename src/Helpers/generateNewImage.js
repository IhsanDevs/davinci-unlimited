import fetch from "node-fetch";
import fs from "fs-extra";

/**
 * Fungsi untuk menghasilkan gambar baru berdasarkan prompt dan gaya yang diberikan.
 *
 * @param {string} bearerToken Token untuk autentikasi API.
 * @param {string} prompt Deskripsi singkat tentang gambar yang ingin dihasilkan.
 * @param {string} ascpect Aspect dari gambar. Default adalah "square".
 * @param {string} style Gaya utama untuk gambar.
 * @param {Array} substyles Sub-gaya untuk gambar.
 * @param {number} seed Seed untuk randomisasi.
 * @param {number} step Jumlah langkah untuk proses generasi. Default adalah 30.
 * @param {string|null} customImageToPath Path ke gambar kustom yang akan digunakan sebagai dasar. Default adalah null.
 * @returns {Promise<Object>} Objek yang berisi informasi tentang gambar yang dihasilkan.
 * @throws {Error} Jika terjadi kesalahan dalam proses generasi gambar.
 */
const generateNewImage = async (
  bearerToken,
  prompt,
  ascpect = "square",
  style,
  substyles,
  seed,
  step = 30,
  customImageToPath = null
) => {
  let bodyData = {};
  if (customImageToPath) {
    try {
      if (!fs.existsSync(customImageToPath)) {
        throw new Error("Path gambar tidak ditemukan");
      }
      bodyData = { file: fs.createReadStream(customImageToPath) };
    } catch (error) {
      throw error;
    }
  }

  if (!["square", "horizontal", "vertical"].includes(ascpect)) {
    throw new Error(
      "Aspect harus salah satu dari: square, horizontal, vertical"
    );
  }
  if (!bearerToken) {
    throw new Error("Token tidak boleh kosong");
  }
  if (!prompt) {
    throw new Error("Prompt tidak boleh kosong");
  }
  if (style && typeof style !== "string") {
    throw new Error("Style harus berupa string");
  }
  if (substyles && !Array.isArray(substyles)) {
    throw new Error("Substyles harus berupa array");
  }
  if (seed && (typeof seed !== "number" || seed < 1 || seed > 3778053252)) {
    throw new Error("Seed harus berupa angka antara 1 dan 3778053252");
  }
  if (typeof step !== "number" || step < 1 || step > 50) {
    throw new Error("Step harus berupa angka antara 1 dan 50");
  }

  const queryParams = new URLSearchParams({
    prompt,
    aspect: ascpect, // horizontal || vertical || square
    style: style,
    substyles: substyles.join(","), // substyles id
    cfg: 11, // min: 1, max: 11
    seed: seed, // min: 1, max: 3778053252
    step, // min: 1, max: 50
    variant: "A",
  }).toString();

  try {
    const response = await fetch(
      `https://api.davinci.ai/publisher/v2/process/?${queryParams}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          ...(!customImageToPath && { "Content-Type": "application/json" }),
        },
        body: customImageToPath ? bodyData : JSON.stringify(bodyData),
      }
    );
    const data = await response.json();
    if (!data.success || data.code !== 200) {
      console.error(data);
      throw new Error("Gagal mendapatkan gambar baru");
    }
    while (true) {
      const statusResponse = await getResult(data.data.id, bearerToken);
      if (statusResponse.status === "COMPLETED") {
        return {
          url: statusResponse.url,
        };
      } else if (statusResponse.status === "PROCCESSING") {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Tunggu 5 detik sebelum cek status lagi
      } else {
        throw new Error("Gagal memproses gambar");
      }
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Fungsi untuk menghasilkan gambar baru berdasarkan parameter yang diberikan.
 *
 * @param {string} bearerToken Token untuk autentikasi API.
 * @param {string} prompt Teks yang akan digunakan sebagai inspirasi dalam pembuatan gambar.
 * @param {string} [style="Magical Portrait"] Gaya utama dari gambar yang akan dihasilkan.
 * @param {Array<string>} [substyles=[]] Sub-gaya yang akan digunakan bersamaan dengan gaya utama.
 * @param {number} [seed] Sebuah angka yang digunakan untuk menginisialisasi generator angka acak.
 * @param {number} [step=1] Jumlah langkah yang akan dilakukan dalam proses generasi gambar.
 * @param {boolean} [customImageToPath=false] Apakah menggunakan gambar kustom sebagai path.
 * @param {Object} [bodyData={}] Data tambahan yang akan dikirim dalam body request.
 *
 * @returns {Promise<Object>} Objek yang berisi ID dari gambar yang berhasil dihasilkan.
 *
 * @throws {Error} Akan melempar error jika terjadi kesalahan dalam proses request atau parameter tidak sesuai.
 */
const getResult = async (id, bearerToken) => {
  try {
    const response = await fetch(
      `https://api.davinci.ai/result/v2/status?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    const data = await response.json();
    if (!data.success || data.code !== 200) {
      throw new Error("Gagal mendapatkan status proses");
    }
    if (data.data.status === "COMPLETED") {
      return {
        status: "COMPLETED",
        url: data.data.url[0],
      };
    } else if (data.data.status === "PROCCESSING") {
      return {
        status: "PROCCESSING",
        url: null,
      };
    } else {
      console.error(data, data.data.status);
      throw new Error("Status proses tidak diketahui");
    }
  } catch (error) {
    throw error;
  }
};

export default generateNewImage;
