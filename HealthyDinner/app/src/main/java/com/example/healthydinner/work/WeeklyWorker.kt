package com.example.healthydinner.work

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.example.healthydinner.data.AppDatabase
import com.example.healthydinner.data.MealRepository

class WeeklyWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val database = AppDatabase.getDatabase(applicationContext)
        val repository = MealRepository(database.mealDao())
        repository.refreshMeals("current_week")
        return Result.success()
    }
}
