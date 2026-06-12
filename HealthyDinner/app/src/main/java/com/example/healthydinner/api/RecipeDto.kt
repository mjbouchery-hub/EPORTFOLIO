package com.example.healthydinner.api

data class RecipeResponse(
    val recipes: List<RecipeDto>
)

data class RecipeDto(
    val id: Int,
    val title: String,
    val image: String
)
