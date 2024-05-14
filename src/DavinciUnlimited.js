import DavinciUnlimited from "./Helpers/index.js";
import ora from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs-extra";
import fetch from "node-fetch";

const davinciUnlimited = async () => {
  const spinner = ora("Memulai proses pembuatan akun baru...").start();
  const { accessToken } = await DavinciUnlimited.generateNewAccount();
  spinner.succeed("Akun baru berhasil dibuat.");

  spinner.start("Mengambil gaya utama dan sub-gaya...");
  const { mainStyles, subStyles } = await DavinciUnlimited.getStyles(
    accessToken
  );
  spinner.succeed("Gaya utama dan sub-gaya berhasil diambil.");

  const mainStyleChoices = mainStyles.map((style) => style.title);
  const subStyleChoices = subStyles.map((style) => ({
    name: style.title,
    value: style.id,
  }));

  const questions = [
    {
      type: "input",
      name: "inspiration",
      message: "Masukkan inspirasi (kosongkan untuk nilai acak):",
      validate: (input) =>
        input !== ""
          ? true
          : "Silakan masukkan inspirasi atau tekan enter untuk nilai acak.",
      default: async () => {
        const inspiration = await DavinciUnlimited.getInspiration(accessToken);
        return inspiration;
      },
    },
    {
      type: "list",
      name: "aspect",
      message: "Pilih aspek gambar:",
      choices: ["square", "vertical", "horizontal"],
      default: () =>
        ["square", "vertical", "horizontal"][Math.floor(Math.random() * 3)],
    },
    {
      type: "list",
      name: "mainStyle",
      message: "Pilih gaya utama:",
      choices: [...mainStyleChoices, "Acak"],
      filter: (choice) =>
        choice === "Acak"
          ? mainStyleChoices[
              Math.floor(Math.random() * mainStyleChoices.length)
            ]
          : choice,
    },
    {
      type: "checkbox",
      name: "subStyles",
      message: "Pilih sub-gaya (kosongkan untuk pilihan acak):",
      choices: subStyleChoices,
      filter: (choices) => {
        if (choices.length === 0) {
          const randomCount = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
          const shuffled = subStyleChoices.sort(() => 0.5 - Math.random());
          return shuffled.slice(0, randomCount).map((choice) => choice.value);
        }
        return choices;
      },
    },
    {
      type: "input",
      name: "seed",
      message: "Masukkan nilai seed (kosongkan untuk nilai acak):",
      validate: (input) =>
        input === "" || (!isNaN(parseFloat(input)) && isFinite(input))
          ? true
          : "Silakan masukkan angka atau kosongkan untuk nilai acak.",
      default: () =>
        Math.floor(Math.random() * (3778053252 - 1778053252 + 1)) + 1778053252,
    },
    {
      type: "input",
      name: "step",
      message: "Masukkan jumlah langkah (kosongkan untuk nilai acak):",
      validate: (input) =>
        input === "" || (!isNaN(parseFloat(input)) && isFinite(input))
          ? true
          : "Silakan masukkan angka atau kosongkan untuk nilai acak.",
      default: () => Math.floor(Math.random() * (50 - 1 + 1)) + 1,
    },
  ];

  const answers = await inquirer.prompt(questions);

  spinner.start("Menghasilkan gambar baru...");
  const { url } = await DavinciUnlimited.generateNewImage(
    accessToken,
    answers.inspiration,
    answers.aspect,
    answers.mainStyle,
    answers.subStyles,
    answers.seed,
    answers.step
  );
  spinner.succeed("Gambar baru berhasil dihasilkan.");

  console.info(chalk.bold("Informasi Gambar:"));
  console.log(`Prompt: ${chalk.blueBright(answers.inspiration)}`);
  console.log(`Style: ${chalk.greenBright(answers.mainStyle)}`);
  console.log(`Aspect: ${chalk.yellowBright(answers.aspect)}`);
  console.log(
    `Substyle: ${answers.subStyles
      .map((id) => {
        const subStyle = subStyles.find((subStyle) => subStyle.id === id).title;
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
          16
        )}`;
        return chalk.hex(randomColor)(subStyle);
      })
      .join(", ")}`
  );
  console.log(`Seed: ${chalk.cyan(answers.seed)}`);
  console.log(`Step: ${chalk.red(answers.step)}`);
  console.log(`⎋ Lihat gambar versi HD: ${chalk.cyanBright.underline(url)}`);

  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      await fs.writeFile(`${filename}.png`, Buffer.from(buffer));
      console.log(
        chalk.green(`Gambar berhasil disimpan sebagai ${filename}.png`)
      );
    } catch (error) {
      console.error(
        chalk.red("Terjadi kesalahan saat menyimpan gambar."),
        error
      );
    }
  };

  const saveImagePrompt = [
    {
      type: "confirm",
      name: "download",
      message: "Apakah Anda ingin mendownload gambar tersebut (png)?",
      default: true,
    },
    {
      type: "input",
      name: "filename",
      message: "Masukkan nama file untuk gambar (default random):",
      when: (answers) => answers.download,
      default: () => `davinci-image-${Date.now()}`,
    },
  ];

  const { download, filename } = await inquirer.prompt(saveImagePrompt);

  if (download) {
    await downloadImage(url, filename);
  }

  const restartPrompt = [
    {
      type: "confirm",
      name: "restart",
      message: "Apakah Anda ingin menjalankan ulang programnya?",
      default: true,
    },
  ];

  const { restart } = await inquirer.prompt(restartPrompt);

  if (restart) {
    davinciUnlimited();
  } else {
    console.log(
      chalk.yellow("Terima kasih telah menggunakan Davinci Unlimited.")
    );
  }
};

davinciUnlimited(); // Menjalankan fungsi davinciUnlimited
