package com.krishna.nsm.ui.home;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.AttributeSet;
import android.view.MotionEvent;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.AppCompatImageView;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class InteractiveShoeViewer extends AppCompatImageView {

    private List<Bitmap> bitmaps = new ArrayList<>();
    private int currentIndex = 0;
    private float lastX;
    private final float dragThreshold = 20f; // Pixels to drag before swapping image

    public InteractiveShoeViewer(@NonNull Context context) {
        super(context);
        init();
    }

    public InteractiveShoeViewer(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        new Thread(() -> {
            loadImages();
            if (!bitmaps.isEmpty()) {
                post(() -> setImageBitmap(bitmaps.get(0)));
            }
        }).start();
    }

    private void loadImages() {
        String[] imageFiles = {
                "Main-Shoe.png",
                "Shoes-black-Front-men-6.jpg",
                "Shoes-Black-men-right-3.jpg",
                "Shoes-Black-Back-men-4.jpg",
                "Shoes-Black-left-men-2.jpg"
        };

        for (String fileName : imageFiles) {
            try (InputStream is = getContext().getAssets().open(fileName)) {
                Bitmap bitmap = BitmapFactory.decodeStream(is);
                if (bitmap != null) {
                    bitmaps.add(bitmap);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                lastX = event.getX();
                getParent().requestDisallowInterceptTouchEvent(true);
                return true;
            case MotionEvent.ACTION_MOVE:
                float currentX = event.getX();
                float deltaX = currentX - lastX;

                if (Math.abs(deltaX) > dragThreshold) {
                    if (deltaX > 0) {
                        // Dragged right -> Previous image
                        currentIndex = (currentIndex - 1 + bitmaps.size()) % bitmaps.size();
                    } else {
                        // Dragged left -> Next image
                        currentIndex = (currentIndex + 1) % bitmaps.size();
                    }
                    setImageBitmap(bitmaps.get(currentIndex));
                    lastX = currentX;
                }
                return true;
            case MotionEvent.ACTION_UP:
                performClick();
                getParent().requestDisallowInterceptTouchEvent(false);
                return true;
            case MotionEvent.ACTION_CANCEL:
                getParent().requestDisallowInterceptTouchEvent(false);
                return true;
        }
        return super.onTouchEvent(event);
    }

    @Override
    public boolean performClick() {
        return super.performClick();
    }
}
