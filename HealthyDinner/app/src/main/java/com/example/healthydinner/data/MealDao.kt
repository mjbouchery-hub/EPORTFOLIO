package com.example.healthydinner.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface MealDao {
    @Query("SELECT * FROM meals WHERE weekTag = :weekTag")
    fun getMealsForWeek(weekTag: String): Flow<List<Meal>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(meals: List<Meal>)

    @Query("DELETE FROM meals WHERE weekTag = :weekTag")
    suspend fun deleteWeek(weekTag: String)
}