package com.example.healthydinner.api

data class RecipeResponse(
    val recipes: List<RecipeDto>
)

data class RecipeDto(
    val id: Int,
    val title: String,
    val image: String,
    val readyInMinutes: Int = 0,
    val servings: Int = 0,
    val instructions: String? = "",
    val extendedIngredients: List<IngredientDto>? = emptyList()
)

data class IngredientDto(
    val original: String
)
