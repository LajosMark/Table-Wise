using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using TableWise.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace TableWise.Services
{
    public static class DataService
    {
        static string url = "http://10.0.2.2:3000";

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

        public static async Task<List<Category>> GetCategories()
        {
            try
            {
                HttpClient client = new HttpClient();
                var response = await client.GetAsync(url + "/api/mealCategories");

                if (response.IsSuccessStatusCode)
                {
                    string result = await response.Content.ReadAsStringAsync();

                    var options = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                    // 1. Most a CSOMAGOT (CategoryResponse) deszerializáljuk:
                    var wrapper = System.Text.Json.JsonSerializer.Deserialize<CategoryResponse>(result, options);

                    // 2. Csak a benne lévő listát adjuk vissza:
                    return wrapper?.Categories ?? new List<Category>();
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"HIBA: {ex.Message}");
            }
            return new List<Category>();
        }

        public static async Task<List<FoodItem>> GetMealsByCategory(int categoryId)
        {
            try
            {
                HttpClient client = new HttpClient();
                // Fontos: Itt is a 10.0.2.2:3000-et használd!
                var response = await client.GetAsync($"{url}/api/mealCategories/{categoryId}/meals");

                if (response.IsSuccessStatusCode)
                {
                    string result = await response.Content.ReadAsStringAsync();
                    Debug.WriteLine($"NYERS JSON (Ételek): {result}");

                    var options = new System.Text.Json.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };

                    // Kicsomagoljuk a FoodResponse dobozt
                    var wrapper = System.Text.Json.JsonSerializer.Deserialize<FoodResponse>(result, options);

                    return wrapper?.Meals ?? new List<FoodItem>();
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Hiba az ételek lekérésekor (CatID: {categoryId}): {ex.Message}");
            }
            return new List<FoodItem>();
        }

        public class CategoryResponse
        {
            [JsonPropertyName("data")] // Ha a JSON-ben "data": [...] van, akkor ez marad!
            public List<Category> Categories { get; set; }
        }

        public class FoodResponse
        {
            [JsonPropertyName("data")] // Ha a JSON-ben "data": [...] van az ételeknél is
            public List<FoodItem> Meals { get; set; }
        }
    }
}
