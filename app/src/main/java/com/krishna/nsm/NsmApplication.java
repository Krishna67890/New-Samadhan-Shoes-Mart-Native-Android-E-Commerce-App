package com.krishna.nsm;

import android.app.Application;

public class NsmApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        ThemeManager themeManager = new ThemeManager(this);
        themeManager.applyTheme();
    }
}