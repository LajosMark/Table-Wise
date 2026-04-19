using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TableWise.Models
{
    public class RegErrorModel
    {
        /// <summary>
        /// Hibaüzenet model a regisztrációhoz
        /// </summary>
            public string[] name { get; set; } = Array.Empty<string>();
            public string[] email { get; set; } = Array.Empty<string>();
            public string[] password { get; set; } = Array.Empty<string>();
            public string[] confirm_password { get; set; } = Array.Empty<string>();
    }
}
