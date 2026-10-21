package com.krishna.nsm.ui.cart;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.krishna.nsm.CartManager;
import com.krishna.nsm.Constants;
import com.krishna.nsm.R;
import com.krishna.nsm.adapter.CartAdapter;
import com.krishna.nsm.databinding.FragmentCartBinding;
import com.krishna.nsm.model.CartItem;
import com.krishna.nsm.ads.AdManager;
import java.net.URLEncoder;
import java.util.List;

public class CartFragment extends Fragment {

    private FragmentCartBinding binding;
    private CartManager cartManager;
    private CartAdapter adapter;
    private com.krishna.nsm.ThemeManager themeManager;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentCartBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        themeManager = new com.krishna.nsm.ThemeManager(requireContext());
        cartManager = CartManager.getInstance(requireContext());
        setupCartList();
        updateUI();
        applyBranding();

        binding.toolbar.setAlpha(0f);
        binding.toolbar.setTranslationY(-20f);
        binding.toolbar.animate().alpha(1f).translationY(0f).setDuration(600).start();

        binding.btnCheckout.setOnClickListener(v -> {
            if (cartManager.getCartItems().isEmpty()) {
                Toast.makeText(getContext(), "Cart is empty", Toast.LENGTH_SHORT).show();
            } else if (isAdded()) {
                Navigation.findNavController(root).navigate(R.id.nav_checkout);
            }
        });

        binding.btnWhatsappCart.setOnClickListener(v -> sendCartToWhatsApp());

        binding.btnShopNow.setOnClickListener(v -> {
            if (isAdded()) {
                Navigation.findNavController(root).navigate(R.id.nav_home);
            }
        });

        if (binding.cartAdContainer != null && getActivity() != null) {
            AdManager.getInstance().loadBanner(getActivity(), binding.cartAdContainer);
        }

        return root;
    }

    private void applyBranding() {
        if (binding == null) return;
        if (themeManager.isRgbBrandingEnabled()) {
            int brandColor = themeManager.getBrandColor();
            android.content.res.ColorStateList colorStateList = android.content.res.ColorStateList.valueOf(brandColor);
            
            binding.btnCheckout.setBackgroundTintList(colorStateList);
            binding.btnWhatsappCart.setStrokeColor(colorStateList);
            binding.btnWhatsappCart.setTextColor(colorStateList);
            binding.cartTotalPrice.setTextColor(brandColor);
        }
    }

    private void setupCartList() {
        if (binding == null) return;
        List<CartItem> items = cartManager.getCartItems();
        adapter = new CartAdapter(items, new CartAdapter.OnCartItemChangeListener() {
            @Override
            public void onQuantityChanged(int position, int newQuantity) {
                cartManager.updateQuantity(position, newQuantity);
                refreshCart();
            }

            @Override
            public void onRemoveItem(int position) {
                cartManager.removeFromCart(position);
                refreshCart();
            }

            @Override
            public void onCheckoutItem(int position) {
                List<CartItem> currentItems = cartManager.getCartItems();
                if (position >= 0 && position < currentItems.size()) {
                    CartItem item = currentItems.get(position);
                    if (item != null && item.getProduct() != null && isAdded()) {
                        sendSingleItemToWhatsApp(item);
                    }
                }
            }
        });
        binding.cartRecycler.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.cartRecycler.setAdapter(adapter);
    }

    private void sendSingleItemToWhatsApp(CartItem item) {
        if (item == null || item.getProduct() == null) return;

        StringBuilder sb = new StringBuilder();
        sb.append("*New Samadhan Shoes - Direct Order*\n\n");
        sb.append("Item: ").append(item.getProduct().getName()).append("\n");
        sb.append("Size: ").append(item.getSelectedSize()).append("\n");
        sb.append("Quantity: ").append(item.getQuantity()).append("\n");
        sb.append("Total Price: ₹").append(item.getTotalPrice()).append("\n\n");
        sb.append("Please confirm availability and dispatch for this item.");

        try {
            String url = "https://api.whatsapp.com/send?phone=" + Constants.WHATSAPP_NUMBER +
                    "&text=" + URLEncoder.encode(sb.toString(), "UTF-8");
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            startActivity(intent);
        } catch (Exception e) {
            Toast.makeText(getContext(), "WhatsApp not installed", Toast.LENGTH_SHORT).show();
        }
    }

    private void refreshCart() {
        if (adapter != null) {
            adapter.updateItems(cartManager.getCartItems());
            updateUI();
        } else {
            setupCartList();
        }
    }

    private void updateUI() {
        if (binding == null) return;
        double total = cartManager.getCartTotal();
        binding.cartTotalPrice.setText("₹" + total);
        if (cartManager.getCartItems().isEmpty()) {
            binding.emptyCartContainer.setVisibility(View.VISIBLE);
            binding.cartRecycler.setVisibility(View.GONE);
            binding.checkoutContainer.setVisibility(View.GONE);
        } else {
            binding.emptyCartContainer.setVisibility(View.GONE);
            binding.cartRecycler.setVisibility(View.VISIBLE);
            binding.checkoutContainer.setVisibility(View.VISIBLE);
        }
    }

    private void sendCartToWhatsApp() {
        List<CartItem> items = cartManager.getCartItems();
        if (items.isEmpty()) return;

        StringBuilder sb = new StringBuilder();
        sb.append("Hello New Samadhan Shoes,\n\n");
        sb.append("I would like to order the following items from my cart:\n\n");

        for (CartItem item : items) {
            if (item != null && item.getProduct() != null) {
                sb.append("- ").append(item.getProduct().getName())
                        .append(" (Size: ").append(item.getSelectedSize()).append(")")
                        .append(" x ").append(item.getQuantity())
                        .append(" = ₹").append(item.getTotalPrice()).append("\n");
            }
        }

        sb.append("\nTotal Amount: ₹").append(cartManager.getCartTotal());
        sb.append("\n\nPlease confirm availability and payment options.");

        try {
            String url = "https://api.whatsapp.com/send?phone=" + Constants.WHATSAPP_NUMBER +
                    "&text=" + URLEncoder.encode(sb.toString(), "UTF-8");
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            startActivity(intent);
        } catch (Exception e) {
            Toast.makeText(getContext(), "WhatsApp not installed", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}