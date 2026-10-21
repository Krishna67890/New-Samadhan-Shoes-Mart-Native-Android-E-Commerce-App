package com.krishna.nsm.data.local.entity;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "wishlist")
public class WishlistItem {
    @PrimaryKey
    @NonNull
    private String id;
    private String name;
    private double price;
    private String image;
    private long addedTimestamp;

    @androidx.room.Ignore
    public WishlistItem() {
        this.id = "";
    }

    public WishlistItem(@NonNull String id, String name, double price, String image, long addedTimestamp) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.addedTimestamp = addedTimestamp;
    }

    @NonNull
    public String getId() { return id; }
    public void setId(@NonNull String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public long getAddedTimestamp() { return addedTimestamp; }
    public void setAddedTimestamp(long addedTimestamp) { this.addedTimestamp = addedTimestamp; }
}
