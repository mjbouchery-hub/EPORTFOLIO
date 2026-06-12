package com.example.healthydinner

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.example.healthydinner.ui.MealViewModel
import com.example.healthydinner.ui.theme.HealthyDinnerTheme

class MainActivity : ComponentActivity() {
    private val viewModel: MealViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            HealthyDinnerTheme {
                val meals by viewModel.meals.collectAsState()
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    LazyColumn(modifier = Modifier.padding(innerPadding)) {
                        items(meals) { meal ->
                            Text(text = meal.title, modifier = Modifier.padding(innerPadding))
                        }
                    }
                }
            }
        }
    }
}
