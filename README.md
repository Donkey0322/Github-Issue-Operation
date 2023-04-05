## [2023-04-05] Frontend Intern Homework

### 台灣大學 資管系 三年級 李昀宸

---

### 介紹

- 這個服務在做什麼？ <br>
  可以使用這個網頁操作您在 GitHub 上公開的 issue (public repository)
- 使用、參考之第三方套件、框架、程式碼：<br>
  前端：React.js, Material UI, React Router, Styled-components, Lodash, Antd, Axios <br>
  後端：Node.js, Express.js <br>
  其他：GitHub OAuth

### 操作說明

1. 在此目錄下 `yarn install:all` 安裝所需 package<br>

```
# under 2023-Frontend-Intern-Homework
yarn install:all
```

2. 啟動後端：在 backend 下 `yarn server`<br>

```
# under backend
yarn server
```

3. 啟動後端：在 frontend 下 `yarn start`，接著就能在 localhost:3000 使用我們的服務。

```
# under frontend
yarn start
```

4. Optional: 或者也可以在原目錄下 `yarn frontend` 和 `yarn backend`

```
# under 2023-Frontend-Intern-Homework 兩個 terminal
yarn frontend
yarn backend
```

### 功能說明

1. 註冊功能：使用 GitHub 帳號登入，在 http://localhost:3000 登入後會得到一組 code，請稍候等待系統登入。<br>
   **Except Handling:** 在登入後就不允許再進入登入頁面。
2. 基本操作：在 http://localhost:3000/task 中會自動匯入 10 筆 issues，可以點選打開閱讀詳細內容或進行編輯。<br>
   **Except Handling:** 未登入前不允許進入該頁面。
3. 更新 / 編輯 issue: 在詳細內容的 Modal 中可以點選右上角的編輯圖標，系統會切換到編輯模式。<br>
   **Except Handling:**
   - title 為必填欄位。
   - body 必須超過 30 字，若原本 issue 的內容沒有超過 30 字，也必須遵守才能進行更新。
   - status 只有 _Open_, _In Progress_, _Done_ 三種類型可選。
     以上若無符合任何一項，或者與原本 issue 並無差別則無法更新。
4. 新增 issue: :heavy_plus_sign: 點選右上角的 Create Task 新增 issue，<br>
   **Except Handling:**

   - title: 為必填欄位。
   - body: 必須超過 30 字。
   - status: 只有 _Open_, _In Progress_, _Done_ 三種類型可選。
   - repo: 需從您公開的 repository 中選擇要更新的目標地，若系統無偵測到公開 repo 則無法選擇。<br>

   以上若無符合任何一項則無法新增。
   在新增後該筆新增會在最上方，若原本顯示的欄位是 10 的倍數，則會維持原數目，反之則比原本多 1 筆（新增的那一筆）。

5. 刪除 issue: 實質上是將 issue 在 GitHub 中改為 state=closed。<br>
   **Except Handling:** 跳出提示欄進行 2 次確認。在刪除後若原本顯示的欄位是 10 的倍數，則會維持原數目，反之則比原本少 1 筆（刪除的那一筆）。
6. 獲取 issue: 將滾輪下滑到底部（感應器可能會偵測到倒數 1~2 筆），會自動索取 10 筆 issue，若沒有 issue 或未滿 10 筆則會跳出通知: _No more data_<br>
   **Note:** 這邊運用了 throttle 技術，避免滾輪在底部時偵測過快導致系統出錯，故反應時間可能會稍微遲 0.5 秒，在新增或是刪除時都會運用到這筆技術，故當滾輪在底部時可以觀察，若反應不好麻煩在重啟系統（刷新頁面）。
7. 搜尋 issue: 在右上角的 search bar 裡輸入想查詢的字並按下 Enter，系統會查找所有 _title_, _body_, _repo_ 包含該關鍵字的 row，並 hightlight 提示。
8. MUI 提供:

   - 可以更改頁面筆數，預設為 50 筆。
   - 可以切換頁面。**Note:** 在最後的頁面才能以滾輪索要 issue
   - 可以隱藏或顯示 column。
   - 可以更改 row 間的密度。
   - 可以輸出成 CSV 檔。

9. Filter: 可已依想要方式做篩選（為 MUI 提供的服務），值得觀察的是在 filter 時若所得 result 未超過 10 筆，系統會跳出提示（有點強迫）索要更多 issue，直到 filter 結果大於 10 筆或沒有更多 issue。<br>
   **Note:** 僅提供單一 filter。
10. Sorting: 根據欄位進行 sorting，字串以 Alphabet 排序，時間以時間先後排序，預設為 issue 建立時間。
    **Note:** 僅提供單一 sorting。
11. Testing Button: 右上角的綠色新增符號可以快速隨機新增 issue。
    **Except Handling:** 若系統無偵測到公開 repo 則無法點擊。
12. 其他還有一些防呆機制、在 issue 後台操作時的 UIUX 設計、沒有 Data 時的可愛設計等等。
