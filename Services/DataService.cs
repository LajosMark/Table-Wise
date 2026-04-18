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
                    // 1. Itt olvassuk ki a választ ELŐSZÖR és UTOLJÁRA
                    var responseString = await response.Content.ReadAsStringAsync();

                    // Debug ablak (opcionális, de hasznos)
                    await Application.Current.MainPage.DisplayAlert("LOGIN JSON", responseString, "OK");

                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString
                    };

                    // 2. Deszerializáljuk a már kiolvasott responseString-et
                    var result = JsonSerializer.Deserialize<LoginResponse>(responseString, options);

                    if (result != null && !string.IsNullOrEmpty(result.Token))
                    {
                        Preferences.Set("user_token", result.Token);

                        // 3. Mivel a Login JSON üres volt, lekérjük az adatokat a /me végpontról
                        var user = await GetCurrentUserAsync();
                        if (user != null)
                        {
                            // Itt az 'id' mezőt mentjük el szövegként
                            Preferences.Set("user_id", user.id.ToString());
                            Debug.WriteLine($"✅ ID mentve: {user.id}");
                        }

                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Login Error: {ex.Message}");
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

                var scheduleData = new Dictionary<string, object>
{
    { "startDate", startDateTime.ToString("yyyy-MM-ddTHH:mm:ss") },
    { "endDate", endDateTime.ToString("yyyy-MM-ddTHH:mm:ss") },
    { "isAccepted", false } // Maradjon false, de nézzük meg a beállításokat
};

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase // Biztosítja a kisbetűs neveket
                };

                var json = JsonSerializer.Serialize(scheduleData, options);
                Debug.WriteLine($"📤 KÜLDÖTT PAYLOAD: {json}");
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync($"{url}/api/hours/", content);
                var responseString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    using var doc = JsonDocument.Parse(responseString);
                    // Módosítás: GetInt32-t használunk, mert a backend számot küld!
                    int newId = doc.RootElement.GetProperty("data").GetProperty("_id").GetInt32();

                    return (true, "Idősáv létrehozva!", newId.ToString());
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
                string userId = Preferences.Get("user_id", string.Empty);

                if (string.IsNullOrEmpty(userId)) return (false, "Jelentkezz be újra!");

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                // Átalakítjuk számmá, ha a backend azt várja (mivel az adatbázisodban 1 szerepel, nem "1")
                var assignmentData = new
                {
                    usersId = userId, // String marad
                    workHoursId = workHoursId, // String marad
                    isAccepted = false
                };

                var json = JsonSerializer.Serialize(assignmentData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync($"{url}/api/schedules", content);
                var responseString = await response.Content.ReadAsStringAsync();

                MainThread.BeginInvokeOnMainThread(async () =>
                {
                    await Application.Current.MainPage.DisplayAlert("DEBUG VÁLASZ", responseString, "OK");
                });
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

                // Debug log: nézzük meg, mit kérünk le
                Debug.WriteLine($"📡 Lekérés indítása: {url}/api/schedules/my");

                var response = await client.GetAsync($"{url}/api/schedules/my");

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    Debug.WriteLine($"🔍 DEBUG JSON FOGADVA: {json}");

                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        // Ez segít, ha a backend néha idézőjelbe teszi a számokat:
                        NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString
                    };

                    // 1. Próbálkozás: Deszerializáció a WorkHourResponse wrapperrel
                    var wrapper = JsonSerializer.Deserialize<WorkHourResponse>(json, options);

                    // 2. Mentőöv: Ha a wrapper üres, de van 'data' kulcs a JSON-ben
                    if (wrapper?.Data == null || wrapper.Data.Count == 0)
                    {
                        using var doc = JsonDocument.Parse(json);
                        if (doc.RootElement.TryGetProperty("data", out var dataArray))
                        {
                            var manualList = JsonSerializer.Deserialize<List<WorkHour>>(dataArray.GetRawText(), options);
                            if (manualList != null) return manualList;
                        }
                    }

                    return wrapper?.Data ?? new List<WorkHour>();
                }
                else
                {
                    Debug.WriteLine($"⚠️ API Hiba: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"❌ Lekérési hiba: {ex.Message}");
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
            // Megpróbáljuk mindkét népszerű verziót lefedni
            [JsonPropertyName("_id")]
            public object _id { get; set; }

            [JsonPropertyName("id")]
            public object id { get; set; }

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