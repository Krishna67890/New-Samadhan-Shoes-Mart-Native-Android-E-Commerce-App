package com.krishna.nsm;

import android.content.Context;
import android.content.SharedPreferences;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.krishna.nsm.model.CartItem;
import com.krishna.nsm.model.Product;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class CartManager {
    private static final String PREF_NAME = "samadhan_cart_prefs";
    private static final String KEY_CART = "cart_items";
    private static CartManager instance;
    private final SharedPreferences sharedPreferences;
    private final Gson gson;

    private CartManager(Context context) {
        sharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        gson = new Gson();
    }

    public static synchronized CartManager getInstance(Context context) {
        if (instance == null) {
            instance = new CartManager(context.getApplicationContext());
        }
        return instance;
    }

    public void addToCart(Product product, int quantity, String size) {
        List<CartItem> items = getCartItems();
        boolean exists = false;
        for (CartItem item : items) {
            if (item.getProduct().getId().equals(product.getId()) && item.getSelectedSize().equals(size)) {
                item.setQuantity(item.getQuantity() + quantity);
                exists = true;
                break;
            }
        }
        if (!exists) {
            items.add(new CartItem(product, quantity, size));
        }
        saveCartItems(items);
    }

    public List<CartItem> getCartItems() {
        String json = sharedPreferences.getString(KEY_CART, null);
        if (json == null) {
            return new ArrayList<>();
        }
        Type type = new TypeToken<List<CartItem>>() {}.getType();
        return gson.fromJson(json, type);
    }

    public void removeFromCart(int index) {
        List<CartItem> items = getCartItems();
        if (index >= 0 && index < items.size()) {
            items.remove(index);
            saveCartItems(items);
        }
    }

    public void updateQuantity(int index, int quantity) {
        List<CartItem> items = getCartItems();
        if (index >= 0 && index < items.size()) {
            if (quantity <= 0) {
                items.remove(index);
            } else {
                items.get(index).setQuantity(quantity);
            }
            saveCartItems(items);
        }
    }

    public void clearCart() {
        saveCartItems(new ArrayList<>());
    }

    public double getCartTotal() {
        double total = 0;
        for (CartItem item : getCartItems()) {
            total += item.getTotalPrice();
        }
        return total;
    }

    private void saveCartItems(List<CartItem> items) {
        String json = gson.toJson(items);
        sharedPreferences.edit().putString(KEY_CART, json).apply();
    }
}
