package com.example.healthydinner.api

import retrofit2.http.GET
import retrofit2.http.Query

interface SpoonacularApi {
    @GET("recipes/random")
    suspend fun getRandomRecipes(
        @Query("number") number: Int,
<<<<<<< HEAD
        @Query("apiKey") apiKey: String,
        @Query("tags") tags: String? = null
=======
        @Query("apiKey") apiKey: String
>>>>>>> 2bc7f023f944644bcbb17284d7aca3f59ea66817
    ): RecipeResponse
}
