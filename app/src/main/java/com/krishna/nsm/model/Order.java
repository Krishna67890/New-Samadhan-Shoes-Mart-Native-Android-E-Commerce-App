package com.krishna.nsm.model;

import java.io.Serializable;
import java.util.List;

public class Order implements Serializable {
    private String orderId;
    private String date;
    private List<CartItem> items;
    private double totalAmount;
    private String status; // "Enquiry Sent", "Confirmed", etc.
    private String shippingAddress;
    private String customerName;

    public Order(String orderId, String date, List<CartItem> items, double totalAmount, String status, String shippingAddress, String customerName) {
        this.orderId = orderId;
        this.date = date;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.shippingAddress = shippingAddress;
        this.customerName = customerName;
    }

    public String getOrderId() { return orderId; }
    public String getDate() { return date; }
    public List<CartItem> getItems() { return items; }
    public double getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public String getShippingAddress() { return shippingAddress; }
    public String getCustomerName() { return customerName; }
}
