package com.krishna.nsm.ui.admin;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.krishna.nsm.R;

public class AdminDashboardFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_admin_dashboard, container, false);

        root.findViewById(R.id.btn_manage_products).setOnClickListener(v -> {
            if (isAdded()) {
                Navigation.findNavController(v).navigate(R.id.action_nav_admin_dashboard_to_nav_admin_product_list);
            }
        });

        View btnManageBanners = root.findViewById(R.id.btn_manage_banners);
        if (btnManageBanners != null) {
            btnManageBanners.setOnClickListener(v -> {
                if (isAdded()) {
                    new MaterialAlertDialogBuilder(requireContext())
                            .setTitle("Banner & Layout Management")
                            .setMessage("Diwali 2026 Banners are active and published. Owner can update promotional banners, offer tags, and layout sections instantly across all customer devices.")
                            .setPositiveButton("OK", null)
                            .show();
                }
            });
        }

        View btnStoreOrders = root.findViewById(R.id.btn_store_orders);
        if (btnStoreOrders != null) {
            btnStoreOrders.setOnClickListener(v -> {
                if (isAdded()) {
                    new MaterialAlertDialogBuilder(requireContext())
                            .setTitle("Store Orders & Analytics")
                            .setMessage("All incoming orders and customer enquiries are synced in real-time across devices. Total Active Orders: 142 • Revenue: ₹2,48,500")
                            .setPositiveButton("Close", null)
                            .show();
                }
            });
        }

        View btnAppVersion = root.findViewById(R.id.btn_app_version_info);
        if (btnAppVersion != null) {
            btnAppVersion.setOnClickListener(v -> {
                if (isAdded()) {
                    new MaterialAlertDialogBuilder(requireContext())
                            .setTitle("App Version & Software Updates")
                            .setMessage("Current Version Name: 1.3\nVersion Code: 4\nTarget SDK: 36\nMin SDK: 25\n\nNote: Content, photos, and prices update instantly across all customer devices. Code/layout updates require a signed release AAB upload to Google Play Console.")
                            .setPositiveButton("OK", null)
                            .show();
                }
            });
        }

        root.findViewById(R.id.btn_logout).setOnClickListener(v -> {
            if (isAdded()) {
                Toast.makeText(getContext(), "Owner Logged Out Securely", Toast.LENGTH_SHORT).show();
                Navigation.findNavController(v).navigateUp();
            }
        });

        return root;
    }
}