require('dotenv').config()
const mongoose = require('mongoose')
const { User } = require('../models/userModel')
const { WorkHour } = require('../models/workHourModel')
const { WorkSchedule } = require('../models/workScheduleModel')
const { Meal } = require('../models/mealModel')
const { MealCategory } = require('../models/mealCategoryModel')
const { Users, WorkHours, WorkSchedules, Meals, MealCategories } = require('./seedData')

const collectionSeeder = async (Model, Data) => {
    await Model.deleteMany({})
    for (let i = 0; i < Data.length; i++) {
        await Model.create(Data[i]);
    }
}

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        await collectionSeeder(User, Users)
        await collectionSeeder(Meal, Meals)
        await collectionSeeder(MealCategory, MealCategories)
        await collectionSeeder(WorkHour, WorkHours)
        await collectionSeeder(WorkSchedule, WorkSchedules)

        console.log('All collections seeded successfully!')
    } catch (err) {
        console.error('Seeding process failed:', err)
    } finally {
        await mongoose.connection.close()
        process.exit(0)
    }
}

seedDB();