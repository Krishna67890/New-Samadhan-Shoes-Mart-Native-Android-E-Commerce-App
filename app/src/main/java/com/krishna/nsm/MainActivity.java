package com.krishna.nsm;

import android.animation.ValueAnimator;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.fragment.NavHostFragment;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import com.google.android.libraries.ads.mobile.sdk.common.RequestConfiguration;
import com.krishna.nsm.databinding.ActivityMainBinding;
import com.krishna.nsm.worker.NotificationWorker;

import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.util.concurrent.TimeUnit;
import com.google.android.libraries.ads.mobile.sdk.MobileAds;
import com.google.android.libraries.ads.mobile.sdk.initialization.InitializationConfig;
import com.krishna.nsm.ads.AdManager;

public class MainActivity extends AppCompatActivity {

    private AppBarConfiguration appBarConfiguration;
    private NavController navController;
    private ValueAnimator drawerRgbAnimator;
    private ActivityMainBinding binding;
    private FusedLocationProviderClient fusedLocationClient;
    private ThemeManager themeManager;
    private android.content.res.ColorStateList brandColorStateList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        try {
            themeManager = new ThemeManager(this);
            themeManager.applyTheme();
        } catch (Throwable t) {
            t.printStackTrace();
        }

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        applyBranding();

        if (binding.appBarMain != null && binding.appBarMain.toolbar != null) {
            setSupportActionBar(binding.appBarMain.toolbar);
        }

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        if (binding.appBarMain != null && binding.appBarMain.fab != null) {
            binding.appBarMain.fab.setOnClickListener(view -> openWhatsApp());
        }

        NavHostFragment navHostFragment =
                (NavHostFragment) getSupportFragmentManager()
                        .findFragmentById(R.id.nav_host_fragment_content_main);

        if (navHostFragment == null) {
            try {
                navHostFragment = NavHostFragment.create(R.navigation.mobile_navigation);
                getSupportFragmentManager().beginTransaction()
                        .replace(R.id.nav_host_fragment_content_main, navHostFragment)
                        .setPrimaryNavigationFragment(navHostFragment)
                        .commitNow();
            } catch (Throwable t) {
                t.printStackTrace();
            }
        }

        if (navHostFragment != null) {
            navController = navHostFragment.getNavController();

            appBarConfiguration = new AppBarConfiguration.Builder(
                    R.id.nav_home,
                    R.id.nav_collections,
                    R.id.nav_categories,
                    R.id.nav_cart,
                    R.id.nav_wishlist,
                    R.id.nav_orders,
                    R.id.nav_settings,
                    R.id.nav_gallery,
                    R.id.nav_workshop,
                    R.id.nav_about,
                    R.id.nav_owner_login
            )
                    .setOpenableLayout(binding.drawerLayout)
                    .build();

            NavigationUI.setupActionBarWithNavController(
                    this,
                    navController,
                    appBarConfiguration
            );

            if (binding.drawerLayout != null && binding.appBarMain != null && binding.appBarMain.toolbar != null) {
                androidx.appcompat.app.ActionBarDrawerToggle toggle = new androidx.appcompat.app.ActionBarDrawerToggle(
                        this, binding.drawerLayout, binding.appBarMain.toolbar,
                        R.string.navigation_drawer_open, R.string.navigation_drawer_close
                );
                binding.drawerLayout.addDrawerListener(toggle);
                toggle.syncState();
            }
        }

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayShowTitleEnabled(false);
        }

        NavigationView navigationView = binding.navView;
        if (navigationView != null && navController != null) {
            NavigationUI.setupWithNavController(
                    navigationView,
                    navController
            );

            navigationView.setNavigationItemSelectedListener(item -> {
                boolean handled = NavigationUI.onNavDestinationSelected(item, navController);
                if (handled && binding.drawerLayout != null) {
                    binding.drawerLayout.closeDrawers();
                }
                return handled;
            });

            if (navigationView.getHeaderCount() > 0) {
                View headerView = navigationView.getHeaderView(0);
                if (headerView != null) {
                    TextView headerTitle = headerView.findViewById(R.id.nav_header_title_text);
                    if (headerTitle != null) {
                        startDrawerRgbAnimation(headerTitle);
                    }
                }
            }
        }

        if (binding.appBarMain != null && binding.appBarMain.contentMain != null && binding.appBarMain.contentMain.bottomNavView != null && navController != null) {
            BottomNavigationView bottomNavigationView = binding.appBarMain.contentMain.bottomNavView;
            NavigationUI.setupWithNavController(
                    bottomNavigationView,
                    navController
            );
        }

        getOnBackPressedDispatcher().addCallback(this, new androidx.activity.OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (navController != null) {
                    try {
                        if (navController.getCurrentDestination() != null && navController.getCurrentDestination().getId() == R.id.nav_home) {
                            finish();
                        } else if (!navController.navigateUp()) {
                            setEnabled(false);
                            onBackPressed();
                            setEnabled(true);
                        }
                    } catch (Throwable t) {
                        finish();
                    }
                } else {
                    finish();
                }
            }
        });

        requestPermissions();
        scheduleNotifications();
        initAds();
    }

    private void applyBranding() {
        try {
            if (themeManager != null && themeManager.isRgbBrandingEnabled()) {
                int brandColor = themeManager.getBrandColor();
                brandColorStateList = android.content.res.ColorStateList.valueOf(brandColor);
                
                if (binding != null && binding.appBarMain != null) {
                    if (binding.appBarMain.fab != null) {
                        binding.appBarMain.fab.setBackgroundTintList(brandColorStateList);
                    }
                    if (binding.appBarMain.toolbarTitleCustom != null) {
                        binding.appBarMain.toolbarTitleCustom.setTextColor(brandColor);
                    }
                }
            }
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    private void initAds() {
        try {
            MobileAds.initialize(
                    this,
                    new InitializationConfig.Builder("ca-app-pub-1889923922299467~9992140661")
                            .build(),
                    initializationStatus -> {
                        try {
                            RequestConfiguration configuration = new RequestConfiguration.Builder()
                                    .setTestDeviceIds(Arrays.asList("B110BE161F7284D281F7EDD80D9EE07C"))
                                    .build();
                            MobileAds.setRequestConfiguration(configuration);
                        } catch (Throwable ignored) {}

                        runOnUiThread(() -> {
                            if (!isFinishing() && !isDestroyed() && binding != null && binding.appBarMain != null && binding.appBarMain.contentMain != null && binding.appBarMain.contentMain.adContainer != null) {
                                AdManager.getInstance().loadBanner(this, binding.appBarMain.contentMain.adContainer);
                            }
                        });
                        AdManager.getInstance().initInterstitial();
                    });
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    private void requestPermissions() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                String[] permissions = {
                        Manifest.permission.POST_NOTIFICATIONS,
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                };
                
                boolean allGranted = true;
                for (String p : permissions) {
                    if (ContextCompat.checkSelfPermission(this, p) != PackageManager.PERMISSION_GRANTED) {
                        allGranted = false;
                        break;
                    }
                }
                
                if (!allGranted) {
                    ActivityCompat.requestPermissions(this, permissions, 101);
                }
            } else {
                if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 102);
                }
            }
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    private void scheduleNotifications() {
        try {
            PeriodicWorkRequest notificationRequest =
                    new PeriodicWorkRequest.Builder(NotificationWorker.class, 15, TimeUnit.MINUTES)
                            .setInitialDelay(10, TimeUnit.MINUTES)
                            .build();

            WorkManager.getInstance(getApplicationContext()).enqueueUniquePeriodicWork(
                    "SamadhanPromoWork",
                    androidx.work.ExistingPeriodicWorkPolicy.KEEP,
                    notificationRequest
            );
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    private void openWhatsApp() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            sendWhatsAppMessage(null);
            return;
        }

        fusedLocationClient.getLastLocation()
                .addOnSuccessListener(this, location -> sendWhatsAppMessage(location))
                .addOnFailureListener(e -> sendWhatsAppMessage(null));
    }

    private void sendWhatsAppMessage(Location location) {
        String phoneNumber = "918888644021";
        final String baseMessage = "Hello! I am interested in your shoes from New Samadhan Shoes Mart.";
        
        if (location != null) {
            double lat = location.getLatitude();
            double lon = location.getLongitude();
            
            new Thread(() -> {
                String addressText = "";
                try {
                    if (Geocoder.isPresent()) {
                        Geocoder geocoder = new Geocoder(this, Locale.getDefault());
                        List<Address> addresses = geocoder.getFromLocation(lat, lon, 1);
                        if (addresses != null && !addresses.isEmpty()) {
                            Address address = addresses.get(0);
                            StringBuilder sb = new StringBuilder();
                            for (int i = 0; i <= address.getMaxAddressLineIndex(); i++) {
                                sb.append(address.getAddressLine(i)).append(" ");
                            }
                            addressText = "\n\nMy Address:\n" + sb.toString().trim();
                        }
                    }
                } catch (Throwable t) {
                    t.printStackTrace();
                }

                String mapsLink = "https://www.google.com/maps/search/?api=1&query=" + lat + "," + lon;
                String finalMessage = baseMessage + addressText + "\n\nLocation Link:\n" + mapsLink;
                
                runOnUiThread(() -> launchWhatsApp(phoneNumber, finalMessage));
            }).start();
        } else {
            launchWhatsApp(phoneNumber, baseMessage);
        }
    }

    private void launchWhatsApp(String phoneNumber, String message) {
        String url = "https://api.whatsapp.com/send?phone="
                + phoneNumber
                + "&text="
                + Uri.encode(message);

        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        try {
            startActivity(intent);
        } catch (ActivityNotFoundException e) {
            Toast.makeText(this, "Unable to open WhatsApp.", Toast.LENGTH_LONG).show();
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    private void startDrawerRgbAnimation(TextView textView) {
        try {
            final float[] hsv = new float[]{0f, 1f, 1f};

            drawerRgbAnimator = ValueAnimator.ofFloat(0f, 360f);
            drawerRgbAnimator.setDuration(4000);
            drawerRgbAnimator.setRepeatCount(ValueAnimator.INFINITE);

            drawerRgbAnimator.addUpdateListener(animation -> {
                if (textView != null) {
                    hsv[0] = (float) animation.getAnimatedValue();
                    textView.setTextColor(Color.HSVToColor(hsv));
                }
            });

            drawerRgbAnimator.start();
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    @Override
    protected void onDestroy() {
        if (drawerRgbAnimator != null) {
            drawerRgbAnimator.cancel();
            drawerRgbAnimator = null;
        }
        try {
            AdManager.getInstance().destroyBanner();
        } catch (Throwable ignored) {}
        super.onDestroy();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.overflow, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == R.id.nav_settings) {
            if (navController != null) {
                navController.navigate(R.id.nav_settings);
                return true;
            }
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onSupportNavigateUp() {
        if (navController != null) {
            try {
                return navController.navigateUp() || super.onSupportNavigateUp();
            } catch (Throwable t) {
                return super.onSupportNavigateUp();
            }
        }
        return super.onSupportNavigateUp();
    }
}