package com.krishna.nsm.model;

import java.io.Serializable;

public class CartItem implements Serializable {
    private Product product;
    private int quantity;
    private String selectedSize;

    public CartItem(Product product, int quantity, String selectedSize) {
        this.product = product;
        this.quantity = quantity;
        this.selectedSize = selectedSize;
    }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getSelectedSize() { return selectedSize; }
    public void setSelectedSize(String selectedSize) { this.selectedSize = selectedSize; }

    public double getTotalPrice() {
        return product.getPrice() * quantity;
    }
}
