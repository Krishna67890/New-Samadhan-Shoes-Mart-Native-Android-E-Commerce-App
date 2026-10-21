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
        List<Order> orders = getOrders();
        orders.add(0, order); // Add to the top
        saveOrders(orders);
    }

    public List<Order> getOrders() {
        String json = sharedPreferences.getString(KEY_ORDERS, null);
        if (json == null) {
            return new ArrayList<>();
        }
        Type type = new TypeToken<List<Order>>() {}.getType();
        return gson.fromJson(json, type);
    }

    private void saveOrders(List<Order> orders) {
        String json = gson.toJson(orders);
        sharedPreferences.edit().putString(KEY_ORDERS, json).apply();
    }
}
