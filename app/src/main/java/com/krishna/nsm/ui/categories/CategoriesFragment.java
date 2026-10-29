package com.krishna.nsm.ui.categories;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.GridLayoutManager;
import com.google.android.material.tabs.TabLayout;
import com.krishna.nsm.R;
import com.krishna.nsm.adapter.ProductAdapter;
import com.krishna.nsm.databinding.FragmentCategoriesBinding;
import com.krishna.nsm.model.Product;
import com.krishna.nsm.repository.ProductRepository;
import java.util.Arrays;
import java.util.List;

public class CategoriesFragment extends Fragment {

    private FragmentCategoriesBinding binding;
    private ProductRepository repository;
    private final List<String> categories = Arrays.asList("All", "Men", "Women", "Sneakers", "Formal", "Kids", "Women Sneakers", "Formal Kids", "Public Kids");
    private List<Product> currentProducts;
    private ProductAdapter adapter;
    private com.krishna.nsm.ThemeManager themeManager;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentCategoriesBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        themeManager = new com.krishna.nsm.ThemeManager(requireContext());
        repository = new ProductRepository(requireContext());

        setupTabs();
        setupSorting();
        applyBranding();
        
        if (getArguments() != null && getArguments().containsKey("searchQuery")) {
            String searchQuery = getArguments().getString("searchQuery");
            loadSearchResults(searchQuery);
        } else {
            String initialCategory = getArguments() != null ? getArguments().getString("category") : "All";
            int tabIndex = categories.indexOf(initialCategory);
            if (tabIndex != -1 && binding.categoryTabs.getTabAt(tabIndex) != null) {
                binding.categoryTabs.getTabAt(tabIndex).select();
            }
            loadCategoryProducts(initialCategory);
        }

        return root;
    }

    private void setupTabs() {
        if (binding == null) return;
        for (String category : categories) {
            binding.categoryTabs.addTab(binding.categoryTabs.newTab().setText(category));
        }

        binding.categoryTabs.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                if (tab != null && tab.getText() != null) {
                    loadCategoryProducts(tab.getText().toString());
                }
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {}

            @Override
            public void onTabReselected(TabLayout.Tab tab) {}
        });
    }

    private void setupSorting() {
        if (binding == null) return;
        binding.sortButton.setOnClickListener(v -> {
            String[] options = {
                    getString(R.string.sort_price_low_high),
                    getString(R.string.sort_price_high_low),
                    getString(R.string.sort_newest_first)
            };
            new androidx.appcompat.app.AlertDialog.Builder(requireContext())
                    .setTitle(R.string.sort_by_title)
                    .setItems(options, (dialog, which) -> {
                        sortProducts(which);
                    })
                    .show();
        });
    }

    private void sortProducts(int criteria) {
        if (currentProducts == null) return;
        
        switch (criteria) {
            case 0: // Low to High
                java.util.Collections.sort(currentProducts, (p1, p2) -> Double.compare(p1.getPrice(), p2.getPrice()));
                break;
            case 1: // High to Low
                java.util.Collections.sort(currentProducts, (p1, p2) -> Double.compare(p2.getPrice(), p1.getPrice()));
                break;
            case 2: // Newest
                java.util.Collections.sort(currentProducts, (p1, p2) -> Boolean.compare(p2.isNew(), p1.isNew()));
                break;
        }
        displayProducts(currentProducts);
    }

    private void loadSearchResults(String query) {
        if (binding == null) return;
        currentProducts = repository.searchProducts(query);
        binding.categoryTabs.setVisibility(View.GONE);
        binding.resultsCountText.setVisibility(View.VISIBLE);
        binding.resultsCountText.setText(getString(R.string.search_results_count, query, currentProducts.size()));
        displayProducts(currentProducts);
    }

    private void loadCategoryProducts(String category) {
        if (binding == null) return;
        if ("All".equalsIgnoreCase(category)) {
            currentProducts = repository.getAllProducts();
        } else {
            currentProducts = repository.getProductsByCategory(category);
        }
        binding.categoryTabs.setVisibility(View.VISIBLE);
        binding.resultsCountText.setVisibility(View.GONE);
        displayProducts(currentProducts);
    }

    private void applyBranding() {
        if (binding == null) return;
        if (themeManager.isRgbBrandingEnabled()) {
            int brandColor = themeManager.getBrandColor();
            binding.categoryTabs.setSelectedTabIndicatorColor(brandColor);
            binding.categoryTabs.setTabTextColors(
                androidx.core.content.ContextCompat.getColor(requireContext(), R.color.gray_text),
                brandColor
            );
        }
    }

    private void displayProducts(List<Product> products) {
        if (binding == null || getContext() == null || !isAdded()) return;
        int spanCount = getResources().getInteger(R.integer.product_grid_span);
        binding.categoryProductsRecycler.setLayoutManager(new GridLayoutManager(getContext(), spanCount));

        adapter = new ProductAdapter(products, requireContext(), new ProductAdapter.OnProductClickListener() {
            @Override
            public void onProductClick(Product product) {
                if (isAdded() && product != null) {
                    Bundle bundle = new Bundle();
                    bundle.putString("productId", product.getId());
                    Navigation.findNavController(requireView()).navigate(R.id.nav_product_details, bundle);
                }
            }

            @Override
            public void onWatchlistClick(Product product) {
                if (product != null) {
                    repository.toggleWatchlist(product.getId());
                    if (adapter != null && currentProducts != null) {
                        adapter.updateProducts(currentProducts);
                    }
                }
            }
        });
        binding.categoryProductsRecycler.setAdapter(adapter);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}