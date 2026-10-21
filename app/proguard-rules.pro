# Add project specific ProGuard rules here.

# Keep model classes used by Gson & Room
-keep class com.krishna.nsm.model.** { *; }
-keep class com.krishna.nsm.data.local.entity.** { *; }
-keep class com.krishna.nsm.data.local.dao.** { *; }
-keep class com.krishna.nsm.data.local.database.** { *; }

# Keep Gson annotations and generic types
-keepattributes Signature
-keepattributes *Annotation*
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Keep Google Ads
-keep class com.google.android.libraries.ads.** { *; }
-keep class com.google.android.gms.ads.** { *; }

# Keep WorkManager
-keep class com.krishna.nsm.worker.** { *; }
