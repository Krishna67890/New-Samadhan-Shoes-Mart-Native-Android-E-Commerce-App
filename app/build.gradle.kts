plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.krishna.nsm"
    compileSdk = 37

    defaultConfig {
        applicationId = "com.krishna.nsm"
        minSdk = 32
        targetSdk = 35

        versionCode = 2
        versionName = "1.1"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    buildFeatures {
        viewBinding = true
        dataBinding = true
    }
}

dependencies {
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.recyclerview)
    implementation(libs.constraintlayout)
    implementation(libs.lifecycle.livedata.ktx)
    implementation(libs.lifecycle.viewmodel.ktx)
    implementation(libs.navigation.fragment)
    implementation(libs.navigation.ui)
    
    // Catalog-based dependencies
    implementation(libs.gson)
    implementation(libs.work.runtime)
    implementation(libs.play.services.location)
    implementation(libs.ads.mobile)

    implementation(libs.room.runtime)
    implementation(libs.room.ktx)
    implementation(libs.palette)

    //noinspection GradleDependency
    annotationProcessor(libs.room.compiler)

    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}
