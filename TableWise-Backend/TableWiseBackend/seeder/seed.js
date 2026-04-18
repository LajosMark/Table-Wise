//require('dotenv').config()
const mongoose = require('mongoose')
//Models import
const { User } = require('../models/userModel')
const { WorkHour } = require('../models/workHourModel')
const { WorkSchedule } = require('../models/workScheduleModel')
const { Meal } = require('../models/mealModel')
const { MealCategory } = require('../models/mealCategoryModel')
const { Ingredient } = require('../models/ingridientModel')
const { Order } = require('../models/orderModel')
const { FridgeItem } = require('../models/fridgeItemModel')
const Counter = require('../models/counterModel');

//Data import
const { Data } = require('./seedData')

//Main
const collectionSeeder = async (Model, Data) => {
    await Model.deleteMany({})
    for (let i = 0; i < Data.length; i++) {
        await Model.create(Data[i]);
    }
}

const seedDB = async () => {
    try {
        mongoose.connect(process.env.DATABASE_URL,{
            dbName: 'tablewise'
        })

        const userCount = await User.countDocuments()
        
        if (userCount > 0) {
            console.log('Adatbázis már inicializálva van. Kihagyás...')
            await mongoose.connection.close()
            process.exit(0)
        }

        await collectionSeeder(Counter, Data.Counters)
        await collectionSeeder(User, Data.Users)
        await collectionSeeder(Meal, Data.Meals)
        await collectionSeeder(MealCategory, Data.MealCategories)
        await collectionSeeder(WorkHour, Data.WorkHours)
        await collectionSeeder(WorkSchedule, Data.WorkSchedules)
        await collectionSeeder(Ingredient, Data.Ingridients)
        await collectionSeeder(Order, Data.Orders)
        await collectionSeeder(FridgeItem, Data.FridgeItems)

        console.log('All collections seeded successfully!')
    } catch (err) {
        console.error('Seeding process failed:', err)
    } finally {
        await mongoose.connection.close()
        process.exit(0)
    }
}

seedDB();