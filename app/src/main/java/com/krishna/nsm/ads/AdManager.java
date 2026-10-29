package com.krishna.nsm.ads;

import android.app.Activity;
import android.app.Dialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.google.android.libraries.ads.mobile.sdk.banner.AdSize;
import com.google.android.libraries.ads.mobile.sdk.banner.AdView;
import com.google.android.libraries.ads.mobile.sdk.banner.BannerAd;
import com.google.android.libraries.ads.mobile.sdk.banner.BannerAdRequest;
import com.google.android.libraries.ads.mobile.sdk.common.AdLoadCallback;
import com.google.android.libraries.ads.mobile.sdk.common.LoadAdError;
import com.google.android.libraries.ads.mobile.sdk.interstitial.InterstitialAd;
import com.google.android.libraries.ads.mobile.sdk.interstitial.InterstitialAdPreloader;
import com.google.android.libraries.ads.mobile.sdk.common.AdRequest;
import com.google.android.libraries.ads.mobile.sdk.common.PreloadConfiguration;

public class AdManager {
    private static final String TAG = "AdManager";

    // Sample Test Ad Unit IDs
    private static final String TEST_BANNER_AD_UNIT_ID = "ca-app-pub-3940256099942544/6300978111";
    private static final String TEST_INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3940256099942544/1033173712";

    // PRODUCTION IDs
    private static final String PROD_BANNER_AD_UNIT_ID = "ca-app-pub-1889923922299467/5543603079";
    private static final String PROD_INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-1889923922299467/2974024910";

    private static AdManager instance;
    private AdView adView;

    private AdManager() {}

    public static synchronized AdManager getInstance() {
        if (instance == null) {
            instance = new AdManager();
        }
        return instance;
    }

    public void initInterstitial(String adUnitId) {
        try {
            AdRequest adRequest = new AdRequest.Builder(adUnitId).build();
            PreloadConfiguration preloadConfig = new PreloadConfiguration(adRequest);
            InterstitialAdPreloader.start(adUnitId, preloadConfig);
        } catch (Throwable t) {
            Log.e(TAG, "Error initializing interstitial: " + t.getMessage());
        }
    }

    public void initInterstitial() {
        initInterstitial(PROD_INTERSTITIAL_AD_UNIT_ID);
        initInterstitial(TEST_INTERSTITIAL_AD_UNIT_ID);
    }

    public void showInterstitial(Activity activity) {
        if (activity == null || activity.isFinishing() || activity.isDestroyed()) return;

        try {
            InterstitialAd prodAd = InterstitialAdPreloader.pollAd(PROD_INTERSTITIAL_AD_UNIT_ID);
            InterstitialAd ad = prodAd != null ? prodAd : InterstitialAdPreloader.pollAd(TEST_INTERSTITIAL_AD_UNIT_ID);

            if (ad != null) {
                ad.show(activity);
                initInterstitial();
            } else {
                showFallbackInterstitialDialog(activity);
                initInterstitial();
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to show interstitial, showing fallback", t);
            showFallbackInterstitialDialog(activity);
        }
    }

    private void showFallbackInterstitialDialog(Activity activity) {
        try {
            if (activity == null || activity.isFinishing() || activity.isDestroyed()) return;

            Dialog dialog = new Dialog(activity);
            dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
            
            LinearLayout rootLayout = new LinearLayout(activity);
            rootLayout.setOrientation(LinearLayout.VERTICAL);
            rootLayout.setBackgroundColor(Color.parseColor("#121212"));
            rootLayout.setPadding(32, 32, 32, 32);
            rootLayout.setGravity(Gravity.CENTER);

            TextView btnClose = new TextView(activity);
            btnClose.setText("Skip Ad ✕");
            btnClose.setTextColor(Color.WHITE);
            btnClose.setTextSize(14f);
            btnClose.setPadding(24, 12, 24, 12);
            btnClose.setBackgroundColor(Color.parseColor("#33FFFFFF"));
            LinearLayout.LayoutParams closeParams = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            closeParams.gravity = Gravity.END;
            closeParams.setMargins(0, 0, 0, 32);
            btnClose.setLayoutParams(closeParams);
            btnClose.setOnClickListener(v -> dialog.dismiss());
            rootLayout.addView(btnClose);

            TextView adTag = new TextView(activity);
            adTag.setText("SPONSORED AD");
            adTag.setTextColor(Color.parseColor("#FFD600"));
            adTag.setTextSize(12f);
            adTag.setPadding(12, 6, 12, 6);
            adTag.setBackgroundColor(Color.parseColor("#33FFD600"));
            LinearLayout.LayoutParams tagParams = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            tagParams.gravity = Gravity.CENTER_HORIZONTAL;
            tagParams.setMargins(0, 0, 0, 16);
            adTag.setLayoutParams(tagParams);
            rootLayout.addView(adTag);

            TextView titleView = new TextView(activity);
            titleView.setText("New Samadhan Shoes Mart");
            titleView.setTextColor(Color.WHITE);
            titleView.setTextSize(22f);
            titleView.setTypeface(null, android.graphics.Typeface.BOLD);
            titleView.setGravity(Gravity.CENTER);
            titleView.setPadding(0, 0, 0, 8);
            rootLayout.addView(titleView);

            TextView subView = new TextView(activity);
            subView.setText("Step into Comfort & Luxury • Exclusive Footwear Collection");
            subView.setTextColor(Color.parseColor("#BDBDBD"));
            subView.setTextSize(14f);
            subView.setGravity(Gravity.CENTER);
            subView.setPadding(0, 0, 0, 24);
            rootLayout.addView(subView);

            Button btnShop = new Button(activity);
            btnShop.setText("EXPLORE COLLECTION");
            btnShop.setBackgroundColor(Color.parseColor("#FFD600"));
            btnShop.setTextColor(Color.BLACK);
            btnShop.setTypeface(null, android.graphics.Typeface.BOLD);
            LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            btnParams.setMargins(0, 24, 0, 0);
            btnShop.setLayoutParams(btnParams);
            btnShop.setOnClickListener(v -> dialog.dismiss());
            rootLayout.addView(btnShop);

            dialog.setContentView(rootLayout);

            Window window = dialog.getWindow();
            if (window != null) {
                window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT);
                window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            }
            dialog.show();
        } catch (Throwable t) {
            Log.e(TAG, "Failed to show fallback interstitial dialog", t);
        }
    }

    public void loadBanner(Activity activity, FrameLayout container) {
        if (activity == null || activity.isFinishing() || activity.isDestroyed() || container == null) return;

        activity.runOnUiThread(() -> {
            try {
                destroyBanner(activity);

                adView = new AdView(activity);
                container.addView(adView);

                int widthPixels = activity.getResources().getDisplayMetrics().widthPixels;
                float density = activity.getResources().getDisplayMetrics().density;
                int adWidth = (int) (widthPixels / density);
                if (adWidth <= 0) adWidth = 320;

                AdSize adSize = AdSize.getLargeAnchoredAdaptiveBannerAdSize(activity, adWidth);
                BannerAdRequest adRequest = new BannerAdRequest.Builder(PROD_BANNER_AD_UNIT_ID, adSize).build();

                adView.loadAd(adRequest, new AdLoadCallback<BannerAd>() {
                    @Override
                    public void onAdLoaded(@NonNull BannerAd bannerAd) {
                        activity.runOnUiThread(() -> {
                            Log.d(TAG, "Banner ad loaded");
                            container.setVisibility(View.VISIBLE);
                        });
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError adError) {
                        activity.runOnUiThread(() -> {
                            Log.e(TAG, "Prod banner ad failed to load: " + adError.getMessage() + ". Trying test banner...");
                            loadTestBanner(activity, container);
                        });
                    }
                });
            } catch (Throwable t) {
                Log.e(TAG, "Error loading banner, loading fallback", t);
                loadFallbackBannerView(activity, container);
            }
        });
    }

    private void loadTestBanner(Activity activity, FrameLayout container) {
        if (activity == null || activity.isFinishing() || activity.isDestroyed() || container == null) return;

        activity.runOnUiThread(() -> {
            try {
                destroyBanner(activity);

                adView = new AdView(activity);
                container.addView(adView);

                int widthPixels = activity.getResources().getDisplayMetrics().widthPixels;
                float density = activity.getResources().getDisplayMetrics().density;
                int adWidth = (int) (widthPixels / density);
                if (adWidth <= 0) adWidth = 320;

                AdSize adSize = AdSize.getLargeAnchoredAdaptiveBannerAdSize(activity, adWidth);
                BannerAdRequest adRequest = new BannerAdRequest.Builder(TEST_BANNER_AD_UNIT_ID, adSize).build();

                adView.loadAd(adRequest, new AdLoadCallback<BannerAd>() {
                    @Override
                    public void onAdLoaded(@NonNull BannerAd bannerAd) {
                        activity.runOnUiThread(() -> {
                            Log.d(TAG, "Test Banner ad loaded");
                            container.setVisibility(View.VISIBLE);
                        });
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError adError) {
                        activity.runOnUiThread(() -> {
                            Log.e(TAG, "Test banner ad failed to load: " + adError.getMessage() + ". Loading fallback view...");
                            loadFallbackBannerView(activity, container);
                        });
                    }
                });
            } catch (Throwable t) {
                loadFallbackBannerView(activity, container);
            }
        });
    }

    private void loadFallbackBannerView(Activity activity, FrameLayout container) {
        try {
            if (activity == null || activity.isFinishing() || activity.isDestroyed() || container == null) return;

            activity.runOnUiThread(() -> {
                container.removeAllViews();
                container.setVisibility(View.VISIBLE);

                LinearLayout card = new LinearLayout(activity);
                card.setOrientation(LinearLayout.HORIZONTAL);
                card.setBackgroundColor(Color.parseColor("#1E1E2C"));
                card.setPadding(24, 16, 24, 16);
                card.setGravity(Gravity.CENTER_VERTICAL);
                card.setLayoutParams(new FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

                TextView tag = new TextView(activity);
                tag.setText("AD");
                tag.setTextColor(Color.BLACK);
                tag.setTextSize(10f);
                tag.setTypeface(null, android.graphics.Typeface.BOLD);
                tag.setPadding(8, 4, 8, 4);
                tag.setBackgroundColor(Color.parseColor("#FFD600"));
                card.addView(tag);

                LinearLayout infoLayout = new LinearLayout(activity);
                infoLayout.setOrientation(LinearLayout.VERTICAL);
                infoLayout.setPadding(16, 0, 16, 0);
                LinearLayout.LayoutParams infoParams = new LinearLayout.LayoutParams(
                        0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
                infoLayout.setLayoutParams(infoParams);

                TextView title = new TextView(activity);
                title.setText("New Samadhan Shoes Mart");
                title.setTextColor(Color.WHITE);
                title.setTextSize(12f);
                title.setTypeface(null, android.graphics.Typeface.BOLD);
                infoLayout.addView(title);

                TextView subtitle = new TextView(activity);
                subtitle.setText("Premium Footwear • Up to 50% Off");
                subtitle.setTextColor(Color.parseColor("#BDBDBD"));
                subtitle.setTextSize(10f);
                infoLayout.addView(subtitle);

                card.addView(infoLayout);

                TextView btnAction = new TextView(activity);
                btnAction.setText("SHOP");
                btnAction.setTextColor(Color.parseColor("#FFD600"));
                btnAction.setTextSize(11f);
                btnAction.setTypeface(null, android.graphics.Typeface.BOLD);
                btnAction.setPadding(16, 8, 16, 8);
                btnAction.setBackgroundColor(Color.parseColor("#2C2C3E"));
                card.addView(btnAction);

                container.addView(card);
            });
        } catch (Throwable t) {
            Log.e(TAG, "Error displaying fallback banner view", t);
        }
    }

    public void destroyBanner(Activity activity) {
        if (activity == null) {
            executeDestroyBanner();
            return;
        }
        try {
            if (activity.getMainLooper().getThread() == Thread.currentThread()) {
                executeDestroyBanner();
            } else {
                activity.runOnUiThread(this::executeDestroyBanner);
            }
        } catch (Throwable t) {
            executeDestroyBanner();
        }
    }

    public void destroyBanner() {
        executeDestroyBanner();
    }

    private void executeDestroyBanner() {
        try {
            if (adView != null) {
                if (adView.getParent() instanceof ViewGroup) {
                    ((ViewGroup) adView.getParent()).removeView(adView);
                }
                adView.destroy();
                adView = null;
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to destroy banner", t);
        }
    }
}