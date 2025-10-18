# Courts_Scrapper
eCourts Scraper: Real-time Indian court case lookup. Check case listings, download cause lists as PDFs. Beautiful glass-morphism UI with custom cursor. Live data from eCourts services. Search by CNR or case details. Responsive design with smooth animations.
eCourts Case Listing Scraper - Complete Technical Documentation
🎯 What It Is
A full-stack web application that provides real-time access to Indian court case information by integrating with the official eCourts services portal. The system enables users to check case listings, search specific cases, and download cause lists from various courts across India.

🚀 Why This Is Needed
Legal Accessibility: Simplifies access to court information for lawyers, litigants, and researchers

Time Efficiency: Automates manual court visits and paperwork

Digital Transformation: Bridges gap between legacy court systems and modern web interfaces

Transparency: Provides easy access to public court records and listings

📋 Indian Legal System Basics
Key Terminology
CNR (Case Number Registration)
What: Unique 16-digit identification number for every case in Indian courts

Format: STCDYJJNNNNYYYY (State-Court-District-Judge-Case-Year)

Purpose: Universal case tracking across all Indian courts

Example: MHAU010012342023 = Maharashtra High Court, Aurangabad, Judge 1, Case 1234, Year 2023

Case Types
CR - Criminal Case (State vs Accused)

CS - Civil Suit (Private party disputes)

CC - Criminal Complaint (Private criminal cases)

WP - Writ Petition (Constitutional matters)

APL - Appeal (Higher court appeals)

RPT - Revision Petition

BA - Bail Application

Court Hierarchy
Supreme Court - Apex court (New Delhi)

High Courts - State-level appellate courts

District Courts - Principal civil courts in districts

Session Courts - Criminal cases jurisdiction

Magistrate Courts - Lower criminal courts

Special Courts - Specific matters (CBI, NIA, etc.)

Legal Documents
Cause List: Daily schedule of cases to be heard

FIR: First Information Report (criminal cases)

Chargesheet: Final police investigation report

Judgment: Final court decision

Order: Interim court directions

🌐 API Integration & Data Sources
Official eCourts Services API Endpoints
1. Case Search APIs
python
# CNR-based Case Search
Endpoint: "https://services.ecourts.gov.in/ecourtindia_v6/index.php"
Method: POST
Parameters: {
    'action_type': 'CNR',
    'cnr_no': 'MHAU010012342023',
    'submit': 'Get Status'
}

# Case Details Search
Endpoint: "https://services.ecourts.gov.in/ecourtindia_v6/index.php"
Method: POST
Parameters: {
    'action_type': 'CASENO',
    'case_no': '123',
    'case_type': 'CR',
    'rgyear': '2023',
    'state_code': '26',
    'dist_code': '1',
    'court_code': '1',
    'submit': 'Get Status'
}
2. Court Hierarchy APIs
python
# States List
Endpoint: "https://services.ecourts.gov.in/ecourtindia_v6/index.php"
Method: GET - Scraped from state dropdown

# Districts List
Endpoint: "https://services.ecourts.gov.in/ecourtindia_v6/ajax/load_district.php"
Method: POST
Parameters: {'state_code': '26'}

# Court Complexes
Endpoint: "https://services.ecourts.gov.in/ecourtindia_v6/ajax/load_court_complex.php"
Method: POST
Parameters: {'state_code': '26', 'dist_code': '1'}

# Courts List
Endpoint: "https://services.ecourts.gov.in/ecourtindia_v6/ajax/load_court.php"
Method: POST
Parameters: {
    'state_code': '26',
    'dist_code': '1', 
    'court_complex_code': '1'
}
3. Cause List APIs
python
# Cause List Data
Endpoint: "https://services.ecourts.gov.in/ecourtindia_v6/causelist/index.php"
Method: POST
Parameters: {
    'state_code': '26',
    'dist_code': '1',
    'court_complex_code': '1',
    'court_code': '1',
    'causelist_date': '2024-01-15',
    'submit': 'Get Cause List'
}
Custom Backend API Endpoints
1. Court Hierarchy Management
python
GET  /api/states              # Get all states
POST /api/districts           # Get districts by state
POST /api/court-complexes     # Get complexes by district
POST /api/courts              # Get courts by complex
2. Case Operations
python
POST /api/check-case          # Search case by CNR or details
POST /api/cause-list          # Fetch cause list data
POST /api/download-causelist  # Download cause list PDF
POST /api/download-case-pdf   # Download case details PDF
3. System Management
python
GET  /api/health              # System status check
GET  /api/test-connection     # eCourts connectivity test
⚙️ How It Works
Data Flow Architecture
text
User Input → Frontend → Flask API → eCourts Services → Data Processing → Response
     ↓          ↓           ↓            ↓                ↓            ↓
  CNR/Case   AJAX Call   Route Handler  Web Scraping   HTML Parsing  JSON/PDF
   Details   JavaScript   @app.route()  Requests       BeautifulSoup Response
Frontend Architecture
HTML5: Semantic structure with modern web standards

CSS3: Advanced styling with glass morphism effects

JavaScript ES6+: Dynamic client-side functionality

Backend Architecture
Python Flask: Lightweight web framework for API endpoints

Web Scraping: BeautifulSoup4 for parsing eCourts HTML responses

RESTful API: JSON-based communication between frontend and backend

Complete Data Flow
User Input: Selects court hierarchy or enters case details

Frontend Processing: Validates input and prepares API request

API Call: Sends request to custom Flask backend

Web Scraping: Backend queries official eCourts services

Data Extraction: Parses HTML responses using BeautifulSoup

Data Processing: Structures extracted data into JSON format

Response: Returns processed data to frontend

UI Update: Displays results with interactive elements

🛠 Technologies & Libraries Used
Frontend Stack
javascript
// Core Technologies
HTML5 - Page structure and semantics
CSS3 - Styling with advanced features
JavaScript ES6+ - Client-side logic

// CSS Features Used
Glass Morphism - Translucent background effects
CSS Grid & Flexbox - Responsive layouts
CSS Animations - Smooth transitions and hover effects
CSS Variables - Dynamic theming system
Custom Properties - Dark/light mode switching

// JavaScript Concepts
DOM Manipulation - Dynamic content updates
Event Handling - User interaction management
AJAX/Fetch API - Asynchronous server communication
ES6 Modules - Code organization
Async/Await - Promise-based asynchronous operations
Local Storage - User preferences persistence
Backend Stack
python
# Core Framework
Flask == 2.3.3 - Python web framework
Flask-CORS == 4.0.0 - Cross-origin resource sharing

# Web Scraping & Data Processing
BeautifulSoup4 == 4.12.2 - HTML parsing and data extraction
Requests == 2.31.0 - HTTP client for API calls
lxml == 4.9.3 - XML/HTML processing engine

# PDF Generation & Templating
pdfkit == 1.0.0 - HTML to PDF conversion
Jinja2 == 3.1.2 - Template rendering engine
wkhtmltopdf - External PDF rendering engine

# Additional Utilities
datetime - Date and time manipulation
tempfile - Temporary file handling
json - Data serialization
re - Regular expressions for data cleaning
🔧 Key Technical Concepts Implemented
1. Web Scraping Strategy
Session Management: Persistent connections to eCourts

Form Simulation: Automated form submissions

HTML Parsing: Extracting structured data from HTML tables

Error Handling: Network timeout and data validation

Rate Limiting: Respectful scraping to avoid server overload

2. API Design Patterns
RESTful Principles: Resource-based endpoint design

Error Standardization: Consistent error response format

Data Validation: Input sanitization and validation

CORS Configuration: Secure cross-origin requests

Status Codes: Appropriate HTTP response codes

3. Glass Morphism Design
Backdrop filters for frosted glass effects

RGBA color values with transparency

Layered shadows for depth perception

Gradient backgrounds with animations

4. Responsive Web Design
Mobile-first approach

Flexible grid systems

Media queries for breakpoints

Touch-friendly interface elements

5. Asynchronous Programming
Non-blocking API calls

Promise handling with async/await

Loading states and error handling

Concurrent data fetching

6. State Management
Client-side state for UI interactions

Server-side session handling

Local storage for user preferences

Form state validation

7. PDF Generation
HTML templating with dynamic data

CSS styling for print media

File streaming and download handling

Temporary file management

8. Custom Cursor System
CSS-based custom cursor design

JavaScript event handling for cursor movement

Hover state detection and styling

Mobile device compatibility checks

📊 System Features
Core Functionality
CNR-based Search: Lookup cases using unique CNR numbers

Case Details Search: Find cases using type/number/year combination

Cause List Download: Get daily court schedules as PDF

Court Navigation: Browse through state-district-court hierarchy

Real-time Data: Live information from eCourts services

Legal Use Cases
Lawyers: Check case status and hearing dates

Litigants: Track their case progress

Researchers: Access court data for legal studies

Journalists: Monitor important case developments

Students: Learn about Indian judicial system

User Experience
Smooth animations and transitions

Responsive design for all devices

Intuitive navigation and feedback

Error handling and validation

Loading states and progress indicators

Data Management
Structured JSON responses

Efficient data caching

Error recovery mechanisms

Data validation and sanitization

🔍 Search Methods Supported
1. CNR Search
text
Input: MHAU010012342023
Output: Complete case details including parties, status, next hearing
2. Case Details Search
text
Input: Case Type = CR, Number = 123, Year = 2023
Output: Case CR/123/2023 information
3. Cause List Access
text
Input: Court selection + Date
Output: PDF of all cases listed for that day
🔒 Technical Considerations
Security Measures
Input validation and sanitization

CORS configuration for controlled access

Error handling without sensitive data exposure

Rate limiting for API protection

Performance Optimizations
Asynchronous operations for non-blocking UI

Efficient DOM updates

Cached court hierarchy data

Optimized PDF generation

Compatibility
Cross-browser support

Mobile-responsive design

Progressive enhancement

Accessibility considerations
