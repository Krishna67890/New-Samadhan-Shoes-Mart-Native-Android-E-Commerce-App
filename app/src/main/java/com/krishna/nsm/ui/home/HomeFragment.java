package com.krishna.nsm.ui.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.GridLayoutManager;
import com.google.android.material.chip.Chip;
import com.krishna.nsm.R;
import com.krishna.nsm.ThemeManager;
import com.krishna.nsm.adapter.BannerAdapter;
import com.krishna.nsm.adapter.ProductAdapter;
import com.krishna.nsm.databinding.FragmentHomeBinding;
import com.krishna.nsm.model.Product;
import com.krishna.nsm.repository.ProductRepository;
import com.krishna.nsm.ads.AdManager;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HomeFragment extends Fragment {

    private FragmentHomeBinding binding;
    private ProductRepository repository;
    private ProductAdapter dealsAdapter;
    private ProductAdapter featuredAdapter;
    private ThemeManager themeManager;

    private final android.os.Handler bannerHandler = new android.os.Handler(android.os.Looper.getMainLooper());
    private Runnable bannerRunnable;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentHomeBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        themeManager = new ThemeManager(requireContext());
        repository = ProductRepository.getInstance(requireContext());
        
        setupUIWithProducts(repository.getAllProducts(), root);
        if (!repository.isLoaded()) {
            repository.addOnProductsLoadedListener(products -> {
                if (isAdded() && binding != null && getActivity() != null) {
                    getActivity().runOnUiThread(() -> setupUIWithProducts(products, root));
                }
            });
        }

        applyBranding();
        return root;
    }

    private void setupUIWithProducts(List<Product> allProducts, View root) {
        if (binding == null) return;

        // Load Official Diwali 2026 Banner & Diwali Dip Banner
        if (binding.ivDiwaliBanner != null) {
            try (InputStream is = requireContext().getAssets().open("NSM-DIWALI_BANNER.png")) {
                Bitmap bitmap = BitmapFactory.decodeStream(is);
                if (bitmap != null) {
                    binding.ivDiwaliBanner.setImageBitmap(bitmap);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        if (binding.ivDiwaliDip != null) {
            try (InputStream is = requireContext().getAssets().open("Diwali-Dip.jpg")) {
                Bitmap bitmap = BitmapFactory.decodeStream(is);
                if (bitmap != null) {
                    binding.ivDiwaliDip.setImageBitmap(bitmap);
                }
            } catch (Throwable t) {
                t.printStackTrace();
            }
        }

        setupBanners();

        View cardAnimatedShoe = binding.getRoot().findViewById(R.id.card_animated_shoe);
        if (cardAnimatedShoe != null) {
            cardAnimatedShoe.setAlpha(0f);
            cardAnimatedShoe.setTranslationY(100f);
        }

        if (binding.btnCartTop != null) {
            binding.btnCartTop.setOnClickListener(v -> {
                if (isAdded()) {
                    Navigation.findNavController(v).navigate(R.id.nav_cart);
                }
            });
        }

        if (binding.searchEditText != null) {
            binding.searchEditText.setOnEditorActionListener((v, actionId, event) -> {
                if (isAdded() && binding != null) {
                    String query = binding.searchEditText.getText().toString().trim();
                    if (!query.isEmpty()) {
                        Bundle bundle = new Bundle();
                        bundle.putString("searchQuery", query);
                        Navigation.findNavController(v).navigate(R.id.nav_categories, bundle);
                    }
                }
                return false;
            });
        }

        setupCategories();

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M && binding.homeScrollView != null) {
            binding.homeScrollView.setOnScrollChangeListener((View.OnScrollChangeListener) (v, scrollX, scrollY, oldScrollX, oldScrollY) -> {
                if (binding == null || !isAdded() || getContext() == null) return;

                View animatedView = binding.cardAnimatedShoe;
                if (animatedView == null) return;

                int[] location = new int[2];
                animatedView.getLocationOnScreen(location);
                int viewTop = location[1];
                int screenHeight = getResources().getDisplayMetrics().heightPixels;

                float startTrigger = screenHeight * 0.9f;
                float endTrigger = screenHeight * 0.2f;
                
                float progress = (startTrigger - viewTop) / (startTrigger - endTrigger);
                progress = Math.max(0f, Math.min(1f, progress));

                if (viewTop < startTrigger) {
                    animatedView.setAlpha(progress);
                    float scale = 0.7f + (progress * 0.3f);
                    animatedView.setScaleX(scale);
                    animatedView.setScaleY(scale);
                    animatedView.setRotation((1f - progress) * 25f);
                    animatedView.setTranslationY((1f - progress) * 400f);
                    
                    if (binding.ivAnimatedShoe != null) {
                        binding.ivAnimatedShoe.setTranslationX((progress - 0.5f) * -50f);
                    }
                } else {
                    animatedView.setAlpha(0f);
                }
            });
        }

        if (binding.dealsRecycler != null && allProducts != null) {
            List<Product> allDeals = new ArrayList<>(allProducts);
            java.util.Collections.shuffle(allDeals);
            List<Product> deals = allDeals.subList(0, Math.min(allDeals.size(), 8));
            binding.dealsRecycler.setLayoutManager(new androidx.recyclerview.widget.LinearLayoutManager(getContext(), androidx.recyclerview.widget.LinearLayoutManager.HORIZONTAL, false));
            dealsAdapter = new ProductAdapter(deals, requireContext(), new ProductAdapter.OnProductClickListener() {
                @Override
                public void onProductClick(Product product) {
                    if (isAdded() && product != null) {
                        Bundle bundle = new Bundle();
                        bundle.putString("productId", product.getId());
                        if (getActivity() != null) {
                            AdManager.getInstance().showInterstitial(getActivity());
                        }
                        Navigation.findNavController(root).navigate(R.id.nav_product_details, bundle);
                    }
                }

                @Override
                public void onWatchlistClick(Product product) {
                    if (isAdded() && product != null) {
                        repository.toggleWatchlist(product.getId());
                        dealsAdapter.updateProducts(new ArrayList<>(repository.getAllProducts()).subList(0, Math.min(8, repository.getAllProducts().size())));
                    }
                }
            });
            binding.dealsRecycler.setAdapter(dealsAdapter);
        }

        if (binding.featuredRecycler != null && allProducts != null) {
            int spanCount = getResources().getInteger(R.integer.product_grid_span);
            binding.featuredRecycler.setLayoutManager(new GridLayoutManager(getContext(), spanCount));
            
            android.view.animation.LayoutAnimationController controller = 
                    android.view.animation.AnimationUtils.loadLayoutAnimation(getContext(), R.anim.layout_animation_fall_down);
            binding.featuredRecycler.setLayoutAnimation(controller);

            Map<String, List<Product>> categorized = new HashMap<>();
            for (Product p : allProducts) {
                if (p != null && p.getCategory() != null) {
                    categorized.computeIfAbsent(p.getCategory(), k -> new ArrayList<>()).add(p);
                }
            }

            List<Product> featuredProducts = new ArrayList<>();
            if (categorized.containsKey("Men")) featuredProducts.addAll(categorized.get("Men").subList(0, Math.min(4, categorized.get("Men").size())));
            if (categorized.containsKey("Women")) featuredProducts.addAll(categorized.get("Women").subList(0, Math.min(4, categorized.get("Women").size())));
            if (categorized.containsKey("Sneakers")) featuredProducts.addAll(categorized.get("Sneakers").subList(0, Math.min(4, categorized.get("Sneakers").size())));
            if (categorized.containsKey("Formal")) featuredProducts.addAll(categorized.get("Formal").subList(0, Math.min(4, categorized.get("Formal").size())));
            if (categorized.containsKey("Kids")) featuredProducts.addAll(categorized.get("Kids").subList(0, Math.min(4, categorized.get("Kids").size())));
            
            if (featuredProducts.isEmpty()) {
                featuredProducts = allProducts.subList(0, Math.min(allProducts.size(), 16));
            }

            featuredAdapter = new ProductAdapter(featuredProducts, requireContext(), new ProductAdapter.OnProductClickListener() {
                @Override
                public void onProductClick(Product product) {
                    if (isAdded() && product != null) {
                        Bundle bundle = new Bundle();
                        bundle.putString("productId", product.getId());
                        if (getActivity() != null) {
                            AdManager.getInstance().showInterstitial(getActivity());
                        }
                        Navigation.findNavController(root).navigate(R.id.nav_product_details, bundle);
                    }
                }

                @Override
                public void onWatchlistClick(Product product) {
                    if (isAdded() && product != null) {
                        repository.toggleWatchlist(product.getId());
                        List<Product> updatedFeatured = new ArrayList<>();
                        Map<String, List<Product>> categorizedMap = new HashMap<>();
                        for (Product p : repository.getAllProducts()) {
                            if (p != null && p.getCategory() != null) {
                                categorizedMap.computeIfAbsent(p.getCategory(), k -> new ArrayList<>()).add(p);
                            }
                        }
                        if (categorizedMap.containsKey("Men")) updatedFeatured.addAll(categorizedMap.get("Men").subList(0, Math.min(4, categorizedMap.get("Men").size())));
                        if (categorizedMap.containsKey("Women")) updatedFeatured.addAll(categorizedMap.get("Women").subList(0, Math.min(4, categorizedMap.get("Women").size())));
                        if (categorizedMap.containsKey("Sneakers")) updatedFeatured.addAll(categorizedMap.get("Sneakers").subList(0, Math.min(4, categorizedMap.get("Sneakers").size())));
                        if (categorizedMap.containsKey("Formal")) updatedFeatured.addAll(categorizedMap.get("Formal").subList(0, Math.min(4, categorizedMap.get("Formal").size())));
                        if (categorizedMap.containsKey("Kids")) updatedFeatured.addAll(categorizedMap.get("Kids").subList(0, Math.min(4, categorizedMap.get("Kids").size())));
                        
                        featuredAdapter.updateProducts(updatedFeatured);
                    }
                }
            });
            binding.featuredRecycler.setHasFixedSize(true);
            binding.featuredRecycler.setNestedScrollingEnabled(false);
            binding.featuredRecycler.setAdapter(featuredAdapter);
        }

        if (binding.tvViewAllDeals != null) {
            binding.tvViewAllDeals.setOnClickListener(v -> {
                if (isAdded()) {
                    Navigation.findNavController(v).navigate(R.id.nav_categories);
                }
            });
        }

        if (binding.tvHomeBrandName != null) {
            binding.tvHomeBrandName.setAlpha(0f);
            binding.tvHomeBrandName.setTranslationX(-100f);
            binding.tvHomeBrandName.animate()
                    .alpha(1f)
                    .translationX(0f)
                    .setDuration(1000)
                    .setInterpolator(new android.view.animation.DecelerateInterpolator())
                    .start();
        }

        if (binding.searchCard != null) {
            binding.searchCard.setAlpha(0f);
            binding.searchCard.setTranslationY(-50f);
            binding.searchCard.animate()
                    .alpha(1f)
                    .translationY(0f)
                    .setDuration(800)
                    .setStartDelay(300)
                    .start();
        }

        setupVisitingCardFlip();
    }

    private void setupBanners() {
        if (binding == null || binding.bannerViewPager == null) return;
        List<String> bannerPaths = new ArrayList<>();
        bannerPaths.add("NSM-DIWALI_BANNER.png");
        bannerPaths.add("NSM-Diwali-Offer.jpg");
        for (int i = 6; i <= 38; i++) {
            String fileName = String.format(java.util.Locale.US, "IMG-20260928-WA%04d.jpg", i);
            bannerPaths.add(fileName);
        }

        BannerAdapter bannerAdapter = new BannerAdapter(bannerPaths, () -> {
            if (isAdded() && binding != null) {
                Navigation.findNavController(requireView()).navigate(R.id.nav_categories);
            }
        });
        binding.bannerViewPager.setAdapter(bannerAdapter);
        binding.bannerViewPager.setOffscreenPageLimit(3);
        binding.bannerViewPager.setPageTransformer((page, position) -> {
            float absPos = Math.abs(position);
            page.setTranslationX(-position * page.getWidth() * 0.15f);
            float scale = 0.82f + (1f - absPos) * 0.18f;
            page.setScaleX(scale);
            page.setScaleY(scale);
            page.setAlpha(0.4f + (1f - absPos) * 0.6f);
        });

        if (binding.bannerIndicator != null) {
            binding.bannerIndicator.setVisibility(View.GONE);
        }

        bannerRunnable = new Runnable() {
            @Override
            public void run() {
                if (binding != null && binding.bannerViewPager != null && !bannerPaths.isEmpty()) {
                    int current = binding.bannerViewPager.getCurrentItem();
                    int next = (current + 1) % bannerPaths.size();
                    binding.bannerViewPager.setCurrentItem(next, true);
                    bannerHandler.postDelayed(this, 4000);
                }
            }
        };
    }

    @Override
    public void onResume() {
        super.onResume();
        if (bannerRunnable != null) {
            bannerHandler.postDelayed(bannerRunnable, 4000);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        if (bannerRunnable != null) {
            bannerHandler.removeCallbacks(bannerRunnable);
        }
    }

    private void applyBranding() {
        if (binding == null) return;
        if (themeManager.isRgbBrandingEnabled()) {
            int brandColor = themeManager.getBrandColor();
            android.content.res.ColorStateList colorStateList = android.content.res.ColorStateList.valueOf(brandColor);
            
            if (binding.tvViewAllDeals != null) {
                binding.tvViewAllDeals.setTextColor(brandColor);
            }
            if (binding.btnCartTop != null) {
                binding.btnCartTop.setImageTintList(colorStateList);
            }
        }
    }

    private boolean isCardShowingBack = false;
    private void setupVisitingCardFlip() {
        if (binding == null || binding.visitingCardContainer == null) return;
        binding.visitingCardContainer.setOnClickListener(v -> {
            if (binding == null) return;
            if (isCardShowingBack) {
                flipCard(binding.cardBack, binding.cardFront);
            } else {
                flipCard(binding.cardFront, binding.cardBack);
            }
            isCardShowingBack = !isCardShowingBack;
        });
    }

    private void flipCard(View currentView, View nextView) {
        if (currentView == null || nextView == null) return;
        currentView.animate()
                .rotationY(90f)
                .setDuration(300)
                .withEndAction(() -> {
                    currentView.setVisibility(View.INVISIBLE);
                    nextView.setVisibility(View.VISIBLE);
                    nextView.setRotationY(-90f);
                    nextView.animate()
                            .rotationY(0f)
                            .setDuration(300)
                            .start();
                })
                .start();
    }

    private void setupCategories() {
        if (binding == null || binding.categoryContainer == null) return;
        binding.categoryContainer.removeAllViews();
        List<String> categories = Arrays.asList("All", "Men", "Women", "Sneakers", "Formal", "Kids", "Women Sneakers", "Formal Kids", "Public Kids");
        Map<String, Integer> iconMap = new HashMap<>();
        iconMap.put("All", R.drawable.ic_all_24);
        iconMap.put("Men", R.drawable.ic_men_24);
        iconMap.put("Women", R.drawable.ic_women_24);
        iconMap.put("Sneakers", R.drawable.ic_sneakers_24);
        iconMap.put("Formal", R.drawable.ic_formal_24);
        iconMap.put("Kids", R.drawable.ic_kids_24);
        iconMap.put("Women Sneakers", R.drawable.ic_sneakers_24);
        iconMap.put("Formal Kids", R.drawable.ic_formal_24);
        iconMap.put("Public Kids", R.drawable.ic_kids_24);

        for (String category : categories) {
            Chip chip = (Chip) getLayoutInflater().inflate(R.layout.item_category_chip, binding.categoryContainer, false);
            chip.setText(category);
            Integer iconRes = iconMap.get(category);
            if (iconRes != null) {
                chip.setChipIconResource(iconRes);
            }
            chip.setOnClickListener(v -> {
                if (isAdded()) {
                    Bundle bundle = new Bundle();
                    bundle.putString("category", category);
                    Navigation.findNavController(requireView()).navigate(R.id.nav_categories, bundle);
                }
            });
            binding.categoryContainer.addView(chip);
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}