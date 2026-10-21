package com.krishna.nsm.ui.settings;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.krishna.nsm.ThemeManager;
import com.krishna.nsm.databinding.FragmentSettingsBinding;
import java.net.URLEncoder;

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
        if (binding == null) return;

        binding.switchDarkMode.setChecked(themeManager.isDarkMode());
        binding.switchDarkMode.setOnCheckedChangeListener((buttonView, isChecked) -> {
            themeManager.setDarkMode(isChecked);
        });

        binding.switchRgbBranding.setChecked(themeManager.isRgbBrandingEnabled());
        binding.switchRgbBranding.setOnCheckedChangeListener((buttonView, isChecked) -> {
            themeManager.setRgbBrandingEnabled(isChecked);
        });

        binding.btnHelpCenter.setOnClickListener(v -> {
            if (isAdded()) {
                new MaterialAlertDialogBuilder(requireContext())
                        .setTitle("Advanced Help Center & FAQs")
                        .setMessage("• Size Guide: All New Samadhan shoes adhere to standard Indian (IND/UK) sizing with 32 anatomical landmarks for zero-break-in comfort.\n\n" +
                                "• Shipping Policy: Free express delivery across Maharashtra & India within 3-5 business days via insured courier (+91 88886 44021).\n\n" +
                                "• Return & Exchange: 7-day hassle-free size exchange at our Nashik flagship store or via WhatsApp pickup.\n\n" +
                                "• Artisan Guarantee: Goodyear welted construction backed by lifetime cobbler repair support.")
                        .setPositiveButton("Close", null)
                        .setNeutralButton("Chat with Support (+91 8080690631)", (dialog, which) -> {
                            try {
                                String url = "https://wa.me/918080690631?text=" + URLEncoder.encode("Hello New Samadhan Shoes Support, I need help with...", "UTF-8");
                                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                                startActivity(intent);
                            } catch (Exception ignored) {}
                        })
                        .show();
            }
        });

        binding.btnContactSupport.setOnClickListener(v -> {
            if (isAdded()) {
                try {
                    String url = "https://wa.me/918080690631?text=" + URLEncoder.encode("Hello Krishna, I am contacting you regarding New Samadhan Shoes Mart app support.", "UTF-8");
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                } catch (Exception e) {
                    Toast.makeText(getContext(), "Unable to open WhatsApp (+91 8080690631)", Toast.LENGTH_SHORT).show();
                }
            }
        });

        binding.btnLogout.setOnClickListener(v -> {
            if (isAdded()) {
                Toast.makeText(getContext(), "Session Secure • Active Session", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}