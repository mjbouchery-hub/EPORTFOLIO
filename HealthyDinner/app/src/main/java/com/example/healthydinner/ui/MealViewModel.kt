package com.example.healthydinner.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.healthydinner.data.AppDatabase
import com.example.healthydinner.data.Meal
import com.example.healthydinner.data.MealRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class MealViewModel(app: Application) : AndroidViewModel(app) {

    private val repo = MealRepository(
        AppDatabase.getDatabase(app).mealDao()
    )

    private val weekTag = "current_week"

    val meals: StateFlow<List<Meal>> = repo.getMeals(weekTag)
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        viewModelScope.launch {
            repo.refreshMeals(weekTag)
        }
    }

    fun regenerate() {
        viewModelScope.launch {
            repo.refreshMeals(weekTag)
        }
    }
}