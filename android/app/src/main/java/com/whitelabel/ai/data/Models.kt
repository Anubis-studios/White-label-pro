package com.whitelabel.ai.data

import com.google.gson.annotations.SerializedName

data class ProductDto(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("description") val description: String?,
    @SerializedName("unitLabel") val unitLabel: String,
    @SerializedName("unitsPerPurchase") val unitsPerPurchase: Int,
    @SerializedName("formattedPrice") val formattedPrice: String?
)

data class CheckoutRequest(
    @SerializedName("productId") val productId: String,
    @SerializedName("userId") val userId: String = "android_user_1",
    @SerializedName("quantity") val quantity: Int = 1,
    @SerializedName("payload") val payload: Map<String, String> = emptyMap()
)

data class ExecutionResult(
    @SerializedName("imageUrl") val imageUrl: String?,
    @SerializedName("videoUrl") val videoUrl: String?,
    @SerializedName("audioUrl") val audioUrl: String?,
    @SerializedName("text") val text: String?,
    @SerializedName("prompt") val prompt: String?
)

data class CheckoutResponse(
    @SerializedName("status") val status: String,
    @SerializedName("transactionId") val transactionId: String?,
    @SerializedName("result") val result: ExecutionResult?
)
