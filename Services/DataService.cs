using System.Data;
using System.Diagnostics;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using TableWise.Models;

namespace TableWise.Services
{
    public static class DataService
    {
        static string url = "http://10.0.2.2:3000";
        // Egy közös HttpClient, hogy ne kelljen minden metódusban újat létrehozni
        static HttpClient client = new HttpClient();

        public static async Task<(bool Success, string Message)> RegisterAsync(string name, string email, string password, string role)
        {
            try
            {
                // 1. TOKEN KIOLVASÁSA ÉS BEÁLLÍTÁSA A FEJLÉCBE 🔑
                string token = Preferences.Get("user_token", string.Empty);

                client.DefaultRequestHeaders.Authorization = null; // Régi törlése a biztonság kedvéért
                if (!string.IsNullOrEmpty(token))
                {
                    client.DefaultRequestHeaders.Authorization =
                        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                }

                // 2. ADATOK ELŐKÉSZÍTÉSE
                var userData = new { name = name, email = email, password = password, role = role };
                var json = JsonSerializer.Serialize(userData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // 3. KÜLDÉS
                var response = await client.PostAsync($"{url}/api/users/register", content);
                var responseString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return (true, "Sikeres regisztráció!");
                }
                else
                {
                    // Speciális kezelés a jogosultság hibára
                    if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized ||
                        response.StatusCode == System.Net.HttpStatusCode.Forbidden)
                    {
                        return (false, "Nincs jogosultságod (Admin/Manager szint szükséges)!");
                    }

                    try
                    {
                        var errorDoc = JsonDocument.Parse(responseString);
                        var msg = errorDoc.RootElement.GetProperty("msg").GetString();
                        return (false, msg);
                    }
                    catch
                    {
                        return (false, "Hiba történt a regisztráció során.");
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Regisztrációs hiba: {ex.Message}");
                return (false, "Nem sikerült elérni a szervert.");
            }
        }

        public static async Task<bool> LoginAsync(string email, string password)
        {
            try
            {
                var loginData = new { email = email, password = password };
                var json = JsonSerializer.Serialize(loginData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // A te backend útvonalad: /api/users/login
                var response = await client.PostAsync($"{url}/api/users/login", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseString = await response.Content.ReadAsStringAsync();
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var result = JsonSerializer.Deserialize<LoginResponse>(responseString, options);

                    if (result != null && !string.IsNullOrEmpty(result.Token))
                    {
                        // Elmentjük a tokent biztonságosan
                        Preferences.Set("user_token", result.Token);
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"HIBA A BEJELENTKEZÉSNÉL: {ex.Message}");
            }
            return false;
        }

        public static void Logout()
        {
            // Egyszerűen töröljük a tokent a telefonról
            Preferences.Remove("user_token");
        }

        // --- DATA FETCHING ---

        public static async Task<RegisterModel> GetCurrentUserAsync()
        {
            try
            {
                string token = Preferences.Get("user_token", string.Empty);
                if (string.IsNullOrEmpty(token)) return null;

                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                var response = await client.GetAsync($"{url}/api/users/me"); // Figyelj az útvonalra!

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                    // A backend "data: { ... }" formátumban küldi, ezért egy belső osztály kell
                    var wrapper = JsonSerializer.Deserialize<UserWrapper>(json, options);
                    return wrapper?.Data;
                }
            }
            catch (Exception ex) { Debug.WriteLine($"Me hiba: {ex.Message}"); }
            return null;
        }

        // Segédosztály a deszerializációhoz
        public class UserWrapper { public RegisterModel Data { get; set; } }

        public static async Task<List<Category>> GetCategories()
        {
            try
            {
                var response = await client.GetAsync($"{url}/api/mealCategories");

                if (response.IsSuccessStatusCode)
                {
                    string result = await response.Content.ReadAsStringAsync();
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var wrapper = JsonSerializer.Deserialize<CategoryResponse>(result, options);
                    return wrapper?.Categories ?? new List<Category>();
                }
            }
            catch (Exception ex) { Debug.WriteLine($"HIBA: {ex.Message}"); }
            return new List<Category>();
        }

        public static async Task<List<FoodItem>> GetMealsByCategory(int categoryId)
        {
            try
            {
                var response = await client.GetAsync($"{url}/api/mealCategories/{categoryId}/meals");

                if (response.IsSuccessStatusCode)
                {
                    string result = await response.Content.ReadAsStringAsync();
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var wrapper = JsonSerializer.Deserialize<FoodResponse>(result, options);
                    return wrapper?.Meals ?? new List<FoodItem>();
                }
            }
            catch (Exception ex) { Debug.WriteLine($"Hiba az ételek lekérésekor: {ex.Message}"); }
            return new List<FoodItem>();
        }

        public static async Task<List<InventoryItem>> GetFridgeItemsAsync()
        {
            try
            {
                string token = Preferences.Get("user_token", string.Empty);
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                var response = await client.GetAsync($"{url}/api/fridgeItems/");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<List<InventoryItem>>(json,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                }
            }
            catch (Exception ex) { Debug.WriteLine($"Raktár hiba: {ex.Message}"); }
            return new List<InventoryItem>();
        }

        // --- HELPER MODELS ---

        public class LoginResponse
        {
            public string Token { get; set; }
        }

        public class CategoryResponse
        {
            [JsonPropertyName("data")]
            public List<Category> Categories { get; set; }
        }

        public class FoodResponse
        {
            [JsonPropertyName("data")]
            public List<FoodItem> Meals { get; set; }
        }
    }
}