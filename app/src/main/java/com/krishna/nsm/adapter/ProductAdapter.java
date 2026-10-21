
package com.krishna.nsm.adapter;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Paint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.RecyclerView;

import com.krishna.nsm.R;
import com.krishna.nsm.model.Product;

import java.io.IOException;
import java.io.InputStream;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class ProductAdapter
        extends RecyclerView.Adapter<ProductAdapter.ProductViewHolder> {

    private final List<Product> products = new ArrayList<>();
    private final OnProductClickListener listener;
    private final com.krishna.nsm.ThemeManager themeManager;

    private static final Map<String, Integer> DRAWABLE_MAP = new HashMap<>();
    private static final Map<String, Bitmap> BITMAP_CACHE = new HashMap<>();

    static {
        // Add entries only for drawable resources that actually exist.
        // Example:
        // DRAWABLE_MAP.put("favicon.png", R.drawable.favicon);
    }

    public interface OnProductClickListener {
        void onProductClick(Product product);

        void onWatchlistClick(Product product);
    }

    public ProductAdapter(
            List<Product> products,
            OnProductClickListener listener) {
        if (products != null) {
            this.products.addAll(products);
        }
        this.listener = listener;
        this.themeManager = null; // Legacy constructor
    }

    public ProductAdapter(
            List<Product> products,
            android.content.Context context,
            OnProductClickListener listener) {
        if (products != null) {
            this.products.addAll(products);
        }
        this.listener = listener;
        this.themeManager = new com.krishna.nsm.ThemeManager(context);
    }

    public void updateProducts(List<Product> newProducts) {
        List<Product> safeNewList = newProducts == null
                ? new ArrayList<>()
                : new ArrayList<>(newProducts);

        DiffUtil.DiffResult diffResult = DiffUtil.calculateDiff(
                new ProductDiffCallback(products, safeNewList)
        );

        products.clear();
        products.addAll(safeNewList);

        diffResult.dispatchUpdatesTo(this);
    }

    @Override
    public int getItemViewType(int position) {
        return 0;
    }

    private static class ProductDiffCallback extends DiffUtil.Callback {

        private final List<Product> oldList;
        private final List<Product> newList;

        ProductDiffCallback(
                List<Product> oldList,
                List<Product> newList) {
            this.oldList = oldList;
            this.newList = newList;
        }

        @Override
        public int getOldListSize() {
            return oldList.size();
        }

        @Override
        public int getNewListSize() {
            return newList.size();
        }

        @Override
        public boolean areItemsTheSame(
                int oldItemPosition,
                int newItemPosition) {

            Product oldProduct = oldList.get(oldItemPosition);
            Product newProduct = newList.get(newItemPosition);

            if (oldProduct == null || newProduct == null) {
                return oldProduct == newProduct;
            }

            String oldId = oldProduct.getId();
            String newId = newProduct.getId();

            return oldId != null && oldId.equals(newId);
        }

        @Override
        public boolean areContentsTheSame(
                int oldItemPosition,
                int newItemPosition) {

            Product oldProduct = oldList.get(oldItemPosition);
            Product newProduct = newList.get(newItemPosition);

            if (oldProduct == null || newProduct == null) {
                return oldProduct == newProduct;
            }

            return safeEquals(oldProduct.getName(), newProduct.getName())
                    && oldProduct.getPrice() == newProduct.getPrice()
                    && oldProduct.getOldPrice() == newProduct.getOldPrice()
                    && oldProduct.isInWatchlist()
                    == newProduct.isInWatchlist()
                    && oldProduct.isNew() == newProduct.isNew()
                    && oldProduct.getRating() == newProduct.getRating()
                    && oldProduct.getReviewCount()
                    == newProduct.getReviewCount()
                    && safeEquals(oldProduct.getBrand(), newProduct.getBrand())
                    && safeEquals(oldProduct.getImages(), newProduct.getImages());
        }

        private static boolean safeEquals(Object first, Object second) {
            return first == null
                    ? second == null
                    : first.equals(second);
        }
    }

    @NonNull
    @Override
    public ProductViewHolder onCreateViewHolder(
            @NonNull ViewGroup parent,
            int viewType) {

        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_product, parent, false);

        return new ProductViewHolder(view);
    }

    @Override
    public void onBindViewHolder(
            @NonNull ProductViewHolder holder,
            int position) {

        Product product = products.get(position);

        if (product == null) {
            return;
        }

        holder.bind(product, listener, themeManager);
    }

    @Override
    public int getItemCount() {
        return products.size();
    }

    static class ProductViewHolder extends RecyclerView.ViewHolder {

        private final ImageView productImage;
        private final TextView productName;
        private final TextView productPrice;
        private final TextView productOldPrice;
        private final TextView productBrand;
        private final TextView tvNewTag;
        private final TextView tvDiscountTag;
        private final TextView tvRating;
        private final TextView tvReviewCount;
        private final ImageView btnWatchlist;

        ProductViewHolder(@NonNull View itemView) {
            super(itemView);

            productImage = itemView.findViewById(R.id.product_image);
            productName = itemView.findViewById(R.id.product_name);
            productPrice = itemView.findViewById(R.id.product_price);
            productOldPrice = itemView.findViewById(R.id.product_old_price);
            productBrand = itemView.findViewById(R.id.product_brand);
            tvNewTag = itemView.findViewById(R.id.tv_new_tag);
            tvDiscountTag = itemView.findViewById(R.id.tv_discount_tag);
            tvRating = itemView.findViewById(R.id.tv_rating);
            tvReviewCount = itemView.findViewById(R.id.tv_review_count);
            btnWatchlist = itemView.findViewById(R.id.btn_watchlist);
        }

        void bind(
                Product product,
                OnProductClickListener listener,
                com.krishna.nsm.ThemeManager themeManager) {

            setText(productName, product.getName());
            setText(productBrand, product.getBrand());

            NumberFormat currencyFormat = NumberFormat.getNumberInstance(
                    new Locale("en", "IN")
            );
            currencyFormat.setMaximumFractionDigits(0);
            currencyFormat.setMinimumFractionDigits(0);

            if (productPrice != null) {
                productPrice.setText(
                        "₹" + currencyFormat.format(product.getPrice())
                );
            }

            double price = product.getPrice();
            double oldPrice = product.getOldPrice();

            if (productOldPrice != null && tvDiscountTag != null
                    && oldPrice > price && price >= 0) {

                productOldPrice.setVisibility(View.VISIBLE);
                productOldPrice.setText(
                        "₹" + currencyFormat.format(oldPrice)
                );
                productOldPrice.setPaintFlags(
                        productOldPrice.getPaintFlags()
                                | Paint.STRIKE_THRU_TEXT_FLAG
                );

                int discount = (int) Math.round(
                        ((oldPrice - price) / oldPrice) * 100
                );

                tvDiscountTag.setVisibility(View.VISIBLE);
                tvDiscountTag.setText(discount + "% OFF");

            } else {
                setVisibility(productOldPrice, View.GONE);
                setVisibility(tvDiscountTag, View.GONE);
            }

            if (tvNewTag != null) {
                tvNewTag.setVisibility(
                        product.isNew() ? View.VISIBLE : View.GONE
                );
            }

            if (tvRating != null) {
                tvRating.setText(String.valueOf(product.getRating()));
            }

            if (tvReviewCount != null) {
                tvReviewCount.setText(
                        "(" + product.getReviewCount() + ")"
                );
            }

            loadProductImage(product);
            applyBranding(themeManager);

            if (btnWatchlist != null) {
                btnWatchlist.setImageResource(
                        product.isInWatchlist()
                                ? android.R.drawable.btn_star_big_on
                                : android.R.drawable.btn_star_big_off
                );

                btnWatchlist.setContentDescription(
                        product.isInWatchlist()
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                );

                btnWatchlist.setOnClickListener(v -> {
                    if (listener != null) {
                        listener.onWatchlistClick(product);
                    }
                });
            }

            itemView.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onProductClick(product);
                }
            });
        }

        private void loadProductImage(Product product) {
            if (productImage == null) {
                return;
            }

            productImage.setImageResource(
                    R.drawable.ic_launcher_background
            );

            List<String> images = product.getImages();

            if (images == null || images.isEmpty()) {
                return;
            }

            String imageName = images.get(0);

            if (imageName == null || imageName.trim().isEmpty()) {
                return;
            }

            imageName = imageName.trim();

            // Check Bitmap Cache first
            if (BITMAP_CACHE.containsKey(imageName)) {
                productImage.setImageBitmap(BITMAP_CACHE.get(imageName));
                return;
            }

            // Try an explicitly mapped drawable first.
            Integer mappedResource = DRAWABLE_MAP.get(imageName);

            if (mappedResource != null) {
                productImage.setImageResource(mappedResource);
                return;
            }

            // Try loading the image from app/src/main/assets.
            try (InputStream input =
                         itemView.getContext().getAssets().open(imageName)) {

                Bitmap bitmap = BitmapFactory.decodeStream(input);

                if (bitmap != null) {
                    BITMAP_CACHE.put(imageName, bitmap);
                    productImage.setImageBitmap(bitmap);
                    return;
                }

            } catch (IOException ignored) {
                // Continue to drawable lookup.
            }

            // Drawable names must be valid Android resource names.
            String resourceName = imageName;

            int slash = resourceName.lastIndexOf('/');
            if (slash >= 0) {
                resourceName = resourceName.substring(slash + 1);
            }

            int dot = resourceName.lastIndexOf('.');
            if (dot > 0) {
                resourceName = resourceName.substring(0, dot);
            }

            resourceName = resourceName
                    .toLowerCase(Locale.ROOT)
                    .replaceAll("[^a-z0-9_]", "_");

            int resourceId = itemView.getContext()
                    .getResources()
                    .getIdentifier(
                            resourceName,
                            "drawable",
                            itemView.getContext().getPackageName()
                    );

            if (resourceId != 0) {
                productImage.setImageResource(resourceId);
            }
        }

        private void setText(TextView view, String value) {
            if (view != null) {
                view.setText(value == null ? "" : value);
            }
        }

        private void setVisibility(View view, int visibility) {
            if (view != null) {
                view.setVisibility(visibility);
            }
        }

        private void applyBranding(com.krishna.nsm.ThemeManager themeManager) {
            if (themeManager != null && themeManager.isRgbBrandingEnabled()) {
                int brandColor = themeManager.getBrandColor();
                if (productPrice != null) {
                    productPrice.setTextColor(brandColor);
                }
                if (tvRating != null) {
                    tvRating.setBackgroundTintList(android.content.res.ColorStateList.valueOf(brandColor));
                }
            }
        }
    }
}
