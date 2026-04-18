using System;
using System.Globalization;
using Microsoft.Maui.Controls;

namespace TableWise.Converters // Cseréld le a te névteredre, ha más!
{
    public class EnglishDateConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is DateTime date)
            {
                // Itt történik a varázslat: ráerőszakoljuk az angolt és a te formátumodat!
                return date.ToString("yyyy. MM. dd. (dddd)", new CultureInfo("en-US"));
            }
            return value?.ToString();
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            // Ezt nem használjuk, csak kötelező eleme az IValueConverter-nek
            throw new NotImplementedException();
        }
    }
}