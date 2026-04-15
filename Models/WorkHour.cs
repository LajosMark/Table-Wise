using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TableWise.Models
{
    public class WorkHour
    {
        // A backendről jövő "_id" mezőt egyből int-be olvassuk
        [System.Text.Json.Serialization.JsonPropertyName("_id")]
        public int _id { get; set; }

        // Egy kényelmi tulajdonság, ami stringként adja vissza az ID-t, 
        // ha a kódod többi része stringet várna:
        public string Id => _id.ToString();

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string DisplayDate => StartDate.ToString("yyyy. MM. dd. (dddd)");
        public string DisplayTime => $"{StartDate:HH:mm} - {EndDate:HH:mm}";
        public double TotalHours => (EndDate - StartDate).TotalHours;
    }

    // Ez az osztály segít a JSON feldolgozásában
    public class WorkHourResponse
    {
        public List<WorkHour> Data { get; set; }
    }
}