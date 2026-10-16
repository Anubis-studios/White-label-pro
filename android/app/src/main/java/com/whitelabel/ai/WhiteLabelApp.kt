package com.whitelabel.ai

import androidx.compose.runtime.*
import com.whitelabel.ai.data.ApiService
import com.whitelabel.ai.data.CheckoutResponse
import com.whitelabel.ai.data.ProductDto
import com.whitelabel.ai.ui.screens.ProductDetailScreen
import com.whitelabel.ai.ui.screens.ResultScreen
import com.whitelabel.ai.ui.screens.StorefrontScreen

enum class Screen {
    STOREFRONT,
    PRODUCT_DETAIL,
    RESULT
}

@Composable
fun WhiteLabelApp() {
    val apiService = remember { ApiService.create() }
    var currentScreen by remember { mutableStateOf(Screen.STOREFRONT) }
    var selectedProduct by remember { mutableStateOf<ProductDto?>(null) }
    var executionResponse by remember { mutableStateOf<CheckoutResponse?>(null) }

    when (currentScreen) {
        Screen.STOREFRONT -> {
            StorefrontScreen(
                apiService = apiService,
                onSelectProduct = { product ->
                    selectedProduct = product
                    currentScreen = Screen.PRODUCT_DETAIL
                }
            )
        }
        Screen.PRODUCT_DETAIL -> {
            selectedProduct?.let { product ->
                ProductDetailScreen(
                    product = product,
                    apiService = apiService,
                    onBack = { currentScreen = Screen.STOREFRONT },
                    onExecutionComplete = { response ->
                        executionResponse = response
                        currentScreen = Screen.RESULT
                    }
                )
            }
        }
        Screen.RESULT -> {
            executionResponse?.let { response ->
                ResultScreen(
                    response = response,
                    onBackToStorefront = { currentScreen = Screen.STOREFRONT }
                )
            }
        }
    }
}
