package com.krishna.nsm;

import android.content.Context;
import android.content.SharedPreferences;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.krishna.nsm.model.Order;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class OrderManager {
    private static final String PREF_NAME = "samadhan_order_prefs";
    private static final String KEY_ORDERS = "order_history";
    private static OrderManager instance;
    private final SharedPreferences sharedPreferences;
    private final Gson gson;

    private OrderManager(Context context) {
        sharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        gson = new Gson();
    }

    public static synchronized OrderManager getInstance(Context context) {
        if (instance == null) {
            instance = new OrderManager(context.getApplicationContext());
        }
        return instance;
    }

    public void addOrder(Order order) {
        if (order == null) return;
        List<Order> orders = getOrders();
        orders.add(0, order);
        saveOrders(orders);
    }

    public List<Order> getOrders() {
        try {
            String json = sharedPreferences.getString(KEY_ORDERS, null);
            if (json == null) {
                return new ArrayList<>();
            }
            Type type = new TypeToken<List<Order>>() {}.getType();
            List<Order> orders = gson.fromJson(json, type);
            return orders != null ? orders : new ArrayList<>();
        } catch (Throwable t) {
            return new ArrayList<>();
        }
    }

    public void clearOrders() {
        saveOrders(new ArrayList<>());
    }

    private void saveOrders(List<Order> orders) {
        try {
            String json = gson.toJson(orders != null ? orders : new ArrayList<>());
            sharedPreferences.edit().putString(KEY_ORDERS, json).apply();
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }
}