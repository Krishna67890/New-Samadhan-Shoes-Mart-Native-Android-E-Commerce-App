package com.krishna.nsm.ui.product;

import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.chip.Chip;
import com.google.android.material.tabs.TabLayoutMediator;
import com.krishna.nsm.Constants;
import com.krishna.nsm.R;
import com.krishna.nsm.adapter.ProductImagesAdapter;
import com.krishna.nsm.databinding.FragmentProductDetailsBinding;
import com.krishna.nsm.model.Product;
import com.krishna.nsm.repository.ProductRepository;
import com.krishna.nsm.ads.AdManager;
import androidx.palette.graphics.Palette;
import com.krishna.nsm.ThemeManager;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;

import com.krishna.nsm.model.Review;
import com.krishna.nsm.repository.ReviewManager;
import java.util.List;
import android.widget.TextView;

public class ProductDetailsFragment extends Fragment {

    private FragmentProductDetailsBinding binding;
    private Product product;
    private String selectedSize = "";
    private ThemeManager themeManager;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentProductDetailsBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        themeManager = new ThemeManager(requireContext());

        String productId = getArguments() != null ? getArguments().getString("productId") : null;
        if (productId != null) {
            ProductRepository repository = new ProductRepository(requireContext());
            product = repository.getProductById(productId);
            if (product != null) {
                displayProductDetails();
                repository.isInWatchlist(productId).observe(getViewLifecycleOwner(), this::updateWishlistButtonState);
                
                if (themeManager.isRgbBrandingEnabled()) {
                    extractColorFromImage();
                }
            }
        }

        binding.btnBuyNow.setOnClickListener(v -> buyNow());
        binding.btnAddToCart.setOnClickListener(v -> addToCart());
        binding.btnWishlist.setOnClickListener(v -> toggleWishlist());

        binding.btnSubmitReview.setOnClickListener(v -> {
            String comment = binding.etComment.getText().toString().trim();
            float rating = binding.ratingBarInput.getRating();
            if (comment.isEmpty()) {
                Toast.makeText(getContext(), "Please enter a comment", Toast.LENGTH_SHORT).show();
            } else {
                Review review = new Review(
                    String.valueOf(System.currentTimeMillis()),
                    "Guest User", // In a real app, this would be the logged-in user's name
                    rating,
                    comment,
                    "Unknown",
                    new java.text.SimpleDateFormat("MMM dd, yyyy", java.util.Locale.getDefault()).format(new java.util.Date()),
                    false
                );
                ReviewManager.getInstance(requireContext()).addReview(review);
                displayReviews(); // Refresh display
                
                Toast.makeText(getContext(), "Thank you for your review!", Toast.LENGTH_SHORT).show();
                binding.etComment.setText("");
                binding.ratingBarInput.setRating(0);
            }
        });

        displayReviews();

        return root;
    }

    private void displayReviews() {
        if (binding == null) return;
        
        binding.reviewsContainer.removeAllViews();
        List<Review> reviews = ReviewManager.getInstance(requireContext()).getAllReviews();
        
        LayoutInflater inflater = LayoutInflater.from(getContext());
        for (Review review : reviews) {
            View reviewView = inflater.inflate(R.layout.item_review, binding.reviewsContainer, false);
            
            ((TextView) reviewView.findViewById(R.id.tv_reviewer_name)).setText(review.getName());
            ((TextView) reviewView.findViewById(R.id.tv_review_comment)).setText(review.getComment());
            ((android.widget.RatingBar) reviewView.findViewById(R.id.rating_bar_small)).setRating(review.getRating());
            
            binding.reviewsContainer.addView(reviewView);
        }
    }

    private void toggleWishlist() {
        ProductRepository repository = new ProductRepository(requireContext());
        repository.toggleWatchlist(product.getId());
        product.setInWatchlist(!product.isInWatchlist());
        
        if (product.isInWatchlist()) {
            Toast.makeText(getContext(), "Added to Watchlist", Toast.LENGTH_SHORT).show();
            // Trigger social notification when adding to wishlist
            new com.krishna.nsm.SocialNotificationManager(requireContext()).sendSocialNotification(product);
        } else {
            Toast.makeText(getContext(), "Removed from Watchlist", Toast.LENGTH_SHORT).show();
        }
        updateWishlistButtonState(product.isInWatchlist());
    }

    private void updateWishlistButtonState(boolean isInWishlist) {
        if (binding == null) return;

        int iconRes = isInWishlist ? android.R.drawable.btn_star_big_on : android.R.drawable.btn_star_big_off;
        int colorRes = isInWishlist ? android.R.color.holo_orange_dark : android.R.color.darker_gray;
        int color = ContextCompat.getColor(requireContext(), colorRes);

        binding.btnWishlist.setIconResource(iconRes);
        binding.btnWishlist.setIconTint(ColorStateList.valueOf(color));
        
        // Only set text if it's not the circular icon-only button (which has no text)
        CharSequence currentText = binding.btnWishlist.getText();
        if (currentText != null && !currentText.toString().isEmpty() || 
            binding.btnWishlist.getLayoutParams().width == ViewGroup.LayoutParams.MATCH_PARENT) {
            binding.btnWishlist.setText(isInWishlist ? "In Wishlist" : "Add to Wishlist");
        }
    }

    private void displayProductDetails() {
        binding.detailName.setText(product.getName());
        binding.detailBrand.setText(product.getBrand());
        binding.detailPrice.setText("₹" + String.format("%,.0f", product.getPrice()));
        binding.detailDescription.setText(product.getDescription());
        binding.detailRating.setText(String.valueOf(product.getRating()));
        binding.detailReviews.setText(product.getReviewCount() + " Ratings");

        if (product.getOldPrice() > 0 && product.getOldPrice() > product.getPrice()) {
            binding.detailOldPrice.setVisibility(View.VISIBLE);
            binding.detailOldPrice.setText("₹" + String.format("%,.0f", product.getOldPrice()));
            binding.detailOldPrice.setPaintFlags(binding.detailOldPrice.getPaintFlags() | android.graphics.Paint.STRIKE_THRU_TEXT_FLAG);

            int discount = (int) ((product.getOldPrice() - product.getPrice()) / product.getOldPrice() * 100);
            binding.detailDiscount.setVisibility(View.VISIBLE);
            binding.detailDiscount.setText(discount + "% off");
        } else {
            binding.detailOldPrice.setVisibility(View.GONE);
            binding.detailDiscount.setVisibility(View.GONE);
        }

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            ProductImagesAdapter adapter = new ProductImagesAdapter(requireContext(), product.getImages());
            binding.detailImageViewpager.setAdapter(adapter);
            
            new TabLayoutMediator(binding.detailImageTabs, binding.detailImageViewpager,
                    (tab, position) -> {
                        // Indicators are handled by custom drawable
                    }
            ).attach();
        }

        if (product.getSizes() != null) {
            binding.sizeChipGroup.removeAllViews();
            for (String size : product.getSizes()) {
                Chip chip = new Chip(requireContext());
                chip.setText(size);
                chip.setCheckable(true);
                chip.setOnCheckedChangeListener((buttonView, isChecked) -> {
                    if (isChecked) selectedSize = size;
                });
                binding.sizeChipGroup.addView(chip);
            }
        }
    }

    private void buyNow() {
        if (selectedSize.isEmpty()) {
            Toast.makeText(getContext(), "Please select a size", Toast.LENGTH_SHORT).show();
            return;
        }

        // Add to cart first
        com.krishna.nsm.CartManager.getInstance(requireContext())
                .addToCart(product, 1, selectedSize);

        // Navigate to checkout
        androidx.navigation.Navigation.findNavController(requireView()).navigate(R.id.nav_checkout);
    }

    private void addToCart() {
        if (selectedSize.isEmpty()) {
            Toast.makeText(getContext(), "Please select a size", Toast.LENGTH_SHORT).show();
            return;
        }
        
        // Show Interstitial Ad before adding to cart
        AdManager.getInstance().showInterstitial(requireActivity());

        com.krishna.nsm.CartManager.getInstance(requireContext())
                .addToCart(product, 1, selectedSize);
        Toast.makeText(getContext(), "Added to cart (Size: " + selectedSize + ")", Toast.LENGTH_SHORT).show();
    }

    private void extractColorFromImage() {
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            String imagePath = product.getImages().get(0);
            try {
                // Try from assets root first (matching ProductAdapter)
                InputStream is;
                try {
                    is = requireContext().getAssets().open(imagePath);
                } catch (IOException e) {
                    // Try with products/ prefix if root fails
                    is = requireContext().getAssets().open("products/" + imagePath);
                }
                
                Bitmap bitmap = BitmapFactory.decodeStream(is);
                if (bitmap != null) {
                    Palette.from(bitmap).generate(palette -> {
                        if (palette != null && isAdded() && binding != null) {
                            int color = palette.getVibrantColor(
                                palette.getDominantColor(ContextCompat.getColor(requireContext(), R.color.purple_500))
                            );
                            applyDynamicBranding(color);
                        }
                    });
                }
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void applyDynamicBranding(int color) {
        if (binding == null) return;
        
        themeManager.setBrandColor(color);
        
        ColorStateList colorStateList = ColorStateList.valueOf(color);
        binding.btnBuyNow.setBackgroundTintList(colorStateList);
        binding.btnBuyNow.setTextColor(ContextCompat.getColor(requireContext(), android.R.color.white));
        
        if (binding.btnAddToCart instanceof MaterialButton) {
            ((MaterialButton) binding.btnAddToCart).setStrokeColor(colorStateList);
            ((MaterialButton) binding.btnAddToCart).setTextColor(color);
        }

        binding.detailPrice.setTextColor(color);
        binding.detailDiscount.setBackgroundTintList(colorStateList);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
