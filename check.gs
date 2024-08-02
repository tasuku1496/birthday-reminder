// function isBirthdayInTwoWeeks(birthday) {
//   // 今日の日付を取得
//   var today = new Date();

//   // 祝日をリスト化（例：日本の祝日）
//   var holidays = [
//     new Date(today.getFullYear(), 0, 1),   // 元日 (1月1日)
//     new Date(today.getFullYear(), 1, 11),  // 建国記念の日 (2月11日)
//     new Date(today.getFullYear(), 4, 3),   // 憲法記念日 (5月3日)
//     new Date(today.getFullYear(), 4, 4),   // みどりの日 (5月4日)
//     new Date(today.getFullYear(), 4, 5),   // こどもの日 (5月5日)
//     // 他の祝日を追加
//   ];
  
//   // 今日の日付を取得
//   var todayDate = new Date();
//   console.log(todayDate);
  
//   // 祝日と週末を確認し、次の日が平日とわかるまでループ
//   // while (isWeekend(todayDate) || isHoliday(todayDate)) {
//   //   todayDate.setDate(todayDate.getDate() + 1);
//   // }
//   while (isWeekend(todayDate)) {
//     todayDate.setDate(todayDate.getDate() + 1);
//   }
//   console.log(todayDate);

// }

// function isWeekend(date) {
//   // 与えられた日付の翌日の日付を作成
//   var nextDay = new Date(date);
//   nextDay.setDate(date.getDate() + 1);
  
//   // 翌日が土日かどうかを確認
//   var day = nextDay.getDay();
//   return day == 0 || day == 6;  // 日曜日（0）または土曜日（6）
// }

// function isHoliday(date) {
//   return false;

//   for (var i = 0; i < holidays.length; i++) {
//     if (date.getTime() === holidays[i].getTime()) {
//       return true;
//     }
//   }
//   return false;
// }

// // // 使用例
// // var birthday = new Date(1990, 6, 1);  // 7月1日（0-11月を指定）
// // Logger.log(isBirthdayInTwoWeeks(birthday));




function todayIsEnd(){
  var calendar = CalendarApp.getDefaultCalendar();
  var events = calendar.getEventsForDay(new Date()); // 今日のイベントを取得する例
  console.log(calendar)

}


function isHoliday(targetDate) {
  // 日本の祝日カレンダーのIDを定義
  const holidayCalendarId = 'ja.japanese#holiday@group.v.calendar.google.com';
  
  // カレンダーIDを使用してカレンダーを取得
  const calendar = CalendarApp.getCalendarById(holidayCalendarId);

  // ターゲットの日付のイベント（祝日）を取得
  const events = calendar.getEventsForDay(targetDate);

  // イベントが存在するかどうかをチェック（存在すれば祝日、存在しなければ非祝日）
  return events.length > 0;
}

// 使用例：2023年1月1日が祝日（元日）であることを確認
function main() {

  const targetDate = new Date("2024/08/12"); // 特定の日付

  console.log("日付: " + Utilities.formatDate(targetDate, "JST", "yyyy/MM/dd"));

  if (isHoliday(targetDate)) {
    console.log("○ きょうは祝日です。");
  } else {
    console.log("× 祝日ではないです。");
  }

}


