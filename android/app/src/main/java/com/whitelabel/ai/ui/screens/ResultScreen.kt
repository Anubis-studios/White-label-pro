package com.whitelabel.ai.ui.screens

import android.net.Uri
import android.widget.MediaController
import android.widget.VideoView
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import coil.compose.AsyncImage
import com.whitelabel.ai.data.CheckoutResponse
import com.whitelabel.ai.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ResultScreen(
    response: CheckoutResponse,
    onBackToStorefront: () -> Unit
) {
    val result = response.result

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("EXECUTION RESULT", color = Color.White) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground)
            )
        },
        containerColor = CosmicBlack
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DarkBackground, RoundedCornerShape(12.dp))
                    .border(1.dp, ElectricBlue, RoundedCornerShape(12.dp))
                    .padding(16.dp)
            ) {
                Column {
                    Text("GENERATION COMPLETE", color = ElectricBlue, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Transaction ID: ${response.transactionId ?: "TX-SUCCESS"}", color = Color.White, fontSize = 14.sp)
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            when {
                result?.imageUrl != null -> {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, NeonPurple, RoundedCornerShape(12.dp)),
                        colors = CardDefaults.cardColors(containerColor = DarkBackground)
                    ) {
                        AsyncImage(
                            model = result.imageUrl,
                            contentDescription = "Generated Image",
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(300.dp)
                        )
                    }
                }
                result?.videoUrl != null -> {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(300.dp)
                            .border(1.dp, ElectricBlue, RoundedCornerShape(12.dp)),
                        colors = CardDefaults.cardColors(containerColor = Color.Black)
                    ) {
                        AndroidView(
                            factory = { context ->
                                VideoView(context).apply {
                                    setVideoURI(Uri.parse(result.videoUrl))
                                    val mediaController = MediaController(context)
                                    mediaController.setAnchorView(this)
                                    setMediaController(mediaController)
                                    start()
                                }
                            },
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                }
                result?.audioUrl != null -> {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, GoldAccent, RoundedCornerShape(12.dp)),
                        colors = CardDefaults.cardColors(containerColor = DarkBackground)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Audio Generated", color = GoldAccent, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("Audio URL: ${result.audioUrl}", color = Color.White, fontSize = 12.sp)
                        }
                    }
                }
                result?.text != null -> {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, ElectricBlue, RoundedCornerShape(12.dp)),
                        colors = CardDefaults.cardColors(containerColor = DarkBackground)
                    ) {
                        Text(
                            text = result.text,
                            color = Color.Green,
                            fontSize = 14.sp,
                            modifier = Modifier.padding(16.dp)
                        )
                    }
                }
                else -> {
                    Text("Result payload received successfully.", color = Color.White)
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            Button(
                onClick = onBackToStorefront,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = NeonPurple),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text("RETURN TO STOREFRONT", color = Color.White, fontWeight = FontWeight.Bold)
            }
        }
    }
}
