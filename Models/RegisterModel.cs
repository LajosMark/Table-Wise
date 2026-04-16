using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TableWise.Models
{
    public class RegisterModel
    {
        // tulajdonság nevek a backend-ből jönnek
        [JsonPropertyName("_id")] // Vagy simán id, amit a backend küld a /me-nél
        public int id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string role { get; set; }
        public string password { get; set; }
        public string confirm_password { get; set; }
        
    }
}
