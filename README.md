# JMS Task Manager - React Native App

## 📱 Project Overview

This is a React Native application built for the JMS Advisory Pvt. Ltd. internship assessment. The app demonstrates user authentication, API integration, state management, and navigation with a clean, responsive UI.

## ✨ Features

- **User Authentication** - Secure login with token-based authentication
- **Splash Screen** - Auto-login check on app launch
- **Dashboard** - Product statistics and lazy-loaded product list
- **Profile** - User details fetched from API
- **Bottom Tab Navigation** - Easy navigation between Dashboard and Profile
- **Responsive Design** - Works on different screen sizes and orientations
- **Pull to Refresh** - Refresh data on Dashboard
- **Lazy Loading** - Infinite scroll for products list

## 🛠️ Tech Stack

- **React Native** (via Expo)
- **React Navigation** - Stack & Bottom Tab navigators
- **Axios** - API calls
- **AsyncStorage** - Token persistence
- **Functional Components + Hooks** - Modern React patterns

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
## 🚀 Quick Setup

1. **Install:** `npm install`
2. **Start:** `npx expo start`
3. **Run:** Scan the QR code with **Expo Go** app (Android/iOS).

## 🔑 Test Credentials

- **Username:** `emilys`
- **Password:** `emilyspass`

## 📸 Screenshots Showcase

### 1. Core Screens
| Splash | Login | Dashboard |
|--------|-------|-----------|
| ![Splash](./screenshots/splash.png) | ![Login](./screenshots/login.png) | ![Dashboard](./screenshots/dashboard.png) |

### 2. Identity (Profile)
| Profile Overview | Profile Details |
|------------------|-----------------|
| ![Profile 1](./screenshots/profile1.png) | ![Profile 2](./screenshots/profile2.png) |

### 3. Interactive Features
| Product Details | Profile Action | Custom Alert |
|-----------------|----------------|--------------|
| ![Product Details](./screenshots/product_details.png) | ![Profile Popover](./screenshots/profile_popover.png) | ![Custom Alert](./screenshots/custom_alert.png) |

### 4. Loading States
| Dashboard Loading | Profile Loading |
|-------------------|-----------------|
| ![Loading Dashboard](./screenshots/loading_Dashboard.png) | ![Loading Profile](./screenshots/loading_profile.png) |

## 📁 Project Features

- **Fintech Theme** - Deep navy (#0B1220) professional redesign
- **Skeleton Loaders** - Modern animated loading states
- **Half-Modal** - Slide-up product details view
- **Custom Alert** - Handcrafted theme-consistent dialogs
- **Infinite Scroll** - Seamless pagination on Dashboard
- **Profile Popover** - Quick access header actions
- **Fully Responsive** - Optimized for all mobile devices

## 🔌 API Endpoints Used

1. **Login API**
   - POST `https://dummyjson.com/auth/login`
   - Returns authentication token

2. **Get Profile**
   - GET `https://dummyjson.com/auth/me`
   - Requires Bearer token
   - Returns user details

3. **Get Products**
   - GET `https://dummyjson.com/products`
   - Supports pagination (skip, limit)
   - Returns product list and statistics

## 📁 Project Structure

```
Task_List - JMS Advisory Pvt Ltd/
├── App.js                      # Main app component
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── eas.json                    # EAS Build configuration
├── navigation/
│   └── AppNavigator.js         # Navigation setup
├── screens/
│   ├── SplashScreen.js         # Splash screen
│   ├── LoginScreen.js          # Login screen
│   ├── DashboardScreen.js      # Dashboard screen
│   └── ProfileScreen.js        # Profile screen
├── services/
│   └── api.js                  # API service functions
├── utils/
│   └── storage.js              # AsyncStorage helpers
└── assets/                     # Images and icons
```

## 🏗️ Building APK

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Login to Expo

```bash
eas login
```

Create an account if you don't have one at [expo.dev](https://expo.dev)

### Step 3: Configure EAS

```bash
eas build:configure
```

### Step 4: Build APK

```bash
eas build -p android --profile preview
```

This will:
- Upload your code to Expo servers
- Build the APK
- Provide a download link when complete (usually 10-15 minutes)

## 🎨 Design Decisions

### Why These Technologies?

1. **Expo** - Easier setup than React Native CLI, perfect for beginners, includes many built-in features
2. **React Navigation** - Industry standard for navigation in React Native
3. **Axios** - Cleaner API than fetch, better error handling
4. **AsyncStorage** - Simple key-value storage for tokens
5. **Functional Components + Hooks** - Modern React best practices

### Code Explanations

**Storage (utils/storage.js)**
- Uses AsyncStorage to save the authentication token
- Token persists even after app closes
- Used to check if user is logged in on app launch

**API Service (services/api.js)**
- Centralized API calls in one file
- Consistent error handling
- Returns success/failure with data/message

**Navigation (navigation/AppNavigator.js)**
- Stack Navigator for main flow (Splash → Login → Tabs)
- Bottom Tab Navigator for Dashboard and Profile
- Tabs only visible after login

**Screens**
- **SplashScreen**: Checks token, navigates accordingly
- **LoginScreen**: Form validation, API call, token storage
- **DashboardScreen**: Fetches profile and products, calculates stats, implements pagination
- **ProfileScreen**: Displays user data from API, logout functionality

## 🔄 App Flow

1. **App Opens** → Splash Screen
2. **Check Token** → If exists, go to Dashboard; else go to Login
3. **Login** → Enter credentials → API call → Save token → Navigate to Dashboard
4. **Dashboard** → Fetch profile and products → Display stats and list
5. **Profile** → Fetch user details → Display info
6. **Logout** → Clear token → Reset navigation → Back to Login

## 🎯 Key Features Implementation

### Responsive Design
- Uses Dimensions API for screen size
- Flexible layouts with flexbox
- Works in portrait and landscape

### State Management
- useState for local state
- useEffect for side effects
- Token stored in AsyncStorage

### Error Handling
- Try-catch blocks in API calls
- User-friendly error messages
- Loading states for better UX

### Validation
- Input validation on login
- Mandatory field checks
- Error messages displayed inline

## 🐛 Troubleshooting

**Issue: "Module not found"**
- Solution: Run `npm install` again

**Issue: "Expo not starting"**
- Solution: Clear cache with `npx expo start -c`

**Issue: "API not working"**
- Solution: Check internet connection, API endpoints are public

**Issue: "Build failed"**
- Solution: Make sure all dependencies are installed, check eas.json configuration

## 👨‍💻 Developer

**Name:** Dhatri Mehta
**Email:** dmehta.tech@gmail.com
**LinkedIn:** https://www.linkedin.com/in/dhatri-m-906932275

## 📝 Assumptions Made

1. Using Expo instead of React Native CLI (easier for beginners, meets all requirements)
2. Using emoji icons for tabs (no custom icon assets needed)
3. Test credentials provided in the task document
4. All data fetched from API (no static data)
5. Simple, clean UI focusing on functionality

## 🙏 Acknowledgments

- Task provided by JMS Advisory Pvt. Ltd.
- API by [DummyJSON](https://dummyjson.com/)
- Built with React Native and Expo

---

**Note:** This project was completed as part of the internship selection process for JMS Advisory Pvt. Ltd.
