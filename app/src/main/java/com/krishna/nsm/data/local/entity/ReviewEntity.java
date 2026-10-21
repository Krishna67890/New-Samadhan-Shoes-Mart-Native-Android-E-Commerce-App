package com.krishna.nsm.data.local.entity;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "reviews")
public class ReviewEntity {
    @PrimaryKey
    @NonNull
    private String id;
    private String productId;
    private String name;
    private float rating;
    private String comment;
    private String city;
    private String date;
    private boolean verified;

    @androidx.room.Ignore
    public ReviewEntity() {
        this.id = "";
    }

    public ReviewEntity(@NonNull String id, String productId, String name, float rating, String comment, String city, String date, boolean verified) {
        this.id = id;
        this.productId = productId;
        this.name = name;
        this.rating = rating;
        this.comment = comment;
        this.city = city;
        this.date = date;
        this.verified = verified;
    }

    @NonNull
    public String getId() { return id; }
    public void setId(@NonNull String id) { this.id = id; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public float getRating() { return rating; }
    public void setRating(float rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
