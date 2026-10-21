package com.krishna.nsm.worker;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.krishna.nsm.R;

public class NotificationWorker extends Worker {

    private static final String CHANNEL_ID = "samadhan_promo_channel";

    public NotificationWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        sendNotification();
        return Result.success();
    }

    private void sendNotification() {
        createNotificationChannel();

        String[] titles = {
                "Samadhan Premium Comfort",
                "Elite Footwear Alert",
                "Step into Luxury",
                "Quality You Can Feel"
        };
        
        String[] messages = {
                "Purchase this product for your comfort. Feel more conscious than your sandals. High quality guaranteed!",
                "Upgrade your walk with our high-quality collection. More comfort than any sandal!",
                "New Samadhan Elite: Advanced cushioning for maximum comfort. Experience the difference.",
                "Don't just walk, glide. Our premium shoes provide more comfort than your daily sandals."
        };

        int index = (int) (Math.random() * titles.length);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(getApplicationContext(), CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_home_24)
                .setContentTitle(titles[index])
                .setContentText(messages[index])
                .setStyle(new NotificationCompat.BigTextStyle().bigText(messages[index]))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true);

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(getApplicationContext());
        try {
            notificationManager.notify((int) System.currentTimeMillis(), builder.build());
        } catch (SecurityException e) {
            // Permission missing
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Promotional Notifications";
            String description = "Advanced advertisement notifications for Samadhan Shoe Mart";
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);

            NotificationManager notificationManager = getApplicationContext().getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }
}
