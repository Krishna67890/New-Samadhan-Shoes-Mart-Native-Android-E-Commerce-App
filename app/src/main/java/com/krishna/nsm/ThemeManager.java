package com.krishna.nsm;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.appcompat.app.AppCompatDelegate;

public class ThemeManager {
    private static final String PREF_NAME = "nsm_prefs";
    private static final String KEY_DARK_MODE = "dark_mode";
    private static final String KEY_RGB_BRANDING = "rgb_branding";
    private static final String KEY_BRAND_COLOR = "brand_color";
    private static final int DEFAULT_BRAND_COLOR = 0xFF6200EE; // Material Purple 700

    private final SharedPreferences prefs;

    public ThemeManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public void applyTheme() {
        if (isDarkMode()) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        }
    }

    public boolean isDarkMode() {
        return prefs.getBoolean(KEY_DARK_MODE, false);
    }

    public void setDarkMode(boolean enabled) {
        prefs.edit().putBoolean(KEY_DARK_MODE, enabled).apply();
        applyTheme();
    }

    public boolean isRgbBrandingEnabled() {
        return prefs.getBoolean(KEY_RGB_BRANDING, true);
    }

    public void setRgbBrandingEnabled(boolean enabled) {
        prefs.edit().putBoolean(KEY_RGB_BRANDING, enabled).apply();
    }

    public int getBrandColor() {
        return prefs.getInt(KEY_BRAND_COLOR, DEFAULT_BRAND_COLOR);
    }

    public void setBrandColor(int color) {
        prefs.edit().putInt(KEY_BRAND_COLOR, color).apply();
    }
}
