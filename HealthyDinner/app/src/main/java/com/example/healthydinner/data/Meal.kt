package com.example.healthydinner.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "meals")
data class Meal(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val imageUrl: String,
    val weekTag: String,
    val dayOfWeek: Int = 0,
    val readyInMinutes: Int = 0,
    val servings: Int = 0,
    val ingredients: String = "",
    val instructions: String = ""
)
