using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TableWise.Models
{

    public class WorkHourDetails
    {
        [System.Text.Json.Serialization.JsonPropertyName("_id")]
        public object Id { get; set; }

        [System.Text.Json.Serialization.JsonPropertyName("startDate")]
        public DateTime StartDate { get; set; }

        [System.Text.Json.Serialization.JsonPropertyName("endDate")]
        public DateTime EndDate { get; set; }
    }


    public class WorkHour
    {
        [System.Text.Json.Serialization.JsonPropertyName("_id")]
        public int Id { get; set; }

        private bool _isAccepted = false;

        [System.Text.Json.Serialization.JsonPropertyName("isAccepted")]
        public bool IsAccepted
        {
            get => _isAccepted;
            set => _isAccepted = value;
        }


        [System.Text.Json.Serialization.JsonPropertyName("workHoursId")]
        public WorkHourDetails Details { get; set; }


        public string DisplayDate => Details?.StartDate.ToString("yyyy. MM. dd. (dddd)", new System.Globalization.CultureInfo("en-US")) ?? "No date";
        public string DisplayTime => Details != null ? $"{Details.StartDate:HH:mm} - {Details.EndDate:HH:mm}" : "00:00 - 00:00";
        public double TotalHours => Details != null ? (Details.EndDate - Details.StartDate).TotalHours : 0;

        

        public string StatusIcon => IsAccepted ? "✅" : "⏳";
        public string StatusText => IsAccepted ? "Accepted" : "Pending...";
        public Color StatusColor => IsAccepted ? Colors.Green : Colors.Orange;
    }

    public class WorkHourResponse
    {
        [System.Text.Json.Serialization.JsonPropertyName("data")]
        public List<WorkHour> Data { get; set; }
    }
}