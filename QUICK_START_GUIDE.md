# 🌊 Nā Puna ʻIke Dashboard - Quick Start User Guide

*"Nā Puna ʻIke" means "the springs of knowledge" in Hawaiian - your gateway to environmental data insights*

---

## 📋 Table of Contents

1. [Welcome to Nā Puna ʻIke Dashboard](#welcome-to-nā-puna-ike-dashboard)
2. [Getting Started](#getting-started)
3. [Understanding User Roles](#understanding-user-roles)
4. [Dashboard Overview](#dashboard-overview)
5. [Working with Weather Data](#working-with-weather-data)
6. [Managing Sensor Data](#managing-sensor-data)
7. [Water Quality Data Entry](#water-quality-data-entry)
8. [Administrative Functions](#administrative-functions)
9. [Tips for Educators](#tips-for-educators)
10. [Tips for Students](#tips-for-students)
11. [Troubleshooting](#troubleshooting)
12. [Support & Contact](#support--contact)

---

## 🌟 Welcome to Nā Puna ʻIke Dashboard

The Nā Puna ʻIke Dashboard is a comprehensive environmental data platform designed for educational use in classrooms. It enables students and educators to:

- **Analyze Weather Data**: Access historical weather information for Hawaiian locations
- **Manage Sensor Data**: Upload, view, and visualize environmental sensor readings
- **Record Water Quality**: Document water quality measurements and parameters
- **Generate Insights**: Create visualizations and export data for analysis

**Perfect for**: Environmental science classes, data science education, STEM learning, and research projects.

---

## 🚀 Getting Started

### Step 1: Access the Dashboard

1. **Open your web browser** (Chrome, Firefox, Safari, or Edge)
2. **Navigate to**: [https://institute-for-future-intelligence.github.io/itest-dashboard](https://institute-for-future-intelligence.github.io/itest-dashboard)
3. **You'll see the login page** with the Nā Puna ʻIke branding

### Step 2: Sign In

1. **Click "Sign in with Google"** button
2. **Choose your Google account** from the popup/redirect
3. **Grant permissions** when prompted
4. **Wait for authentication** - you'll be redirected to the dashboard

> **Note**: The system uses Google Authentication for secure access. Make sure you're using a Google account that has been granted access to the platform.

### Step 3: First Time Setup

After your first login:
- Your account will be automatically created in the system
- You'll be assigned a default role of "student"
- Contact your administrator if you need role changes

---

## 👥 Understanding User Roles

The dashboard has three user roles, each with different capabilities:

### 🎓 Student Role
**What Students Can Do:**
- ✅ View dashboard and navigate all sections
- ✅ Access weather data and create visualizations
- ✅ View sensor data uploaded by others
- ✅ Enter water quality measurements
- ❌ Cannot upload sensor data files
- ❌ Cannot export data
- ❌ Cannot access analytics

### 👨‍🏫 Educator Role
**What Educators Can Do:**
- ✅ All student capabilities, plus:
- ✅ Export data for classroom use
- ✅ View analytics and insights
- ❌ Cannot upload sensor data files

> **Need a role change?** Contact your system administrator at [andriy@intofuture.org](mailto:andriy@intofuture.org)

---

## 🏠 Dashboard Overview

### Navigation Bar
Located at the top of every page:
- **Nā Puna ʻIke Logo**: Click to return to home
- **Navigation Menu**: Access all main sections
- **Profile Menu**: View your role and sign out

### Main Navigation Sections

| Section | Icon | Description | Available To |
|---------|------|-------------|--------------|
| **Home** | 🏠 | Dashboard overview and feature cards | All users |
| **Weather** | ☁️ | Historical weather data analysis | All users |
| **Sensors** | 📡 | Environmental sensor data management | All users |
| **Water Quality** | 💧 | Water quality measurements | All users |

### Home Dashboard Features

The home page shows:
1. **Welcome Message**: Personalized greeting with your role
2. **Feature Cards**: Quick access to main functions
3. **Platform Capabilities**: Overview of available tools

---

## 🌤️ Working with Weather Data

The Weather section provides access to historical weather data for Hawaiian locations.

### Step-by-Step: Analyzing Weather Data

#### Step 1: Navigate to Weather Section
- Click **"Weather"** in the navigation menu
- You'll see the weather analysis interface

#### Step 2: Select Location
- Use the **Location Selector** dropdown
- Choose from available Hawaiian locations:
  - Honolulu
  - Hilo
  - Kailua-Kona
  - Lihue
  - And more...

#### Step 3: Choose Date Range
- Click the **date picker** fields
- Select your desired **start date** and **end date**
- Maximum range: 1 year of historical data

#### Step 4: Select Variables
Choose from two categories:

**Hourly Variables:**
- Temperature (°C)
- Relative Humidity (%)
- Precipitation (mm)
- Wind Speed (km/h)
- Wind Direction (°)

**Daily Variables:**
- Temperature Max/Min (°C)
- Precipitation Sum (mm)
- Wind Speed Max (km/h)
- Sunshine Duration (hours)

#### Step 5: Fetch and Analyze Data
1. **Click "Fetch Weather Data"**
2. **Wait for data loading** (may take a few moments)
3. **View the visualizations** that appear
4. **Use the variable tabs** to switch between different data views

### Weather Data Features

- **Interactive Charts**: Hover over data points for details
- **Variable Grouping**: Related variables are grouped together
- **Export Options**: (Educators only) Download data as Excel files
- **Responsive Design**: Works on tablets and mobile devices

---

## 📊 Managing Sensor Data

The Sensor section handles environmental sensor data from various monitoring devices.

### For All Users: Viewing Sensor Data

#### Step 1: Access Sensor Data
- Click **"Sensors"** in the navigation menu
- The default tab is **"View Data"**

#### Step 2: Use Filters
Apply filters to find specific data:
- **Date Range**: Filter by time period
- **Location**: Filter by monitoring location
- **Device ID**: Filter by specific sensor device
- **Data Type**: Filter by measurement type

#### Step 3: Explore the Data Table
- **Sort columns** by clicking headers
- **View details** for each measurement
- **Use pagination** to navigate through records
- **Check cache status** for performance information

#### Step 4: View Visualizations
- Click the **"Visualizations"** tab
- Explore different chart types:
  - Time series plots
  - Distribution histograms
  - Correlation matrices
  - Location-based maps

### For Administrators: Uploading Sensor Data

#### Step 1: Access Upload Tab
- Navigate to **Sensors** section
- Click the **"Upload Data"** tab

#### Step 2: Select Location
- Choose the **monitoring location** from dropdown
- This helps organize data by site

#### Step 3: Prepare Your File
**File Requirements:**
- **Format**: Excel (.xlsx) or CSV files
- **Required Columns**: timestamp, temperature, humidity
- **Optional Columns**: pressure, light_intensity, device_id
- **Date Format**: YYYY-MM-DD HH:MM:SS

**Sample Data Structure:**
```
timestamp,temperature,humidity,pressure,device_id
2024-01-15 10:00:00,25.5,68.2,1013.2,SENSOR_001
2024-01-15 10:15:00,25.8,67.9,1013.1,SENSOR_001
```

#### Step 4: Upload Process
1. **Drag and drop** your file or **click to browse**
2. **Wait for validation** - the system checks your data
3. **Review validation results** - fix any errors if needed
4. **Handle duplicates** - choose to skip or overwrite existing data
5. **Monitor upload progress** - watch the progress bar
6. **Confirm completion** - see success message with record count

### Data Quality Features

- **Automatic Validation**: Checks data format and completeness
- **Duplicate Detection**: Prevents data duplication
- **Progress Tracking**: Real-time upload status
- **Error Reporting**: Clear messages about any issues
- **Cache Management**: Optimized data loading and filtering

---

## 💧 Water Quality Data Entry

The Water Quality section allows users to record and analyze water quality measurements.

### Step-by-Step: Adding Water Quality Data

#### Step 1: Navigate to Water Quality
- Click **"Water Quality"** in the navigation menu
- Default view shows the **"Add Data"** tab

#### Step 2: Fill Out the Form

**Basic Information:**
- **Sample ID**: Unique identifier for your sample
- **Location**: Where the sample was collected
- **Test Date**: When the measurement was taken

**Water Quality Parameters:**
- **Temperature** (°C): Water temperature
- **pH**: Acidity/alkalinity level (0-14 scale)
- **Salinity** (ppt): Salt content in parts per thousand
- **Conductivity** (μS/cm): Electrical conductivity

**Nutrient Levels:**
- **Nitrates** (mg/L): NO₃⁻ concentration
- **Nitrites** (mg/L): NO₂⁻ concentration  
- **Ammonia** (mg/L): NH₃ concentration
- **Phosphates** (mg/L): PO₄³⁻ concentration

**Additional Information:**
- **Notes**: Any observations or special conditions
- **Weather Conditions**: Environmental context
- **Collection Method**: How the sample was obtained

#### Step 3: Submit Data
1. **Review all fields** for accuracy
2. **Click "Submit Data"**
3. **Wait for confirmation** message
4. **View your data** in the "View Data" tab

### Viewing Water Quality Data

#### Data Table Features:
- **Sortable columns** - click headers to sort
- **Filter options** - narrow down by date, location, etc.
- **Export capabilities** - (Educators only) download data
- **Detailed view** - click rows for full information

#### Visualization Options:
- **Parameter trends** over time
- **Location comparisons** 
- **Distribution charts** for each parameter
- **Correlation analysis** between parameters

---



---

## 🎓 Tips for Educators

### Classroom Integration
- **Start with Weather Data**: Easy introduction to data analysis
- **Use Real Sensor Data**: Connect to actual environmental monitoring
- **Assign Data Entry**: Have students record water quality measurements
- **Export for Analysis**: Download weather data for use in other tools (Excel, R, Python)

### Lesson Plan Ideas
1. **Climate Patterns**: Analyze seasonal weather trends in Hawaii
2. **Data Quality**: Discuss sensor accuracy and measurement uncertainty
3. **Environmental Monitoring**: Compare data from different locations
4. **Statistical Analysis**: Calculate means, trends, and correlations

### Student Management
- **Monitor Student Access**: Check who's using the platform
- **Guide Data Interpretation**: Help students understand what the data means
- **Encourage Questions**: Use data to spark scientific inquiry
- **Export Weather Data**: Save weather analyses for assessment

### Best Practices
- **Demonstrate First**: Show students how to navigate before independent work
- **Set Clear Objectives**: Define what students should accomplish
- **Provide Context**: Explain why the data is important
- **Encourage Exploration**: Let students discover patterns in the data

---

## 🎒 Tips for Students

### Getting the Most from the Platform

#### Start with Exploration
- **Browse all sections** to see what's available
- **Try different date ranges** in weather data
- **Experiment with filters** in sensor data
- **Look for patterns** in the visualizations

#### Develop Good Data Habits
- **Record observations** as you explore
- **Ask questions** about what you see
- **Compare different locations** and time periods
- **Think about what might cause the patterns**

#### Water Quality Projects
- **Plan your measurements** before collecting samples
- **Be consistent** with collection methods
- **Record environmental conditions** (weather, time of day)
- **Look for relationships** between different parameters

### Study Strategies

#### For Science Classes:
- **Connect to textbook concepts** - how do the data relate to what you're learning?
- **Make hypotheses** - predict what you'll find before looking at data
- **Test predictions** - use the data to confirm or refute your ideas
- **Draw conclusions** - what do the patterns tell you about the environment?

#### For Math/Statistics Classes:
- **Calculate basic statistics** - mean, median, standard deviation
- **Identify trends** - are values increasing, decreasing, or stable?
- **Compare datasets** - how do different locations or times compare?
- **Create your own graphs** - export weather data and make custom visualizations

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Login Problems
**Problem**: Can't sign in with Google
- **Solution**: Check your internet connection
- **Solution**: Try a different browser
- **Solution**: Clear browser cache and cookies
- **Solution**: Make sure your account has been granted access

#### Data Loading Issues
**Problem**: Weather data won't load
- **Solution**: Check your date range (max 1 year)
- **Solution**: Try a different location
- **Solution**: Refresh the page
- **Solution**: Check your internet connection

**Problem**: Sensor data table is empty
- **Solution**: Adjust your filters (date range, location)
- **Solution**: Clear all filters to see all data
- **Solution**: Check if data exists for your selected criteria

#### Upload Problems (Administrators)
**Problem**: File upload fails
- **Solution**: Check file format (Excel .xlsx or CSV)
- **Solution**: Verify required columns are present
- **Solution**: Check date format (YYYY-MM-DD HH:MM:SS)
- **Solution**: Ensure file size is reasonable (<10MB)

#### Browser Compatibility
**Recommended Browsers:**
- ✅ Chrome (latest version)
- ✅ Firefox (latest version)  
- ✅ Safari (latest version)
- ✅ Edge (latest version)

**Not Recommended:**
- ❌ Internet Explorer (not supported)
- ❌ Very old browser versions (may have compatibility issues)

### Performance Tips

#### For Better Performance:
- **Use smaller date ranges** when possible
- **Apply filters** to reduce data loading
- **Close unused browser tabs**
- **Use a stable internet connection**
- **Clear browser cache** occasionally

#### Mobile Usage:
- **Works on tablets** - iPad, Android tablets
- **Limited mobile phone support** - best on larger screens
- **Touch-friendly interface** - tap and swipe navigation
- **Responsive design** - adapts to screen size

---

## 📞 Support & Contact

### Getting Help

#### For Technical Issues:
- **Check this guide first** - most common questions are answered here
- **Try the troubleshooting steps** above
- **Contact your instructor** or system administrator
- **Email technical support**: [andriy@intofuture.org](mailto:andriy@intofuture.org)

#### For Account Access:
- **Role changes**: Contact your administrator
- **New user setup**: Email [andriy@intofuture.org](mailto:andriy@intofuture.org)
- **Permission issues**: Check with your instructor first

#### For Educational Support:
- **Lesson plan ideas**: Contact the development team
- **Feature requests**: Email suggestions to [andriy@intofuture.org](mailto:andriy@intofuture.org)
- **Training sessions**: Available for educator groups

### Project Information

**Nā Puna ʻIke Dashboard**
- **Developed by**: Institute for Future Intelligence
- **Technology**: React, TypeScript, Firebase
- **Hosted on**: GitHub Pages
- **Open Source**: Available on GitHub

**Project Goals:**
- Support STEM education in Hawaii
- Provide hands-on data science experience
- Connect students with real environmental data
- Foster scientific inquiry and critical thinking

---

## 📚 Additional Resources

### Learning More About the Data

#### Weather Data:
- **Source**: Open-Meteo API
- **Coverage**: Historical data for Hawaiian locations
- **Variables**: Temperature, humidity, precipitation, wind
- **Update Frequency**: Daily updates for historical data

#### Sensor Data:
- **Types**: Environmental monitoring sensors
- **Parameters**: Temperature, humidity, pressure, light
- **Locations**: Various monitoring sites across Hawaii
- **Collection**: Automated sensor networks

#### Water Quality:
- **Parameters**: pH, temperature, salinity, nutrients
- **Standards**: EPA water quality guidelines
- **Collection**: Manual sampling and testing
- **Applications**: Environmental monitoring, research

### Educational Standards Alignment

This platform supports learning objectives in:
- **Next Generation Science Standards (NGSS)**
- **Common Core Mathematics Standards**
- **Hawaii Department of Education Science Standards**
- **Data Science and Statistics curricula**

### Related Tools and Resources

#### For Further Analysis:
- **Excel**: Export data for spreadsheet analysis
- **Google Sheets**: Cloud-based data manipulation
- **R/RStudio**: Statistical analysis and visualization
- **Python/Jupyter**: Programming-based data science

#### Educational Websites:
- **NOAA Climate Data**: National weather service data
- **EPA Water Quality**: Federal water monitoring programs
- **Hawaii Climate Data**: State-specific environmental data

---

**Welcome to your data science journey with Nā Puna ʻIke! 🌊**

*This guide will be updated regularly. Please check back for new features and improvements.*

---

*Last Updated: August 2025*
*Version: 1.0*
*For the most current version of this guide, visit the [project repository](https://github.com/Institute-for-Future-Intelligence/itest-dashboard)*
