package com.krishna.nsm.ui.wishlist;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.GridLayoutManager;
import com.krishna.nsm.R;
import com.krishna.nsm.adapter.ProductAdapter;
import com.krishna.nsm.databinding.FragmentWishlistBinding;
import com.krishna.nsm.model.Product;
import java.util.List;

public class WishlistFragment extends Fragment {

    private FragmentWishlistBinding binding;
    private WishlistViewModel viewModel;
    private ProductAdapter adapter;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentWishlistBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        viewModel = new ViewModelProvider(this).get(WishlistViewModel.class);
        
        int spanCount = getResources().getInteger(R.integer.product_grid_span);
        binding.wishlistRecycler.setLayoutManager(new GridLayoutManager(getContext(), spanCount));

        binding.btnExploreWishlist.setOnClickListener(v -> 
            Navigation.findNavController(v).navigate(R.id.nav_home));

        viewModel.getWatchlistProducts().observe(getViewLifecycleOwner(), this::updateUi);

        // Entry animation for title
        binding.toolbar.setAlpha(0f);
        binding.toolbar.setTranslationY(-20f);
        binding.wishlistSubtitle.setAlpha(0f);
        binding.wishlistSubtitle.setTranslationY(-20f);

        binding.toolbar.animate().alpha(1f).translationY(0f).setDuration(600).start();
        binding.wishlistSubtitle.animate().alpha(1f).translationY(0f).setDuration(600).setStartDelay(100).start();

        return root;
    }

    private void updateUi(List<Product> items) {
        if (items.isEmpty()) {
            binding.emptyWishlistContainer.setVisibility(View.VISIBLE);
            binding.wishlistRecycler.setVisibility(View.GONE);
        } else {
            binding.emptyWishlistContainer.setVisibility(View.GONE);
            binding.wishlistRecycler.setVisibility(View.VISIBLE);
            
            if (adapter == null) {
                adapter = new ProductAdapter(items, requireContext(), new ProductAdapter.OnProductClickListener() {
                    @Override
                    public void onProductClick(Product product) {
                        Bundle bundle = new Bundle();
                        bundle.putString("productId", product.getId());
                        Navigation.findNavController(requireView()).navigate(R.id.nav_product_details, bundle);
                    }

                    @Override
                    public void onWatchlistClick(Product product) {
                        viewModel.toggleWatchlist(product.getId());
                    }
                });
                binding.wishlistRecycler.setAdapter(adapter);
            } else {
                adapter.updateProducts(items);
            }
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
