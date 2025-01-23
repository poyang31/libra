// 導入模組
const { PassThrough } = require("node:stream");
const { readFileSync } = require("node:fs");
const { join: pathJoin } = require("node:path");

const { google } = require("googleapis");
const mysqldump = require("mysqldump");

// 載入 Config
const getenv = require("getenv");
require("dotenv").config();

// 定義常數
const dumpTemporaryFilename = "dump_temp.sql";

// 登入 Google OAuth
const googleOAuthKeyFilePath = pathJoin(__dirname, "credentials.json");
const googleOAuthScopes = ["https://www.googleapis.com/auth/drive"];
const googleOAuth = new google.auth.GoogleAuth({
  keyFile: googleOAuthKeyFilePath,
  scopes: googleOAuthScopes,
});

// 備份與上傳
(async () => {
  // 備份 MySQL
  await mysqldump({
    connection: {
      host: getenv("MYSQL_HOST"),
      user: getenv("MYSQL_USER"),
      port: getenv("MYSQL_PORT"),
      password: getenv("MYSQL_PASSWORD"),
      database: getenv("MYSQL_NAME"),
    },
    dumpToFile: dumpTemporaryFilename,
  });

  // 確認備份 MySQL 完成
  console.log("Dump Completed");

  // 上傳檔案至 Google Drive
  const googleDriveFiles = google.drive({
    version: "v3",
    auth: googleOAuth,
  }).files;
  const bufferStream = new PassThrough();
  const fileContent = readFileSync(dumpTemporaryFilename);
  bufferStream.end(fileContent);

  await googleDriveFiles.create({
    media: {
      mimeType: "application/sql",
      body: bufferStream,
    },
    requestBody: {
      name: dumpTemporaryFilename,
      parents: getenv.array("GD_DUMP_FILE_UPLOAD_PARENTS"),
    },
    fields: "id,name",
  });

  // 確認上傳檔案完成
  console.log(`Upload Completed`);
})();
