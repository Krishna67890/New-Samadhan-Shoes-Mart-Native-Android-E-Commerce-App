package com.krishna.nsm;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import com.krishna.nsm.model.Product;
import java.util.Random;

public class SocialNotificationManager {
    private static final String CHANNEL_ID = "social_alerts";
    private static final String CHANNEL_NAME = "Social Affinity Alerts";
    private final Context context;
    private final NotificationManager notificationManager;
    private final Random random = new Random();

    private static final String[] RELATIONS = {"Family", "Friends", "Neighbors"};
    private static final String[] ACTIONS = {"just bought", "added to wishlist", "recommended"};

    public SocialNotificationManager(Context context) {
        this.context = context.getApplicationContext();
        this.notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        createNotificationChannel();
    }

    private void createNotificationChannel() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && notificationManager != null) {
                NotificationChannel channel = new NotificationChannel(
                        CHANNEL_ID,
                        CHANNEL_NAME,
                        NotificationManager.IMPORTANCE_DEFAULT
                );
                channel.setDescription("Notifications about what your social circle is looking at");
                notificationManager.createNotificationChannel(channel);
            }
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    public void sendSocialNotification(Product product) {
        if (product == null || product.getId() == null || notificationManager == null) return;

        try {
            String relation = RELATIONS[random.nextInt(RELATIONS.length)];
            String action = ACTIONS[random.nextInt(ACTIONS.length)];
            String title = "Social Update";
            String message = "Someone from your " + relation + " " + action + " " + product.getName() + "!";

            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(android.R.drawable.ic_dialog_info)
                    .setContentTitle(title)
                    .setContentText(message)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setAutoCancel(true);

            notificationManager.notify(product.getId().hashCode(), builder.build());
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }
}