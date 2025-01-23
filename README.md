# jake

這是一份MySQL資料庫備份腳本，
由[@789363](https://github.com/789363)起草，
進而加以整理而成。

使用之前，請在Google API平台申請一份作為代理用的OAuth應用程式，
並備妥您的`credentials.json`，將其放置在本專案根目錄。

將`.env.example`複製為`.env`，
並填寫完`.env`中對應的欄位資訊後，
執行`npm start`即可執行備份。

將該程式加入系統排程器後，
可達成定期備份效果。
