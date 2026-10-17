package com.whitelabel.ai.data

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ApiService {
    @GET("api/storefront")
    suspend fun getStorefrontProducts(): List<ProductDto>

    @POST("api/checkout")
    suspend fun checkout(@Body request: CheckoutRequest): CheckoutResponse

    companion object {
        fun create(): ApiService {
            val url = if (com.whitelabel.ai.BuildConfig.BASE_URL.isNotBlank()) {
                if (com.whitelabel.ai.BuildConfig.BASE_URL.endsWith("/")) {
                    com.whitelabel.ai.BuildConfig.BASE_URL
                } else {
                    "${com.whitelabel.ai.BuildConfig.BASE_URL}/"
                }
            } else {
                "https://white-label-ai-backend.onrender.com/"
            }

            return Retrofit.Builder()
                .baseUrl(url)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(ApiService::class.java)
        }
    }
}
