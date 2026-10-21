package com.krishna.nsm.ui.settings;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.krishna.nsm.ThemeManager;
import com.krishna.nsm.databinding.FragmentSettingsBinding;

public class SettingsFragment extends Fragment {

    private FragmentSettingsBinding binding;
    private ThemeManager themeManager;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        SettingsViewModel settingsViewModel =
                new ViewModelProvider(this).get(SettingsViewModel.class);

        binding = FragmentSettingsBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        themeManager = new ThemeManager(requireContext());

        setupSettings();

        return root;
    }

    private void setupSettings() {
        binding.switchDarkMode.setChecked(themeManager.isDarkMode());
        binding.switchDarkMode.setOnCheckedChangeListener((buttonView, isChecked) -> {
            themeManager.setDarkMode(isChecked);
        });

        binding.switchRgbBranding.setChecked(themeManager.isRgbBrandingEnabled());
        binding.switchRgbBranding.setOnCheckedChangeListener((buttonView, isChecked) -> {
            themeManager.setRgbBrandingEnabled(isChecked);
        });

        binding.btnHelpCenter.setOnClickListener(v -> {
            // TODO: Navigate to Help Center or open URL
        });

        binding.btnContactSupport.setOnClickListener(v -> {
            // TODO: Open Email or WhatsApp
        });

        binding.btnLogout.setOnClickListener(v -> {
            // TODO: Implement Logout logic
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
