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

                var response = await client.PostAsync($"{url}/api/users/login", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseString = await response.Content.ReadAsStringAsync();

                    // Ez a beállítás a titkos fegyver: rugalmassá teszi a JSON olvasást
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString
                    };

                    var result = JsonSerializer.Deserialize<LoginResponse>(responseString, options);

                    if (result != null && !string.IsNullOrEmpty(result.Token))
                    {
                        Preferences.Set("user_token", result.Token);

                        // Csak akkor mentjük az ID-t, ha létezik, és szövegként tároljuk
                        if (result.User != null)
                        {
                            Preferences.Set("user_id", result.User.id.ToString());
                        }

                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Login Error: {ex.Message}");
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

                // Próbáld meg a végén perjel nélkül!
                var response = await client.GetAsync($"{url}/api/fridgeItems");

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    Debug.WriteLine($"📄 Beérkező JSON: {json}");

                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                    // Mivel a hiba szerint 'Array' érkezik, közvetlenül listává alakítjuk:
                    var list = JsonSerializer.Deserialize<List<InventoryItem>>(json, options);

                    return list ?? new List<InventoryItem>();
                }
                else
                {
                    Debug.WriteLine($"📡 API hiba: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"HIBA A FELDOLGOZÁSNÁL: {ex.Message}");
            }
            return new List<InventoryItem>();
        }

        // Változott a visszatérési típus: hozzáadtuk a string NewId-t
        public static async Task<(bool Success, string Message, string NewId)> SubmitWorkScheduleAsync(DateTime date, int startHour, int endHour)
        {
            try
            {
                string token = Preferences.Get("user_token", string.Empty);
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                DateTime startDateTime = date.Date.AddHours(startHour);
                DateTime endDateTime = date.Date.AddHours(endHour);

                var scheduleData = new
                {
                    startDate = startDateTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                    endDate = endDateTime.ToString("yyyy-MM-ddTHH:mm:ss")
                };

                var json = JsonSerializer.Serialize(scheduleData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync($"{url}/api/hours/", content);
                var responseString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    // Kiolvassuk az ID-t a válaszból (a backend a 'data' mezőben küldi az új objektumot)
                    using var doc = JsonDocument.Parse(responseString);
                    string newId = doc.RootElement.GetProperty("data").GetProperty("_id").GetString();

                    return (true, "Idősáv létrehozva!", newId);
                }
                else
                {
                    var errorDoc = JsonDocument.Parse(responseString);
                    var errorMessage = errorDoc.RootElement.TryGetProperty("msg", out var msgElement)
                                       ? msgElement.GetString() : "Hiba az idősávnál.";
                    return (false, errorMessage, null);
                }
            }
            catch (Exception ex)
            {
                return (false, $"Hálózati hiba: {ex.Message}", null);
            }
        }

        public static async Task<(bool Success, string Message)> LinkScheduleToUserAsync(string workHoursId)
        {
            try
            {
                string token = Preferences.Get("user_token", string.Empty);
                // FIGYELEM: A bejelentkezett felhasználó ID-ját el kell mentened Login-kor!
                string userId = Preferences.Get("user_id", string.Empty);

                if (string.IsNullOrEmpty(userId)) return (false, "Hiányzó felhasználó azonosító. Jelentkezz be újra!");

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var assignmentData = new
                {
                    usersId = userId,
                    workHoursId = workHoursId,
                    isAccepted = true
                };

                var json = JsonSerializer.Serialize(assignmentData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync($"{url}/api/schedules", content);
                var responseString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return (true, "Sikeres hozzárendelés!");
                }
                else
                {
                    using var doc = JsonDocument.Parse(responseString);
                    string msg = doc.RootElement.TryGetProperty("msg", out var m) ? m.GetString() : "Hiba a mentésnél.";
                    return (false, msg);
                }
            }
            catch (Exception ex)
            {
                return (false, $"Hálózati hiba: {ex.Message}");
            }
        }

        public static async Task<List<WorkHour>> GetUpcomingSchedulesAsync()
        {
            try
            {
                string token = Preferences.Get("user_token", string.Empty);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await client.GetAsync($"{url}/api/hours/me");

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();

                    // Hibakeresés: Írassuk ki, mit kapunk!
                    System.Diagnostics.Debug.WriteLine($"DEBUG JSON: {json}");

                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        // Ez a beállítás megoldja a "szám vs string" problémák nagy részét:
                        NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString
                    };

                    // Ha a JSON-ben a 'data' kulcs alatt van a lista:
                    using var doc = JsonDocument.Parse(json);
                    if (doc.RootElement.TryGetProperty("data", out var dataArray))
                    {
                        var allHours = JsonSerializer.Deserialize<List<WorkHour>>(dataArray.GetRawText(), options);

                        return allHours?
                            .Where(h => h.EndDate >= DateTime.Now)
                            .OrderBy(h => h.StartDate)
                            .ToList() ?? new List<WorkHour>();
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"HIBA: {ex.Message}");
            }
            return new List<WorkHour>();
        }

        // --- HELPER MODELS ---
        public class LoginResponse
        {
            public string Token { get; set; }
            public UserData User { get; set; }
        }

        public class UserData
        {
            public int id { get; set; } // Itt most int, mert a backend számot küld
            public string email { get; set; }
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