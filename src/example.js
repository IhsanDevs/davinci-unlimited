import Helpers from "./Helpers/index.js"; // Mengimpor modul Helpers
import ora from "ora"; // Mengimpor modul ora
import chalk from "chalk"; // Mengimpor modul chalk
import fs from "fs-extra"; // Mengimpor modul fs-extra
import fetch from "node-fetch"; // Mengimpor modul node-fetch
import { exec, spawn } from "child_process"; // Mengimpor modul child_process

const davinciUnlimited = async () => {
  const spinner = ora("Memulai proses pembuatan akun baru...").start();
  const { accessToken, refreshToken, idToken } =
    await Helpers.generateNewAccount();
  spinner.succeed("Akun baru berhasil dibuat.");

  spinner.start("Mengambil gaya utama dan sub-gaya...");
  const { mainStyles, subStyles } = await Helpers.getStyles(accessToken);
  spinner.succeed("Gaya utama dan sub-gaya berhasil diambil.");

  spinner.start("Memilih gaya utama secara acak...");
  const randomMainStyle =
    mainStyles[Math.floor(Math.random() * mainStyles.length)].title;
  spinner.succeed(`Gaya utama yang dipilih: ${chalk.green(randomMainStyle)}`);

  spinner.start("Menghitung jumlah sub-gaya secara acak...");
  const jumlahRandomSubStyles = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
  const randomSubStyles = [];
  spinner.succeed(
    `Jumlah sub-gaya yang akan dipilih: ${chalk.yellow(jumlahRandomSubStyles)}`
  );
  for (let i = 0; i < jumlahRandomSubStyles; i++) {
    const randomIndex = Math.floor(Math.random() * subStyles.length);
    randomSubStyles.push(subStyles[randomIndex].id);
  }
  spinner.succeed("Sub-gaya berhasil dipilih secara acak.");

  spinner.start("Mengambil inspirasi...");
  const inspiration = await Helpers.getInspiration(accessToken);
  spinner.succeed(
    `Inspirasi berhasil diambil: ${chalk.blueBright(inspiration)}`
  );

  spinner.start("Menghasilkan nilai seed secara acak...");
  const seed =
    Math.floor(Math.random() * (3778053252 - 1778053252 + 1)) + 1778053252;
  spinner.succeed(`Nilai seed yang dihasilkan: ${chalk.magenta(seed)}`);

  spinner.start("Menghasilkan jumlah langkah secara acak...");
  const step = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
  spinner.succeed(`Jumlah langkah yang dihasilkan: ${chalk.cyan(step)}`);

  spinner.start("Memilih aspek gambar secara acak...");
  const randomAspect = ["square", "vertical", "horizontal"][
    Math.floor(Math.random() * 3)
  ];
  spinner.succeed(`Aspek gambar yang dipilih: ${chalk.green(randomAspect)}`);

  spinner.start("Menghasilkan gambar baru...");
  const { url } = await Helpers.generateNewImage(
    accessToken,
    inspiration,
    randomAspect,
    randomMainStyle,
    randomSubStyles,
    seed,
    step
  );
  spinner.succeed("Gambar baru berhasil dihasilkan.");

  console.info(chalk.bold("Informasi Gambar:"));
  console.log(`Prompt: ${chalk.blueBright(inspiration)}`);
  console.log(`Style: ${chalk.greenBright(randomMainStyle)}`);
  console.log(`Aspect: ${chalk.yellowBright(randomAspect)}`);
  console.log(
    `Substyle: ${randomSubStyles
      .map((id) => {
        const subStyle = subStyles.find((subStyle) => subStyle.id === id).title;
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
          16
        )}`;
        return chalk.hex(randomColor)(subStyle);
      })
      .join(", ")}`
  );
  console.log(`Seed: ${chalk.cyan(seed)}`);
  console.log(`Step: ${chalk.red(step)}`);
  // console.log(`⎋ Lihat gambar versi HD: ${chalk.cyanBright.underline(url)}`);

  const temporaryImagePath = `./temp_image_${Date.now()}.png`;
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  await fs.outputFile(temporaryImagePath, Buffer.from(buffer)); // Menyimpan gambar secara sementara

  exec(`open ${temporaryImagePath}`, (error) => {
    if (error) {
      console.error(chalk.red(`Tidak dapat membuka gambar: ${error.message}`));
      return;
    }
  });
};

davinciUnlimited(); // Menjalankan fungsi davinciUnlimited
