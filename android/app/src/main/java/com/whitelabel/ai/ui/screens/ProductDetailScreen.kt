package com.whitelabel.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.whitelabel.ai.data.ApiService
import com.whitelabel.ai.data.CheckoutRequest
import com.whitelabel.ai.data.CheckoutResponse
import com.whitelabel.ai.data.ProductDto
import com.whitelabel.ai.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductDetailScreen(
    product: ProductDto,
    apiService: ApiService,
    onBack: () -> Unit,
    onExecutionComplete: (CheckoutResponse) -> Unit
) {
    var promptInput by remember { mutableStateOf("") }
    var isExecuting by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(product.name, color = Color.White) },
                navigationIcon = {
                    TextButton(onClick = onBack) {
                        Text("< Back", color = ElectricBlue)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground)
            )
        },
        containerColor = CosmicBlack
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .padding(16.dp)
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, ElectricBlue, RoundedCornerShape(12.dp)),
                colors = CardDefaults.cardColors(containerColor = DarkBackground)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("PRODUCT DETAILS", color = ElectricBlue, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(product.name, color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(product.description ?: "", color = Color.LightGray, fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text("Unit Price: ${product.formattedPrice ?: "£0.30"}", color = GoldAccent, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            OutlinedTextField(
                value = promptInput,
                onValueChange = { promptInput = it },
                label = { Text("Enter Prompt / Parameters", color = ElectricBlue) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = NeonPurple,
                    unfocusedBorderColor = DarkBackground,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                )
            )

            Spacer(modifier = Modifier.height(20.dp))

            if (errorMessage != null) {
                Text(errorMessage!!, color = Color.Red, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(12.dp))
            }

            Button(
                onClick = {
                    isExecuting = true
                    errorMessage = null
                    scope.launch {
                        try {
                            val req = CheckoutRequest(
                                productId = product.id,
                                payload = mapOf("prompt" to promptInput.ifEmpty { "Default Cyber AI Generation" })
                            )
                            val response = apiService.checkout(req)
                            onExecutionComplete(response)
                        } catch (e: Exception) {
                            errorMessage = "Execution failed: ${e.message}"
                        } finally {
                            isExecuting = false
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = NeonPurple),
                shape = RoundedCornerShape(10.dp),
                enabled = !isExecuting
            ) {
                if (isExecuting) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                } else {
                    Text("GENERATE NOW", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
