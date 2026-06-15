package com.example.healthydinner.data

import com.example.healthydinner.BuildConfig
import com.example.healthydinner.api.RetrofitClient

class MealRepository(private val dao: MealDao) {
    fun getMeals(weekTag: String) = dao.getMealsForWeek(weekTag)

    suspend fun refreshMeals(
        weekTag: String,
        quick: Boolean = false,
        kidFriendly: Boolean = false,
        crockpot: Boolean = false
    ) {
        try {
            val tags = buildList {
                add("main course")
                add("dinner")

                if (kidFriendly) add("kid friendly")
                if (crockpot) add("slow cooker")
            }.joinToString(",")

            val response = RetrofitClient.instance.getRandomRecipes(
                number = 20,
                apiKey = BuildConfig.SPOONACULAR_API_KEY,
                tags = tags
            )

            val filteredRecipes = response.recipes.filter { dto ->
                if (quick) {
                    dto.readyInMinutes <= 40
                } else {
                    true
                }
            }

            val meals = filteredRecipes.take(7).mapIndexed { index, dto ->
                Meal(
                    title = dto.title,
                    imageUrl = dto.image,
                    weekTag = weekTag,
                    dayOfWeek = index,
                    readyInMinutes = dto.readyInMinutes,
                    servings = dto.servings,
                    ingredients = dto.extendedIngredients?.joinToString("\n") { it.original } ?: "",
                    instructions = dto.instructions ?: ""
                )
            }

            dao.deleteWeek(weekTag)
            dao.insertAll(meals)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}