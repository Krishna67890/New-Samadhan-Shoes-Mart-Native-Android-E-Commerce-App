package com.krishna.nsm.ui.owner;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.krishna.nsm.R;

public class OwnerLoginFragment extends Fragment {

    private EditText etUsername, etPassword;
    private Button btnLogin;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_owner_login, container, false);

        etUsername = root.findViewById(R.id.et_username);
        etPassword = root.findViewById(R.id.et_password);
        btnLogin = root.findViewById(R.id.btn_login);

        if (btnLogin != null) {
            btnLogin.setOnClickListener(v -> {
                String email = etUsername != null && etUsername.getText() != null 
                        ? etUsername.getText().toString().trim() : "";
                String password = etPassword != null && etPassword.getText() != null 
                        ? etPassword.getText().toString().trim() : "";

                String adminEmail = getString(R.string.admin_email).trim();
                String adminPass = getString(R.string.admin_pass).trim();

                if (email.equalsIgnoreCase(adminEmail) && password.equals(adminPass)) {
                    Toast.makeText(getContext(), "Elite Command Access Granted", Toast.LENGTH_SHORT).show();
                    if (isAdded()) {
                        Navigation.findNavController(v).navigate(R.id.action_nav_owner_login_to_nav_admin_dashboard);
                    }
                } else {
                    Toast.makeText(getContext(), "Unauthorized Access Denied", Toast.LENGTH_SHORT).show();
                }
            });
        }

        return root;
    }
}