package com.krishna.nsm.ui.admin;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.krishna.nsm.R;

public class AdminDashboardFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_admin_dashboard, container, false);

        root.findViewById(R.id.btn_manage_products).setOnClickListener(v -> {
            Navigation.findNavController(v).navigate(R.id.action_nav_admin_dashboard_to_nav_admin_product_list);
        });

        root.findViewById(R.id.btn_logout).setOnClickListener(v -> {
            Navigation.findNavController(v).navigateUp();
        });

        // Other buttons can be wired to relevant management screens

        return root;
    }
}
