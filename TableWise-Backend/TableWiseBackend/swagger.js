module.exports = {
    openapi: '3.0.3',
    info: {
        title: 'Table Wise Backend API',
        version: '1.0.0',
        description: 'Swagger documentation for the Table Wise backend.'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local development server'
        }
    ],
    tags: [
        { name: 'Users' },
        { name: 'Work Hours' },
        { name: 'Work Schedules' },
        { name: 'Meals' },
        { name: 'Meal Categories' },
        { name: 'Ingredients' },
        { name: 'Orders' },
        { name: 'Fridge Items' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            TokenResponse: {
                type: 'object',
                properties: {
                    token: { type: 'string' }
                }
            },
            MessageResponse: {
                type: 'object',
                properties: {
                    msg: { type: 'string' }
                }
            },
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'integer' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    role: { type: 'string', enum: ['employee', 'manager', 'admin'] },
                    createdAt: { type: 'string', format: 'date-time' },
                    tokenInvalidBefore: { type: 'string', format: 'date-time', nullable: true }
                }
            },
            UserCreateInput: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    role: { type: 'string', enum: ['employee', 'manager', 'admin'] }
                }
            },
            UserUpdateInput: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    role: { type: 'string', enum: ['employee', 'manager', 'admin'] }
                }
            },
            LoginInput: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' }
                }
            },
            UserIdResponse: {
                type: 'object',
                properties: {
                    msg: { type: 'integer' }
                }
            },
            WorkHour: {
                type: 'object',
                properties: {
                    _id: { type: 'integer' },
                    startDate: { type: 'string', format: 'date-time' },
                    endDate: { type: 'string', format: 'date-time' }
                }
            },
            WorkHourInput: {
                type: 'object',
                required: ['startDate', 'endDate'],
                properties: {
                    startDate: { type: 'string', format: 'date-time' },
                    endDate: { type: 'string', format: 'date-time' }
                }
            },
            WorkHourListResponse: {
                type: 'object',
                properties: {
                    count: { type: 'integer' },
                    data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/WorkHour' }
                    }
                }
            },
            WorkSchedule: {
                type: 'object',
                properties: {
                    _id: { type: 'integer' },
                    usersId: { oneOf: [{ type: 'integer' }, { $ref: '#/components/schemas/User' }] },
                    workHoursId: { oneOf: [{ type: 'integer' }, { $ref: '#/components/schemas/WorkHour' }] },
                    isAccepted: { type: 'boolean' }
                }
            },
            WorkScheduleInput: {
                type: 'object',
                required: ['usersId', 'workHoursId'],
                properties: {
                    usersId: { type: 'integer' },
                    workHoursId: { type: 'integer' },
                    isAccepted: { type: 'boolean' }
                }
            },
            WorkScheduleApprovalInput: {
                type: 'object',
                required: ['isAccepted'],
                properties: {
                    isAccepted: { type: 'boolean' }
                }
            },
            WorkScheduleListResponse: {
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/WorkSchedule' }
                    }
                }
            },
            Meal: {
                type: 'object',
                properties: {
                    _id: { type: 'integer' },
                    name: { type: 'string' },
                    price: { type: 'number' },
                    isAvailable: { type: 'boolean' },
                    categoryId: { type: 'integer' },
                    image: { type: 'string' }
                }
            },
            MealInput: {
                type: 'object',
                required: ['name', 'price', 'categoryId'],
                properties: {
                    name: { type: 'string' },
                    price: { type: 'number' },
                    isAvailable: { type: 'boolean' },
                    categoryId: { type: 'integer' },
                    image: { type: 'string' }
                }
            },
            MealImageUpload: {
                type: 'object',
                required: ['image'],
                properties: {
                    image: {
                        type: 'string',
                        format: 'binary'
                    }
                }
            },
            WrappedMealResponse: {
                type: 'object',
                properties: {
                    data: { $ref: '#/components/schemas/Meal' }
                }
            },
            WrappedMealListResponse: {
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Meal' }
                    }
                }
            },
            MealCategory: {
                type: 'object',
                properties: {
                    _id: { type: 'integer' },
                    name: { type: 'string' }
                }
            },
            MealCategoryInput: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string' }
                }
            },
            WrappedMealCategoryResponse: {
                type: 'object',
                properties: {
                    data: { $ref: '#/components/schemas/MealCategory' }
                }
            },
            WrappedMealCategoryListResponse: {
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/MealCategory' }
                    }
                }
            },
            Ingredient: {
                type: 'object',
                properties: {
                    _id: { type: 'integer' },
                    mealId: { type: 'integer' },
                    fridgeItemId: { type: 'integer' },
                    amountOfIngredient: { type: 'number' }
                }
            },
            IngredientInput: {
                type: 'object',
                required: ['mealId', 'fridgeItemId', 'amountOfIngredient'],
                properties: {
                    mealId: { type: 'integer' },
                    fridgeItemId: { type: 'integer' },
                    amountOfIngredient: { type: 'number' }
                }
            },
            Order: {
                type: 'object',
                properties: {
                    _id: { type: 'integer' },
                    mealId: { type: 'integer' },
                    discount: { type: 'number' },
                    amount: { type: 'integer' },
                    status: { type: 'string', enum: ['pending', 'completed', 'cancelled'] },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },
            OrderInput: {
                type: 'object',
                required: ['mealId', 'amount'],
                properties: {
                    mealId: { type: 'integer' },
                    discount: { type: 'number' },
                    amount: { type: 'integer' },
                    status: { type: 'string', enum: ['pending', 'completed', 'cancelled'] }
                }
            },
            FridgeItem: {
                type: 'object',
                properties: {
                    _id: { type: 'integer' },
                    name: { type: 'string' },
                    amount: { type: 'number' },
                    typeOfAmount: { type: 'string' },
                    pricePerUnit: { type: 'number' },
                    warningAmountPercentage: { type: 'integer' }
                }
            },
            FridgeItemInput: {
                type: 'object',
                required: ['name', 'amount', 'typeOfAmount', 'pricePerUnit', 'warningAmountPercentage'],
                properties: {
                    name: { type: 'string' },
                    amount: { type: 'number' },
                    typeOfAmount: { type: 'string' },
                    pricePerUnit: { type: 'number' },
                    warningAmountPercentage: { type: 'integer' }
                }
            }
        }
    },
    paths: {
        '/api/users/login': {
            post: {
                tags: ['Users'],
                summary: 'Log in a user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'JWT token',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/TokenResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/users/logout': {
            post: {
                tags: ['Users'],
                summary: 'Log out current user',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Logout confirmation',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MessageResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/users/register': {
            post: {
                tags: ['Users'],
                summary: 'Create a user',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/UserCreateInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'JWT token for created user',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/TokenResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/users/me': {
            get: {
                tags: ['Users'],
                summary: 'Get current user profile',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Current user',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: { $ref: '#/components/schemas/User' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/users/id': {
            post: {
                tags: ['Users'],
                summary: 'Get next user id',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Next user id',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UserIdResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/users': {
            get: {
                tags: ['Users'],
                summary: 'List users',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of users',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/User' }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/users/{id}': {
            patch: {
                tags: ['Users'],
                summary: 'Update a user',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/UserUpdateInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Updated user',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: { $ref: '#/components/schemas/User' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ['Users'],
                summary: 'Delete a user',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' }
                    }
                ],
                responses: {
                    200: {
                        description: 'Delete confirmation',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: { type: 'object' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/hours': {
            post: {
                tags: ['Work Hours'],
                summary: 'Create a work hour',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/WorkHourInput' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Created work hour',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: { $ref: '#/components/schemas/WorkHour' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            get: {
                tags: ['Work Hours'],
                summary: 'List work hours',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of work hours',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WorkHourListResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/hours/{id}': {
            patch: {
                tags: ['Work Hours'],
                summary: 'Update a work hour',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/WorkHourInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Updated work hour',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: { $ref: '#/components/schemas/WorkHour' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ['Work Hours'],
                summary: 'Delete a work hour',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    204: { description: 'Deleted' }
                }
            }
        },
        '/api/schedules': {
            get: {
                tags: ['Work Schedules'],
                summary: 'List all schedules',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of schedules',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WorkScheduleListResponse' }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Work Schedules'],
                summary: 'Create a schedule',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/WorkScheduleInput' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Created schedule',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: { $ref: '#/components/schemas/WorkSchedule' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/schedules/users/{id}': {
            get: {
                tags: ['Work Schedules'],
                summary: 'List schedules for one user',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: {
                        description: 'User schedules',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WorkScheduleListResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/schedules/my': {
            get: {
                tags: ['Work Schedules'],
                summary: 'Get current user schedules',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Current user schedules',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WorkScheduleListResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/schedules/{id}': {
            patch: {
                tags: ['Work Schedules'],
                summary: 'Approve or reject a schedule',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/WorkScheduleApprovalInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Updated schedule',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: { $ref: '#/components/schemas/WorkSchedule' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ['Work Schedules'],
                summary: 'Delete a schedule',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    204: { description: 'Deleted' }
                }
            }
        },
        '/api/meals': {
            get: {
                tags: ['Meals'],
                summary: 'List meals',
                responses: {
                    200: {
                        description: 'List of meals',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WrappedMealListResponse' }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Meals'],
                summary: 'Create a meal',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/MealInput' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Created meal',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WrappedMealResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/meals/{id}': {
            get: {
                tags: ['Meals'],
                summary: 'Get one meal',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: {
                        description: 'Meal details',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WrappedMealResponse' }
                            }
                        }
                    }
                }
            },
            patch: {
                tags: ['Meals'],
                summary: 'Update a meal',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/MealInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Updated meal',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WrappedMealResponse' }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ['Meals'],
                summary: 'Delete a meal',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    204: { description: 'Deleted' }
                }
            }
        },
        '/api/meals/{id}/image': {
            post: {
                tags: ['Meals'],
                summary: 'Upload a meal image',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: { $ref: '#/components/schemas/MealImageUpload' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Updated meal with image',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WrappedMealResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/meal-categories': {
            get: {
                tags: ['Meal Categories'],
                summary: 'List meal categories',
                responses: {
                    200: {
                        description: 'List of meal categories',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WrappedMealCategoryListResponse' }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Meal Categories'],
                summary: 'Create a meal category',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/MealCategoryInput' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Created category',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WrappedMealCategoryResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/meal-categories/{id}': {
            get: {
                tags: ['Meal Categories'],
                summary: 'Get one meal category',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: {
                        description: 'Category details',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WrappedMealCategoryListResponse' }
                            }
                        }
                    }
                }
            },
            patch: {
                tags: ['Meal Categories'],
                summary: 'Update a meal category',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/MealCategoryInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Updated category',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WrappedMealCategoryResponse' }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ['Meal Categories'],
                summary: 'Delete a meal category',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    204: { description: 'Deleted' }
                }
            }
        },
        '/api/meal-categories/{id}/meals': {
            get: {
                tags: ['Meal Categories'],
                summary: 'List meals in one category',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: {
                        description: 'Meals for category',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WrappedMealListResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/ingredients': {
            get: {
                tags: ['Ingredients'],
                summary: 'List ingredients',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of ingredients',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Ingredient' }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Ingredients'],
                summary: 'Create an ingredient',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/IngredientInput' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Created ingredient',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Ingredient' }
                            }
                        }
                    }
                }
            }
        },
        '/api/ingredients/meal/{mealId}': {
            get: {
                tags: ['Ingredients'],
                summary: 'List ingredients by meal',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'mealId', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: {
                        description: 'Ingredients for one meal',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Ingredient' }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/ingredients/{id}': {
            patch: {
                tags: ['Ingredients'],
                summary: 'Update an ingredient',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/IngredientInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Updated ingredient',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Ingredient' }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ['Ingredients'],
                summary: 'Delete an ingredient',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    204: { description: 'Deleted' }
                }
            }
        },
        '/api/orders': {
            get: {
                tags: ['Orders'],
                summary: 'List orders',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of orders',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Order' }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Orders'],
                summary: 'Create an order',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/OrderInput' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Created order',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Order' }
                            }
                        }
                    }
                }
            }
        },
        '/api/orders/{id}': {
            get: {
                tags: ['Orders'],
                summary: 'Get one order',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: {
                        description: 'Order details',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Order' }
                            }
                        }
                    }
                }
            },
            patch: {
                tags: ['Orders'],
                summary: 'Update an order',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/OrderInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Updated order',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Order' }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ['Orders'],
                summary: 'Delete an order',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    204: { description: 'Deleted' }
                }
            }
        },
        '/api/fridge-items': {
            get: {
                tags: ['Fridge Items'],
                summary: 'List fridge items',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of fridge items',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/FridgeItem' }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Fridge Items'],
                summary: 'Create a fridge item',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/FridgeItemInput' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Created fridge item',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/FridgeItem' }
                            }
                        }
                    }
                }
            }
        },
        '/api/fridge-items/{id}': {
            get: {
                tags: ['Fridge Items'],
                summary: 'Get one fridge item',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: {
                        description: 'Fridge item details',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/FridgeItem' }
                            }
                        }
                    }
                }
            },
            patch: {
                tags: ['Fridge Items'],
                summary: 'Update a fridge item',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/FridgeItemInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Updated fridge item',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/FridgeItem' }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ['Fridge Items'],
                summary: 'Delete a fridge item',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    204: { description: 'Deleted' }
                }
            }
        }
    }
};
