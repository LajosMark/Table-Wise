using System;
using System.Globalization;
using Microsoft.Maui.Controls;

namespace TableWise.Converters 
{
    public class EnglishDateConverter : IValueConverter
    {

        // át konvertáltam angolra a shift date-et
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is DateTime date)
            {

                return date.ToString("yyyy. MM. dd. (dddd)", new CultureInfo("en-US"));
            }
            return value?.ToString();
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {

            throw new NotImplementedException();
        }
    }
}