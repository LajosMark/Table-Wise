db = db.getSiblingDB("tablewise");


db.createCollection("users");
db.createCollection("orders");
db.createCollection("ingridients");
db.createCollection("meals");
db.createCollection("storageItems");
db.createCollection("storageCategories");
db.createCollection("mealCategories");
db.createCollection("workSchedules");
db.createCollection("workHours");

print("Adatbázis inicializálás sikeres!");
print("Tablewise adatbázis létrehozva!");
print("Tablewise kollekcióban példa record beszúrva!");