package com.krishna.nsm;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import androidx.appcompat.app.AppCompatActivity;
import com.krishna.nsm.databinding.ActivitySplashBinding;
import java.io.IOException;
import java.io.InputStream;

@SuppressLint("CustomSplashScreen")
public class SplashActivity extends AppCompatActivity {

    private ActivitySplashBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySplashBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        try (InputStream is = getAssets().open("Front-Banner.jpg")) {
            Bitmap bitmap = BitmapFactory.decodeStream(is);
            if (bitmap != null) {
                binding.splashImage.setImageBitmap(bitmap);
            } else {
                binding.splashImage.setImageResource(R.drawable.front_banner);
            }
        } catch (IOException e) {
            binding.splashImage.setImageResource(R.drawable.front_banner);
        }

        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            if (!isFinishing() && !isDestroyed()) {
                Intent intent = new Intent(SplashActivity.this, MainActivity.class);
                startActivity(intent);
                overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
                finish();
            }
        }, 1200);
    }
}