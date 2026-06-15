package com.example.healthydinner.api

import retrofit2.http.GET
import retrofit2.http.Query

interface SpoonacularApi {
    @GET("recipes/random")
    suspend fun getRandomRecipes(
        @Query("number") number: Int,
        @Query("apiKey") apiKey: String,
        @Query("tags") tags: String? = null
    ): RecipeResponse
}
