using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using TableWise.Models;

namespace TableWise.Services
{
    public static class DataService
    {
        static string url = "https://bgs.jedlik.eu";

        public static async Task<RegErrorModel> register(RegisterModel user)
        {
            RegErrorModel errorRegister = new RegErrorModel();

            string jsonData = JsonConvert.SerializeObject(user);
            StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");

            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.PostAsync(url + "/book100api/api/register", content);

            string result = await response.Content.ReadAsStringAsync();

            if ((int)response.StatusCode == 400)
            {
                errorRegister = JsonConvert.DeserializeObject<RegErrorModel>(result);
            }


            return errorRegister;
        }

        public static async Task<string> login(string email, string password)
        {

            string jsonData = JsonConvert.SerializeObject(new { email = email, password = password });
            StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");

            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.PostAsync(url + "/book100api/api/login", content);

            string result = await response.Content.ReadAsStringAsync();

            if ((int)response.StatusCode == 401)
            {
                // sikertelen bejelentkezés
                dynamic errorObj = JsonConvert.DeserializeObject<dynamic>(result);
                return errorObj.message;
            }
            else
            {
                // sikerült bejelentkezni
                await SecureStorage.Default.SetAsync("user", result);
                return null;
            }
        }

        public static async Task logout()
        {
            var authData = await getAuthenticatedUser();
            StringContent content = new StringContent("");
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", authData.token);
            HttpResponseMessage response = await client.PostAsync(url + "/book100api/api/logout", content);
            string result = await response.Content.ReadAsStringAsync();
            SecureStorage.Default.Remove("user");
        }

        public static async Task<AuthResponseModel> getAuthenticatedUser()
        {
            var serializedData = await SecureStorage.Default.GetAsync("user");
            if (!string.IsNullOrWhiteSpace(serializedData))
            {
                return JsonConvert.DeserializeObject<AuthResponseModel>(serializedData);
            }
            return null;
        }
    }
}
