function checkBirthdays() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("birthday");
  var range = sheet.getDataRange(); // 全データの範囲を取得
  var values = range.getValues(); // 全データを2次元配列として取得
  
  var today = new Date();
  var twoWeeksLater = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14); // 今日から2週間後の日付
  
  // 見出し行から「誕生日」というテキストを検索して、その列インデックスを取得
  var headers = values[0]; // 見出し行を取得
  var idColumn = headers.indexOf('id') + 1;
  var nameColumn = headers.indexOf('name') + 1;
  var birthdayColumn = headers.indexOf('birthday') + 1;
  var departmentColumn = headers.indexOf('department') + 1;

  if (birthdayColumn === 0) {
    console.log("「誕生日」の列が見つかりません。");
    return; // 「誕生日」の列が見つからなければ処理を終了
  }

  for (var i = 1; i < values.length; i++) { // ヘッダーをスキップして2行目から開始
    var row = values[i];

    var idStr = row[idColumn - 1]; // 「birthday」列のデータを取得
    var birthdayStr = row[birthdayColumn - 1]; // 「birthday」列のデータを取得
    var nameStr = row[nameColumn - 1]; // 「name」列のデータを取得
    var departmentStr = row[departmentColumn - 1]; // 「email」列のデータを取得

    var birthday = birthdayStr ? new Date(birthdayStr) : null; // 日付データがあればDateオブジェクトに変換、なければnull
    if (birthday && birthday.getMonth() === twoWeeksLater.getMonth() && birthday.getDate() === twoWeeksLater.getDate()) {
      Logger.log("2週間後に誕生日を迎える人がいます 名前： " + nameStr + " 部署： " + departmentStr + " 社員ID: " + idStr); // 該当する行番号をログに出力
      sendEmail(nameStr, departmentStr, birthdayStr, idStr);
    }
  }

  if (isTomorrowWeekday()) {
    console.log('終わりです')
  } else {
    Logger.log("次の日が土日祝のため、次の日の分までチェックします");
    checkBirthdays();
  }
}

function isTomorrowWeekday() {
  return true;
}



function sendEmail(nameStr, departmentStr, birthday, idStr) {
  // var to = "tishiguro@careerindex.co.jp"; // 送信先のメールアドレスをここに入力

  let toList = createToList(idStr, departmentStr);
  let subject = createSubject(`${birthday.getMonth() + 1}`, birthday.getDate(), nameStr);
  let body = createBody(`${birthday.getMonth() + 1}`, birthday.getDate(), nameStr);
  var ccList = getCcEmailsFromOptions();
  var options = {
    cc: ccList
  };


  // console.log(subject);
  // console.log(body);
  // console.log(toList);
  console.log(options);

  // var toList = "example1@example.com, example2@example.com, example3@example.com"; // 複数のメールアドレスをカンマで区切る
  // GmailApp.sendEmail(toList, subject, body, options);
}

// 誕生日の本人を除いた部署全員の送信先リストを作成する
function createToList(idStr, departmentStr) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("employee_department");
  var range = sheet.getDataRange(); // 全データの範囲を取得
  var values = range.getValues(); // 全データを2次元配列として取得

  var headers = values[0]; // 見出し行を取得
  var departmentColumn = headers.indexOf('department') + 1;
  var affiliated_employee_ids_Column = headers.indexOf('affiliated_employee_id');

  var row = values[departmentColumn];

  // 部署の名前でemployee_departmentシートのA列を検索
  var index = values.findIndex((row, i) => i > 0 && row[departmentColumn - 1] == departmentStr);

  let list = values[index][affiliated_employee_ids_Column]
  let array = list.split(", ").map(Number);
  let filteredIdsList = array.filter(item => item !== idStr);

  return findEmailsByIds(filteredIdsList)
}

// IDのリストからメールアドレスの一覧を作成
function findEmailsByIds(filteredIdsList) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("birthday");

  // idのデータ範囲を(A列)取得
  var range = sheet.getRange('A2:A');
  // emailのデータ範囲（E列）を取得
  var emailRange = sheet.getRange('E2:E');

  // データを2次元配列として取得
  var values = range.getValues();
  var emailValues = emailRange.getValues();

  // 2次元配列から1次元配列に変換し、空のセルを除外
  var idsList = values.flat().filter(String);
  var emailsList = emailValues.flat().filter(String);

  // IDをキーとし、emailを値とするオブジェクトを作成
  var idEmailMap = {};
  for (var i = 0; i < idsList.length; i++) {
    if (emailsList[i]) {  // emailが存在する場合のみマッピング
      idEmailMap[idsList[i]] = emailsList[i];
    }
  }

  var emailList = []; // メールアドレスを格納するための空の配列

  for (var i = 0; i < filteredIdsList.length; i++) { // ヘッダーをスキップして2行目から開始
    var id = filteredIdsList[i];
    var targetEmail = idEmailMap[id];
    emailList.push(targetEmail); // 配列にメールアドレスを追加
  }

  var emailListString = emailList.join(", "); // 配列のメールアドレスをカンマ区切りで結合
  return emailListString
}


// メール件名を作成
function createSubject(month, day, name) {
  let text = `【ご対応願い】${month}月${day}日_${name}さんのお誕生日`

  return text;
}

// メール本文を作成
function createBody(month, day, name) {
  var senderName = getSenderNameFromOptions();

  let text = `各位

お疲れ様です。${senderName}です。
${month}月${day}日ですが、${name}さんのお誕生日となります。
お手数をお掛けいたしますが、ご対応ほどよろしくお願いいたします。`;

  console.log(text)
  return text;
}

// senderNameをシートから取得する関数
function getSenderNameFromOptions() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("options");
  var range = sheet.getDataRange();
  var values = range.getValues();

  // senderName列のインデックスを見つける
  var senderNameColumnIndex = -1;
  for (var i = 0; i < values[0].length; i++) {
    if (values[0][i] === "senderName") {
      senderNameColumnIndex = i;
      break;
    }
  }

  if (senderNameColumnIndex === -1) {
    throw new Error("senderName列が見つかりません");
  }

  // senderName列の一つ下の値を取得
  var senderName = values[1][senderNameColumnIndex];
  return senderName;
}

// CC送信先を作成
function getCcEmailsFromOptions() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("options");
  var range = sheet.getDataRange();
  var values = range.getValues();

  // cc列のインデックスを見つける
  var ccColumnIndex = -1;
  for (var i = 0; i < values[0].length; i++) {
    if (values[0][i] === "ccEmails") {
      ccColumnIndex = i;
      break;
    }
  }

  if (ccColumnIndex === -1) {
    throw new Error("cc列が見つかりません");
  }

  // cc列の値をカンマ区切りの文字列として取得
  var ccEmails = [];
  for (var j = 1; j < values.length; j++) {
    if (values[j][ccColumnIndex]) {
      ccEmails.push(values[j][ccColumnIndex]);
    }
  }

  return ccEmails.join(',');
}










