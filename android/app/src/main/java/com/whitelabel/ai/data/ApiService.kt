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
        private const val BASE_URL = "http://10.0.2.2:5000/" // Default local emulator backend URL

        fun create(): ApiService {
            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(ApiService::class.java)
        }
    }
}
