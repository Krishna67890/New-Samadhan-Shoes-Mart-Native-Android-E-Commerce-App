package com.krishna.nsm.ui.admin;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.krishna.nsm.R;
import com.krishna.nsm.adapter.ProductAdapter;
import com.krishna.nsm.model.Product;
import com.krishna.nsm.repository.ProductRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class AdminProductListFragment extends Fragment {

    private RecyclerView recyclerView;
    private ProductRepository repository;
    private ProductAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_admin_product_list, container, false);

        recyclerView = root.findViewById(R.id.admin_product_recycler);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        repository = new ProductRepository(requireContext());
        refreshList();

        root.findViewById(R.id.btn_add_product).setOnClickListener(v -> {
            showEditDialog(null);
        });

        return root;
    }

    private void refreshList() {
        List<Product> products = repository.getAllProducts();
        adapter = new ProductAdapter(products, new ProductAdapter.OnProductClickListener() {
            @Override
            public void onProductClick(Product product) {
                showEditDialog(product);
            }

            @Override
            public void onWatchlistClick(Product product) {
                // Not needed in admin view, or could toggle visibility
            }
        });
        recyclerView.setAdapter(adapter);
    }

    private void showEditDialog(Product product) {
        View view = LayoutInflater.from(getContext()).inflate(R.layout.dialog_edit_product, null);
        EditText etName = view.findViewById(R.id.et_product_name);
        EditText etPrice = view.findViewById(R.id.et_product_price);
        EditText etCategory = view.findViewById(R.id.et_product_category);
        EditText etDescription = view.findViewById(R.id.et_product_description);
        View btnDelete = view.findViewById(R.id.btn_delete_product);

        boolean isEdit = product != null;
        if (isEdit) {
            etName.setText(product.getName());
            etPrice.setText(String.valueOf(product.getPrice()));
            etCategory.setText(product.getCategory());
            etDescription.setText(product.getDescription());
            btnDelete.setVisibility(View.VISIBLE);
        } else {
            btnDelete.setVisibility(View.GONE);
        }

        AlertDialog dialog = new MaterialAlertDialogBuilder(requireContext())
                .setTitle(isEdit ? "Edit Product" : "Add Product")
                .setView(view)
                .setPositiveButton("Save", (d, which) -> {
                    String name = etName.getText().toString();
                    double price = Double.parseDouble(etPrice.getText().toString());
                    String category = etCategory.getText().toString();
                    String description = etDescription.getText().toString();

                    if (isEdit) {
                        product.setName(name);
                        product.setPrice(price);
                        product.setCategory(category);
                        product.setDescription(description);
                        repository.updateProduct(product);
                    } else {
                        Product newProduct = new Product();
                        newProduct.setId(UUID.randomUUID().toString());
                        newProduct.setName(name);
                        newProduct.setPrice(price);
                        newProduct.setCategory(category);
                        newProduct.setDescription(description);
                        newProduct.setImages(new ArrayList<>()); // Placeholder
                        repository.addProduct(newProduct);
                    }
                    refreshList();
                })
                .setNegativeButton("Cancel", null)
                .show();

        btnDelete.setOnClickListener(v -> {
            new MaterialAlertDialogBuilder(requireContext())
                    .setTitle("Delete Product")
                    .setMessage("Are you sure you want to delete this product?")
                    .setPositiveButton("Delete", (d, which) -> {
                        repository.deleteProduct(product.getId());
                        dialog.dismiss();
                        refreshList();
                    })
                    .setNegativeButton("Cancel", null)
                    .show();
        });
    }
}
