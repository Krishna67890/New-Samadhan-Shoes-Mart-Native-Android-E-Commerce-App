package com.krishna.nsm.model;

import java.io.Serializable;

public class Review implements Serializable {
    private String id;
    private String name;
    private float rating;
    private String comment;
    private String city;
    private String date;
    private boolean verified;

    public Review() {}

    public Review(String id, String name, float rating, String comment, String city, String date, boolean verified) {
        this.id = id;
        this.name = name;
        this.rating = rating;
        this.comment = comment;
        this.city = city;
        this.date = date;
        this.verified = verified;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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
