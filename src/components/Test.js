function setupDateValidations() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Указываем диапазоны для валидации, включая новый диапазон
  var ranges = [
    'I22:I133',
    'P22:P87',
    'W22:W85',
    'AD22:AD84',
    'AK22:AK82',
    'B22:B135' // Добавлен новый диапазон
  ];

  // Создаём правило валидации для даты с сообщением о помощи
  var dateRule = SpreadsheetApp.newDataValidation()
    .requireDate()
    .setAllowInvalid(false)
    .setHelpText('Введите дату в формате дд.ММ.гггг')
    .build();
  
  // Проходим по каждому диапазону
  ranges.forEach(function(rangeStr) {
    try {
      var range = sheet.getRange(rangeStr);

      // Логируем начальное состояние диапазона
      Logger.log('Обрабатываем диапазон: ' + rangeStr);

      // Убираем любое существующее форматирование или валидацию
      range.clearDataValidations();
      range.clearFormat(); // Убираем любое существующее форматирование
      range.setNumberFormat('dd.MM.yyyy'); // Устанавливаем формат даты

      // Применяем правило валидации даты к диапазону
      range.setDataValidation(dateRule);

      Logger.log('Валидация даты установлена для диапазона: ' + rangeStr);
    } catch (error) {
      Logger.log('Ошибка в диапазоне ' + rangeStr + ': ' + error.message);
    }
  });

  Logger.log('Валидация даты установлена для всех указанных диапазонов.');
}






function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var startRow = 22;

  var columnPairs = [
    {columns: [1, 2], idColumn: 3},   // A, B -> идентификатор в C
    {columns: [8, 9], idColumn: 10},  // H, I -> идентификатор в J
    {columns: [15, 16], idColumn: 17}, // O, P -> идентификатор в Q
    {columns: [22, 23], idColumn: 24}, // V, W -> идентификатор в X
    {columns: [29, 30], idColumn: 31}, // AC, AD -> идентификатор в AE
    {columns: [36, 37], idColumn: 38}, // AJ, AK -> идентификатор в AL
  ];

  var sheetName = sheet.getRange('A1').getValue();
  var targetSpreadsheetId = '1U_1uY4xfJV80qP6IMii1A2GLXNVv0_NY2A7v43EfzZg';
  var targetSpreadsheet = SpreadsheetApp.openById(targetSpreadsheetId);
  var targetSheet = targetSpreadsheet.getSheetByName(sheetName);

  if (!targetSheet) {
    Logger.log('Лист с именем ' + sheetName + ' не найден в целевой таблице.');
    return;
  }

  var targetData = targetSheet.getRange(startRow, 1, targetSheet.getLastRow() - startRow + 1, targetSheet.getLastColumn()).getValues();
  var idMap = {};  

  targetData.forEach(function(row, index) {
    columnPairs.forEach(function(pair) {
      if (row[pair.idColumn - 1]) {
        idMap[row[pair.idColumn - 1]] = startRow + index;
      }
    });
  });

  for (var r = 0; r < range.getNumRows(); r++) {
    for (var c = 0; c < range.getNumColumns(); c++) {
      var cell = range.getCell(r + 1, c + 1);
      var row = cell.getRow();
      var column = cell.getColumn();
      var value = cell.getValue();

      // Проверка, если строка выше 22-й, пропускаем обработку
      if (row < startRow) {
        continue;
      }

      var pair = columnPairs.find(p => p.columns.includes(column));
      if (!pair) continue;

      var identifierCell = sheet.getRange(row, pair.idColumn);
      var uniqueId = identifierCell.getValue();

      // Проверка, если вводимые данные не соответствуют формату ДД.ММ.ГГГГ
      var datePattern = /^\d{2}\.\d{2}\.\d{4}$/;
      if (pair.dateColumn && column === pair.dateColumn && !datePattern.test(value)) {
        cell.setValue('');  // Очищаем ячейку, если формат неверный
        SpreadsheetApp.getUi().alert('Пожалуйста, вводите дату в формате ДД.ММ.ГГГГ');
        continue;
      }

      if (!uniqueId) {
        uniqueId = new Date().getTime() + '-' + r + '-' + c;  // Уникальный ID
        identifierCell.setValue(uniqueId);
      }

      var foundRow = idMap[uniqueId];

      if (foundRow) {
        var targetCell = targetSheet.getRange(foundRow, column);
        if (value === '') {
          targetCell.setBackground('red');
        } else {
          if (targetCell.getValue() !== value && targetCell.getValue() !== '') {
            targetCell.setValue(value);
            targetCell.setBackground('yellow');
          } else if (targetCell.getValue() === '') {
            targetCell.setValue(value);
            targetCell.setBackground(null);
          }
        }
      } else {
        var nextFreeRow = startRow;
        while (targetSheet.getRange(nextFreeRow, pair.columns[0]).getValue() !== '' || 
               targetSheet.getRange(nextFreeRow, pair.columns[1]).getValue() !== '') {
          nextFreeRow++;
        }
        Logger.log('Перенос данных в строку: ' + nextFreeRow);
        targetSheet.getRange(nextFreeRow, column).setValue(value);
        targetSheet.getRange(nextFreeRow, pair.idColumn).setValue(uniqueId);
        targetSheet.getRange(nextFreeRow, column).setBackground(null);
        idMap[uniqueId] = nextFreeRow;
      }
    }
  }
}
