package com.example.healthydinner.data

import com.example.healthydinner.BuildConfig
import com.example.healthydinner.api.RetrofitClient

class MealRepository(private val dao: MealDao) {
    fun getMeals(weekTag: String) = dao.getMealsForWeek(weekTag)

    suspend fun refreshMeals(weekTag: String) {
        try {
            val response = RetrofitClient.instance.getRandomRecipes(7, BuildConfig.SPOONACULAR_API_KEY)
            val meals = response.recipes.mapIndexed { index, dto ->
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
