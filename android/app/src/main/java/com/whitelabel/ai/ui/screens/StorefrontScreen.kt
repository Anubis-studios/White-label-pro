package com.whitelabel.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.whitelabel.ai.data.ApiService
import com.whitelabel.ai.data.ProductDto
import com.whitelabel.ai.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StorefrontScreen(
    apiService: ApiService,
    onSelectProduct: (ProductDto) -> Unit
) {
    var products by remember { mutableStateOf<List<ProductDto>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        scope.launch {
            try {
                products = apiService.getStorefrontProducts()
            } catch (e: Exception) {
                // Fallback mock data if server unavailable
                products = listOf(
                    ProductDto("p1", "Makko AI - Single Asset", "Generate 1 2D/3D game asset using AI engine.", "image", 1, "£0.30"),
                    ProductDto("p2", "RunwayML - Short Trailer", "Generate cinematic short AI trailer video.", "video", 1, "£0.30"),
                    ProductDto("p3", "ElevenLabs - Voice Line", "Synthesize custom NPC dialogue voice line.", "audio", 1, "£0.30"),
                    ProductDto("p4", "PixelLab.ai - Asset Pack (5)", "Generate 5 pixel art sprite assets bundle.", "image", 5, "£1.50"),
                    ProductDto("p5", "AIVA - Theme Track", "Compose soundtrack or ambient game music.", "audio", 1, "£0.30")
                )
            } finally {
                isLoading = false
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "CYBER-AI PLATFORM",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 2.sp
                    )
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
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp)
                    .background(
                        brush = Brush.horizontalGradient(listOf(DarkBackground, SurfaceDark)),
                        shape = RoundedCornerShape(16.dp)
                    )
                    .border(1.dp, NeonPurple, RoundedCornerShape(16.dp))
                    .padding(16.dp)
            ) {
                Column {
                    Text("AUTONOMOUS MEDIA AI", color = ElectricBlue, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Game Assets, AI Video & Audio Synthesizer", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                }
            }

            if (isLoading) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = ElectricBlue)
                }
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(products) { product ->
                        ProductCard(product = product, onClick = { onSelectProduct(product) })
                    }
                }
            }
        }
    }
}

@Composable
fun ProductCard(product: ProductDto, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .border(1.dp, NeonPurple, RoundedCornerShape(12.dp)),
        colors = CardDefaults.cardColors(containerColor = DarkBackground),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    color = ElectricBlue.copy(alpha = 0.2f),
                    shape = RoundedCornerShape(4.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, ElectricBlue)
                ) {
                    Text(
                        text = "${product.unitLabel.uppercase()} • ${product.unitsPerPurchase} UNIT(S)",
                        color = ElectricBlue,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
                Text(
                    text = product.formattedPrice ?: "£0.30",
                    color = GoldAccent,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(product.name, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(product.description ?: "", color = Color.LightGray, fontSize = 14.sp)
        }
    }
}
