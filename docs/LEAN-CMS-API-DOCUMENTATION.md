<metadata>
purpose: Complete API documentation for LEAN CMS Framework endpoints, schemas, and integrations
type: api-documentation
language: TypeScript
framework: Next.js 14 App Router + Payload CMS 3.x
api-version: 1.0.0
authentication: JWT + Session-based
last-updated: 2025-08-24
target-audience: developers-implementing-api
</metadata>

<overview>
Comprehensive API documentation for the LEAN CMS Framework covering all endpoints, request/response schemas, authentication, validation, real-time features, webhook integrations, and third-party service connections. Designed for rapid music artist and business website API implementation with type safety and validation.
</overview>

<api-architecture>
<routing-system>
  <base-url development="http://localhost:3000/api" production="https://yourdomain.com/api">
    <versioning>v1 (current)</versioning>
    <format>REST with JSON payloads</format>
    <status-codes>Standard HTTP status codes</status-codes>
  </base-url>
  
  <endpoint-structure>
    <pattern>/api/{resource}/{id?}/{action?}</pattern>
    <examples>
      <example>/api/contact - Contact form submission</example>
      <example>/api/gallery - Gallery items CRUD</example>
      <example>/api/tours - Tour events management</example>
      <example>/api/site-config - Site configuration</example>
      <example>/api/webhooks/n8n - Webhook integrations</example>
    </examples>
  </endpoint-structure>
  
  <request-response-format>
    <request-headers>
      <header name="Content-Type">application/json</header>
      <header name="Authorization">Bearer {jwt_token} (for authenticated endpoints)</header>
      <header name="X-API-Key">{api_key} (for webhook endpoints)</header>
    </request-headers>
    
    <response-structure>
      <success-response>
        <field name="success" type="boolean">Always true for successful requests</field>
        <field name="data" type="any">Response payload</field>
        <field name="meta" type="object">Request metadata (timestamp, requestId, version)</field>
      </success-response>
      
      <error-response>
        <field name="success" type="boolean">Always false for failed requests</field>
        <field name="error" type="object">Error details (code, message, details)</field>
        <field name="meta" type="object">Request metadata</field>
      </error-response>
    </response-structure>
  </request-response-format>
</routing-system>

<authentication-system>
  <jwt-authentication>
    <token-structure>
      <header>
        <field name="alg">HS256</field>
        <field name="typ">JWT</field>
      </header>
      <payload>
        <field name="sub">User ID</field>
        <field name="email">User email address</field>
        <field name="role">User role (admin, editor, viewer)</field>
        <field name="iat">Issued at timestamp</field>
        <field name="exp">Expiration timestamp</field>
      </payload>
    </token-structure>
    
    <token-lifecycle>
      <access-token expiry="15 minutes">Short-lived for API access</access-token>
      <refresh-token expiry="7 days">Long-lived for token renewal</refresh-token>
      <session-token expiry="24 hours">Browser session management</session-token>
    </token-lifecycle>
  </jwt-authentication>
  
  <role-based-access>
    <role name="admin">
      <permissions>Full CRUD access to all resources</permissions>
      <endpoints>All API endpoints including user management</endpoints>
    </role>
    
    <role name="editor">
      <permissions>CRUD access to content (tours, gallery, pages)</permissions>
      <endpoints>Content management APIs, no user management</endpoints>
    </role>
    
    <role name="viewer">
      <permissions>Read-only access to public content</permissions>
      <endpoints>Public GET endpoints only</endpoints>
    </role>
    
    <role name="public">
      <permissions>Access to public endpoints and form submissions</permissions>
      <endpoints>Contact forms, newsletter signup, public content</endpoints>
    </role>
  </role-based-access>
</authentication-system>
</api-architecture>

<core-endpoints>
<contact-api>
  <endpoint name="Submit Contact Form" method="POST" path="/api/contact">
    <description>Handle contact form submissions with validation and email delivery</description>
    <authentication>None (public endpoint with rate limiting)</authentication>
    
    <request-schema>
      <field name="name" type="string" required="true">
        <validation>
          <min-length>2</min-length>
          <max-length>100</max-length>
          <pattern>^[a-zA-Z\s]+$</pattern>
        </validation>
        <description>Contact person's full name</description>
      </field>
      
      <field name="email" type="string" required="true">
        <validation>
          <pattern>^[^\s@]+@[^\s@]+\.[^\s@]+$</pattern>
        </validation>
        <description>Valid email address for response</description>
      </field>
      
      <field name="subject" type="string" required="true">
        <validation>
          <min-length>5</min-length>
          <max-length>200</max-length>
        </validation>
        <description>Message subject line</description>
      </field>
      
      <field name="message" type="string" required="true">
        <validation>
          <min-length>10</min-length>
          <max-length>2000</max-length>
        </validation>
        <description>Detailed message content</description>
      </field>
      
      <field name="phoneNumber" type="string" required="false">
        <validation>
          <pattern>^[\+]?[1-9][\d]{0,15}$</pattern>
        </validation>
        <description>Optional phone number</description>
      </field>
      
      <field name="preferredContact" type="string" required="false">
        <validation>
          <enum>['email', 'phone']</enum>
          <default>'email'</default>
        </validation>
        <description>Preferred contact method</description>
      </field>
      
      <field name="honeypot" type="string" required="false">
        <validation>
          <must-be-empty>true</must-be-empty>
        </validation>
        <description>Spam protection field (must be empty)</description>
      </field>
    </request-schema>
    
    <response-schema>
      <success status="200">
        <field name="message" type="string">Contact form submitted successfully</field>
        <field name="submissionId" type="string">Unique submission identifier</field>
        <field name="estimatedResponse" type="string">24-48 hours</field>
      </success>
      
      <validation-error status="400">
        <field name="error.code" type="string">VALIDATION_ERROR</field>
        <field name="error.message" type="string">Invalid request data</field>
        <field name="error.details" type="object">Field-specific validation errors</field>
      </validation-error>
      
      <rate-limit-error status="429">
        <field name="error.code" type="string">RATE_LIMIT_EXCEEDED</field>
        <field name="error.message" type="string">Too many requests, please try again later</field>
        <field name="error.details.resetTime" type="string">ISO timestamp when limit resets</field>
      </rate-limit-error>
    </response-schema>
    
    <rate-limiting>
      <limit>5 requests per 15 minutes per IP address</limit>
      <headers>
        <header name="X-RateLimit-Limit">5</header>
        <header name="X-RateLimit-Remaining">4</header>
        <header name="X-RateLimit-Reset">1640995200</header>
      </headers>
    </rate-limiting>
    
    <example-request>
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "subject": "Booking Inquiry",
  "message": "Hi, I'm interested in booking you for our summer festival. Please let me know your availability and rates.",
  "phoneNumber": "+1-555-0123",
  "preferredContact": "email"
}
    </example-request>
    
    <example-response>
{
  "success": true,
  "data": {
    "message": "Contact form submitted successfully",
    "submissionId": "contact_1704063600_abc123",
    "estimatedResponse": "24-48 hours"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_1704063600_def456",
    "version": "1.0.0"
  }
}
    </example-response>
  </endpoint>
  
  <endpoint name="Get Contact Submissions" method="GET" path="/api/contact">
    <description>Retrieve contact form submissions (admin only)</description>
    <authentication>JWT required (admin role)</authentication>
    
    <query-parameters>
      <param name="page" type="number" default="1">Page number for pagination</param>
      <param name="limit" type="number" default="20" max="100">Items per page</param>
      <param name="status" type="string">Filter by status (new, responded, archived)</param>
      <param name="dateFrom" type="string">ISO date string for date range filtering</param>
      <param name="dateTo" type="string">ISO date string for date range filtering</param>
    </query-parameters>
    
    <response-schema>
      <success status="200">
        <field name="data" type="array">Array of contact submissions</field>
        <field name="pagination" type="object">Pagination metadata</field>
      </success>
    </response-schema>
  </endpoint>
</contact-api>

<gallery-api>
  <endpoint name="Get Gallery Items" method="GET" path="/api/gallery">
    <description>Retrieve gallery items with filtering and pagination</description>
    <authentication>None (public endpoint)</authentication>
    
    <query-parameters>
      <param name="category" type="string[]">Filter by categories (live, studio, acoustic, etc.)</param>
      <param name="featured" type="boolean">Filter by featured status</param>
      <param name="limit" type="number" default="12" max="50">Items per page</param>
      <param name="page" type="number" default="1">Page number</param>
      <param name="sort" type="string" default="createdAt">Sort field (createdAt, name, featured)</param>
      <param name="order" type="string" default="desc">Sort order (asc, desc)</param>
    </query-parameters>
    
    <response-schema>
      <success status="200">
        <field name="data" type="array">Array of gallery items</field>
        <field name="pagination" type="object">Pagination information</field>
        <field name="categories" type="array">Available categories for filtering</field>
      </success>
    </response-schema>
    
    <gallery-item-schema>
      <field name="id" type="string">Unique item identifier</field>
      <field name="type" type="string">Media type (image, video)</field>
      <field name="url" type="string">Full resolution media URL</field>
      <field name="thumbnailUrl" type="string">Optimized thumbnail URL</field>
      <field name="alt" type="string">Accessibility alt text</field>
      <field name="caption" type="string">Optional caption text</field>
      <field name="category" type="string[]">Item categories</field>
      <field name="featured" type="boolean">Featured status</field>
      <field name="metadata" type="object">Width, height, duration (for videos)</field>
      <field name="createdAt" type="string">ISO creation timestamp</field>
      <field name="updatedAt" type="string">ISO update timestamp</field>
    </gallery-item-schema>
    
    <example-request>
GET /api/gallery?category=live&category=acoustic&featured=true&limit=8&page=1
    </example-request>
    
    <example-response>
{
  "success": true,
  "data": [
    {
      "id": "gallery_1704063600_item1",
      "type": "image",
      "url": "/media/live-performance-1.jpg",
      "thumbnailUrl": "/media/live-performance-1-thumb.jpg",
      "alt": "Live acoustic performance at Blue Note",
      "caption": "Intimate acoustic set at the legendary Blue Note jazz club",
      "category": ["live", "acoustic"],
      "featured": true,
      "metadata": {
        "width": 1920,
        "height": 1280
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 8,
    "total": 24,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "categories": ["live", "studio", "acoustic", "video", "equipment", "crowd", "bts", "press"],
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_1704063600_gallery1",
    "version": "1.0.0"
  }
}
    </example-response>
  </endpoint>
  
  <endpoint name="Get Single Gallery Item" method="GET" path="/api/gallery/{id}">
    <description>Retrieve specific gallery item by ID</description>
    <authentication>None (public endpoint)</authentication>
    
    <path-parameters>
      <param name="id" type="string" required="true">Gallery item ID</param>
    </path-parameters>
    
    <response-schema>
      <success status="200">
        <field name="data" type="object">Gallery item details</field>
      </success>
      
      <not-found status="404">
        <field name="error.code" type="string">ITEM_NOT_FOUND</field>
        <field name="error.message" type="string">Gallery item not found</field>
      </not-found>
    </response-schema>
  </endpoint>
  
  <endpoint name="Create Gallery Item" method="POST" path="/api/gallery">
    <description>Create new gallery item (admin/editor only)</description>
    <authentication>JWT required (admin or editor role)</authentication>
    
    <request-schema>
      <field name="type" type="string" required="true">Media type (image, video)</field>
      <field name="url" type="string" required="true">Media file URL</field>
      <field name="alt" type="string" required="true">Alt text for accessibility</field>
      <field name="caption" type="string" required="false">Optional caption</field>
      <field name="category" type="string[]" required="true">Item categories</field>
      <field name="featured" type="boolean" default="false">Featured status</field>
    </request-schema>
    
    <response-schema>
      <success status="201">
        <field name="data" type="object">Created gallery item</field>
      </success>
    </response-schema>
  </endpoint>
  
  <endpoint name="Update Gallery Item" method="PUT" path="/api/gallery/{id}">
    <description>Update existing gallery item (admin/editor only)</description>
    <authentication>JWT required (admin or editor role)</authentication>
    
    <path-parameters>
      <param name="id" type="string" required="true">Gallery item ID</param>
    </path-parameters>
    
    <request-schema>
      <field name="alt" type="string">Updated alt text</field>
      <field name="caption" type="string">Updated caption</field>
      <field name="category" type="string[]">Updated categories</field>
      <field name="featured" type="boolean">Updated featured status</field>
    </request-schema>
  </endpoint>
  
  <endpoint name="Delete Gallery Item" method="DELETE" path="/api/gallery/{id}">
    <description>Delete gallery item (admin only)</description>
    <authentication>JWT required (admin role)</authentication>
    
    <path-parameters>
      <param name="id" type="string" required="true">Gallery item ID</param>
    </path-parameters>
    
    <response-schema>
      <success status="200">
        <field name="message" type="string">Gallery item deleted successfully</field>
      </success>
    </response-schema>
  </endpoint>
</gallery-api>

<tour-events-api>
  <endpoint name="Get Tour Events" method="GET" path="/api/tour-events">
    <description>Retrieve tour events with filtering options</description>
    <authentication>None (public endpoint)</authentication>
    
    <query-parameters>
      <param name="upcoming" type="boolean" default="true">Filter for upcoming events only</param>
      <param name="featured" type="boolean">Filter by featured status</param>
      <param name="city" type="string">Filter by city</param>
      <param name="dateFrom" type="string">ISO date string for date range filtering</param>
      <param name="dateTo" type="string">ISO date string for date range filtering</param>
      <param name="limit" type="number" default="10" max="50">Items per page</param>
      <param name="page" type="number" default="1">Page number</param>
    </query-parameters>
    
    <tour-event-schema>
      <field name="id" type="string">Unique event identifier</field>
      <field name="eventName" type="string">Event or tour name</field>
      <field name="venue" type="string">Venue name</field>
      <field name="city" type="string">City location</field>
      <field name="date" type="string">ISO datetime of event</field>
      <field name="ticketUrl" type="string">URL to purchase tickets</field>
      <field name="soldOut" type="boolean">Sold out status</field>
      <field name="featured" type="boolean">Featured event status</field>
      <field name="price" type="object">Price information (min, max, currency)</field>
      <field name="description" type="string">Event description</field>
      <field name="createdAt" type="string">ISO creation timestamp</field>
      <field name="updatedAt" type="string">ISO update timestamp</field>
    </tour-event-schema>
    
    <example-request>
GET /api/tour-events?upcoming=true&featured=true&limit=5
    </example-request>
    
    <example-response>
{
  "success": true,
  "data": [
    {
      "id": "tour_1704063600_event1",
      "eventName": "Electronic Nights Festival",
      "venue": "Red Rocks Amphitheatre",
      "city": "Morrison, CO",
      "date": "2024-07-15T20:00:00.000Z",
      "ticketUrl": "https://tickets.redrocks.com/event123",
      "soldOut": false,
      "featured": true,
      "price": {
        "min": 45,
        "max": 125,
        "currency": "USD"
      },
      "description": "Join us for an unforgettable night under the stars at the iconic Red Rocks venue",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 12,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_1704063600_tours1",
    "version": "1.0.0"
  }
}
    </example-response>
  </endpoint>
  
  <endpoint name="Create Tour Event" method="POST" path="/api/tour-events">
    <description>Create new tour event (admin/editor only)</description>
    <authentication>JWT required (admin or editor role)</authentication>
    
    <request-schema>
      <field name="eventName" type="string" required="true">Event name</field>
      <field name="venue" type="string" required="true">Venue name</field>
      <field name="city" type="string" required="true">City location</field>
      <field name="date" type="string" required="true">ISO datetime string</field>
      <field name="ticketUrl" type="string">Ticket purchase URL</field>
      <field name="featured" type="boolean" default="false">Featured status</field>
      <field name="price" type="object">Price information</field>
      <field name="description" type="string">Event description</field>
    </request-schema>
    
    <response-schema>
      <success status="201">
        <field name="data" type="object">Created tour event</field>
      </success>
    </response-schema>
  </endpoint>
  
  <endpoint name="Update Tour Event" method="PUT" path="/api/tour-events/{id}">
    <description>Update existing tour event (admin/editor only)</description>
    <authentication>JWT required (admin or editor role)</authentication>
  </endpoint>
  
  <endpoint name="Delete Tour Event" method="DELETE" path="/api/tour-events/{id}">
    <description>Delete tour event (admin only)</description>
    <authentication>JWT required (admin role)</authentication>
  </endpoint>
</tour-events-api>

<site-configuration-api>
  <endpoint name="Get Site Configuration" method="GET" path="/api/site-config">
    <description>Retrieve current site configuration</description>
    <authentication>None (public endpoint for basic config)</authentication>
    
    <response-schema>
      <success status="200">
        <field name="data" type="object">Site configuration object</field>
      </success>
    </response-schema>
    
    <site-config-schema>
      <field name="siteName" type="string">Site name/title</field>
      <field name="primaryColor" type="string">Primary brand color (hex)</field>
      <field name="secondaryColor" type="string">Secondary brand color (hex)</field>
      <field name="logo" type="object">Logo configuration (url, alt)</field>
      <field name="socialLinks" type="array">Social media links</field>
      <field name="contactInfo" type="object">Contact information</field>
      <field name="seoSettings" type="object">SEO meta configuration</field>
    </site-config-schema>
    
    <example-response>
{
  "success": true,
  "data": {
    "siteName": "Artist Name",
    "primaryColor": "#00ffff",
    "secondaryColor": "#8b5cf6",
    "logo": {
      "url": "/logo.png",
      "alt": "Artist Name Logo"
    },
    "socialLinks": [
      {
        "platform": "instagram",
        "url": "https://instagram.com/artistname",
        "username": "@artistname"
      },
      {
        "platform": "spotify",
        "url": "https://open.spotify.com/artist/artistid",
        "username": "Artist Name"
      }
    ],
    "contactInfo": {
      "email": "booking@artistname.com",
      "phone": "+1-555-0123"
    },
    "seoSettings": {
      "defaultTitle": "Artist Name - Electronic Music",
      "defaultDescription": "Official website of Artist Name featuring latest music, tour dates, and updates",
      "keywords": ["electronic music", "artist name", "tours", "music"]
    }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_1704063600_config1",
    "version": "1.0.0"
  }
}
    </example-response>
  </endpoint>
  
  <endpoint name="Update Site Configuration" method="PUT" path="/api/site-config">
    <description>Update site configuration (admin only)</description>
    <authentication>JWT required (admin role)</authentication>
    
    <request-schema>
      <field name="siteName" type="string">Updated site name</field>
      <field name="primaryColor" type="string">Updated primary color</field>
      <field name="secondaryColor" type="string">Updated secondary color</field>
      <field name="socialLinks" type="array">Updated social links</field>
      <field name="contactInfo" type="object">Updated contact info</field>
      <field name="seoSettings" type="object">Updated SEO settings</field>
    </request-schema>
  </endpoint>
</site-configuration-api>
</core-endpoints>

<authentication-endpoints>
<user-authentication>
  <endpoint name="User Login" method="POST" path="/api/auth/login">
    <description>Authenticate user and return JWT tokens</description>
    <authentication>None (public endpoint)</authentication>
    
    <request-schema>
      <field name="email" type="string" required="true">User email address</field>
      <field name="password" type="string" required="true">User password</field>
      <field name="rememberMe" type="boolean" default="false">Extended session duration</field>
    </request-schema>
    
    <response-schema>
      <success status="200">
        <field name="data.user" type="object">User profile information</field>
        <field name="data.accessToken" type="string">JWT access token (15 minutes)</field>
        <field name="data.refreshToken" type="string">Refresh token (7 days)</field>
        <field name="data.expiresAt" type="string">Token expiration timestamp</field>
      </success>
      
      <invalid-credentials status="401">
        <field name="error.code" type="string">INVALID_CREDENTIALS</field>
        <field name="error.message" type="string">Invalid email or password</field>
      </invalid-credentials>
    </response-schema>
  </endpoint>
  
  <endpoint name="Token Refresh" method="POST" path="/api/auth/refresh">
    <description>Refresh access token using refresh token</description>
    <authentication>Refresh token in request body</authentication>
    
    <request-schema>
      <field name="refreshToken" type="string" required="true">Valid refresh token</field>
    </request-schema>
    
    <response-schema>
      <success status="200">
        <field name="data.accessToken" type="string">New JWT access token</field>
        <field name="data.expiresAt" type="string">New expiration timestamp</field>
      </success>
    </response-schema>
  </endpoint>
  
  <endpoint name="User Logout" method="POST" path="/api/auth/logout">
    <description>Invalidate user session and tokens</description>
    <authentication>JWT required</authentication>
    
    <response-schema>
      <success status="200">
        <field name="message" type="string">Logged out successfully</field>
      </success>
    </response-schema>
  </endpoint>
  
  <endpoint name="Get Current User" method="GET" path="/api/auth/me">
    <description>Retrieve current authenticated user information</description>
    <authentication>JWT required</authentication>
    
    <response-schema>
      <success status="200">
        <field name="data" type="object">Current user profile</field>
      </success>
    </response-schema>
    
    <user-profile-schema>
      <field name="id" type="string">Unique user identifier</field>
      <field name="email" type="string">User email address</field>
      <field name="role" type="string">User role (admin, editor, viewer)</field>
      <field name="name" type="string">Display name</field>
      <field name="avatar" type="string">Avatar image URL</field>
      <field name="lastLogin" type="string">Last login timestamp</field>
      <field name="permissions" type="array">Available permissions</field>
    </user-profile-schema>
  </endpoint>
</user-authentication>

<user-management>
  <endpoint name="Get Users" method="GET" path="/api/users">
    <description>Retrieve all users (admin only)</description>
    <authentication>JWT required (admin role)</authentication>
    
    <query-parameters>
      <param name="role" type="string">Filter by user role</param>
      <param name="active" type="boolean">Filter by active status</param>
      <param name="limit" type="number" default="20" max="100">Items per page</param>
      <param name="page" type="number" default="1">Page number</param>
    </query-parameters>
  </endpoint>
  
  <endpoint name="Create User" method="POST" path="/api/users">
    <description>Create new user account (admin only)</description>
    <authentication>JWT required (admin role)</authentication>
    
    <request-schema>
      <field name="email" type="string" required="true">User email address</field>
      <field name="password" type="string" required="true">User password (min 8 chars)</field>
      <field name="name" type="string" required="true">Display name</field>
      <field name="role" type="string" required="true">User role</field>
    </request-schema>
  </endpoint>
  
  <endpoint name="Update User" method="PUT" path="/api/users/{id}">
    <description>Update user account (admin only)</description>
    <authentication>JWT required (admin role)</authentication>
  </endpoint>
  
  <endpoint name="Delete User" method="DELETE" path="/api/users/{id}">
    <description>Delete user account (admin only)</description>
    <authentication>JWT required (admin role)</authentication>
  </endpoint>
</user-management>
</authentication-endpoints>

<webhook-integrations>
<n8n-webhooks>
  <endpoint name="N8N Webhook Handler" method="POST" path="/api/webhooks/n8n/{workflow}">
    <description>Handle incoming n8n workflow webhooks</description>
    <authentication>API Key in X-API-Key header</authentication>
    
    <path-parameters>
      <param name="workflow" type="string" required="true">Workflow identifier</param>
    </path-parameters>
    
    <request-headers>
      <header name="X-API-Key" required="true">Webhook API key for authentication</header>
      <header name="X-N8N-Webhook-ID">n8n webhook identifier</header>
      <header name="Content-Type">application/json</header>
    </request-headers>
    
    <workflow-types>
      <workflow name="contact-form">
        <description>Process contact form submissions</description>
        <payload-structure>
          <field name="submissionId" type="string">Contact submission ID</field>
          <field name="contactData" type="object">Form submission data</field>
          <field name="timestamp" type="string">Submission timestamp</field>
        </payload-structure>
      </workflow>
      
      <workflow name="newsletter-signup">
        <description>Process newsletter subscriptions</description>
        <payload-structure>
          <field name="email" type="string">Subscriber email</field>
          <field name="source" type="string">Signup source (hero, footer, etc.)</field>
          <field name="metadata" type="object">Additional subscriber data</field>
        </payload-structure>
      </workflow>
      
      <workflow name="booking-inquiry">
        <description>Process booking inquiries</description>
        <payload-structure>
          <field name="inquiryId" type="string">Booking inquiry ID</field>
          <field name="bookingData" type="object">Booking request details</field>
          <field name="urgency" type="string">Inquiry priority level</field>
        </payload-structure>
      </workflow>
    </workflow-types>
    
    <response-schema>
      <success status="200">
        <field name="message" type="string">Webhook processed successfully</field>
        <field name="workflowId" type="string">n8n workflow execution ID</field>
      </success>
      
      <authentication-error status="401">
        <field name="error.code" type="string">INVALID_API_KEY</field>
        <field name="error.message" type="string">Invalid or missing API key</field>
      </authentication-error>
    </response-schema>
    
    <example-request>
POST /api/webhooks/n8n/contact-form
X-API-Key: your-webhook-api-key
Content-Type: application/json

{
  "submissionId": "contact_1704063600_abc123",
  "contactData": {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Booking Inquiry",
    "message": "Interested in booking for summer festival"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
    </example-request>
  </endpoint>
  
  <endpoint name="Get Webhook Logs" method="GET" path="/api/webhooks/logs">
    <description>Retrieve webhook execution logs (admin only)</description>
    <authentication>JWT required (admin role)</authentication>
    
    <query-parameters>
      <param name="workflow" type="string">Filter by workflow type</param>
      <param name="status" type="string">Filter by status (success, failed, pending)</param>
      <param name="dateFrom" type="string">Date range start (ISO string)</param>
      <param name="dateTo" type="string">Date range end (ISO string)</param>
      <param name="limit" type="number" default="50" max="200">Items per page</param>
    </query-parameters>
  </endpoint>
</n8n-webhooks>

<third-party-webhooks>
  <endpoint name="Stripe Webhook" method="POST" path="/api/webhooks/stripe">
    <description>Handle Stripe payment webhooks</description>
    <authentication>Stripe webhook signature verification</authentication>
    
    <webhook-events>
      <event name="payment_intent.succeeded">Payment completed successfully</event>
      <event name="payment_intent.payment_failed">Payment failed</event>
      <event name="invoice.payment_succeeded">Subscription payment succeeded</event>
      <event name="customer.subscription.updated">Subscription modified</event>
    </webhook-events>
  </endpoint>
  
  <endpoint name="Mailchimp Webhook" method="POST" path="/api/webhooks/mailchimp">
    <description>Handle Mailchimp audience webhooks</description>
    <authentication>Mailchimp webhook secret verification</authentication>
    
    <webhook-events>
      <event name="subscribe">New subscriber added</event>
      <event name="unsubscribe">Subscriber removed</event>
      <event name="profile">Subscriber profile updated</event>
      <event name="email">Email address changed</event>
    </webhook-events>
  </endpoint>
</third-party-webhooks>
</webhook-integrations>

<real-time-features>
<websocket-connections>
  <endpoint name="WebSocket Connection" protocol="WSS" path="/api/websocket">
    <description>Establish WebSocket connection for real-time updates</description>
    <authentication>JWT token in connection query parameter</authentication>
    
    <connection-url>
      <development>ws://localhost:3000/api/websocket?token={jwt_token}</development>
      <production>wss://yourdomain.com/api/websocket?token={jwt_token}</production>
    </connection-url>
    
    <message-types>
      <message-type name="tour_event_created">
        <description>New tour event published</description>
        <payload>
          <field name="type" type="string">tour_event_created</field>
          <field name="data" type="object">Tour event details</field>
        </payload>
      </message-type>
      
      <message-type name="gallery_item_added">
        <description>New gallery item published</description>
        <payload>
          <field name="type" type="string">gallery_item_added</field>
          <field name="data" type="object">Gallery item details</field>
        </payload>
      </message-type>
      
      <message-type name="site_config_updated">
        <description>Site configuration changed</description>
        <payload>
          <field name="type" type="string">site_config_updated</field>
          <field name="data" type="object">Updated configuration</field>
        </payload>
      </message-type>
    </message-types>
  </endpoint>
</websocket-connections>

<server-sent-events>
  <endpoint name="SSE Stream" method="GET" path="/api/events">
    <description>Server-Sent Events stream for real-time updates</description>
    <authentication>JWT token in Authorization header</authentication>
    
    <event-types>
      <event name="content-updated">Content changes (tours, gallery, etc.)</event>
      <event name="system-notification">System-wide notifications</event>
      <event name="user-activity">Admin user activity updates</event>
    </event-types>
    
    <example-usage>
const eventSource = new EventSource('/api/events', {
  headers: {
    'Authorization': 'Bearer ' + accessToken
  }
})

eventSource.addEventListener('content-updated', (event) => {
  const data = JSON.parse(event.data)
  // Handle content update
})
    </example-usage>
  </endpoint>
</server-sent-events>
</real-time-features>

<error-handling>
<error-codes>
  <error code="VALIDATION_ERROR" status="400">
    <description>Request data validation failed</description>
    <typical-causes>Missing required fields, invalid data types, constraint violations</typical-causes>
    <resolution>Check request payload against API schema</resolution>
  </error>
  
  <error code="AUTHENTICATION_REQUIRED" status="401">
    <description>Authentication required but not provided</description>
    <typical-causes>Missing or invalid JWT token</typical-causes>
    <resolution>Include valid JWT token in Authorization header</resolution>
  </error>
  
  <error code="INSUFFICIENT_PERMISSIONS" status="403">
    <description>User lacks required permissions</description>
    <typical-causes>Role-based access control violation</typical-causes>
    <resolution>Ensure user has appropriate role for requested operation</resolution>
  </error>
  
  <error code="RESOURCE_NOT_FOUND" status="404">
    <description>Requested resource does not exist</description>
    <typical-causes>Invalid ID, deleted resource, wrong endpoint</typical-causes>
    <resolution>Verify resource ID and endpoint URL</resolution>
  </error>
  
  <error code="RATE_LIMIT_EXCEEDED" status="429">
    <description>Too many requests within time window</description>
    <typical-causes>Exceeded API rate limits</typical-causes>
    <resolution>Implement request throttling and retry with exponential backoff</resolution>
  </error>
  
  <error code="INTERNAL_SERVER_ERROR" status="500">
    <description>Unexpected server error occurred</description>
    <typical-causes>Database connection issues, third-party service failures</typical-causes>
    <resolution>Retry request, contact support if persistent</resolution>
  </error>
</error-codes>

<error-response-format>
  <standard-format>
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": {
      "field": "specific error details",
      "validation": "detailed validation errors"
    }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_1704063600_error1",
    "version": "1.0.0"
  }
}
  </standard-format>
  
  <validation-error-example>
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "email": ["Must be a valid email address"],
      "name": ["Must be at least 2 characters long"],
      "message": ["Must be at least 10 characters long"]
    }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_1704063600_val_error",
    "version": "1.0.0"
  }
}
  </validation-error-example>
</error-response-format>
</error-handling>

<rate-limiting>
<limits-by-endpoint>
  <endpoint name="/api/contact" limit="5 requests per 15 minutes per IP">
    <reason>Prevent spam and abuse</reason>
    <headers>X-RateLimit-* headers included in response</headers>
  </endpoint>
  
  <endpoint name="/api/auth/login" limit="10 requests per 15 minutes per IP">
    <reason>Prevent brute force attacks</reason>
    <lockout>Account lockout after 5 consecutive failed attempts</lockout>
  </endpoint>
  
  <endpoint name="/api/gallery" limit="100 requests per hour per IP">
    <reason>Prevent excessive bandwidth usage</reason>
    <bypass>Authenticated users get higher limits</bypass>
  </endpoint>
  
  <endpoint name="/api/webhooks/*" limit="1000 requests per hour per API key">
    <reason>Prevent webhook flooding</reason>
    <scaling>Limits scale with subscription tier</scaling>
  </endpoint>
</limits-by-endpoint>

<rate-limit-headers>
  <header name="X-RateLimit-Limit">Maximum requests allowed in window</header>
  <header name="X-RateLimit-Remaining">Requests remaining in current window</header>
  <header name="X-RateLimit-Reset">Unix timestamp when window resets</header>
  <header name="X-RateLimit-Retry-After">Seconds to wait before retry (when limited)</header>
</rate-limit-headers>

<implementation-example>
// Rate limiting check in API middleware
if (!rateLimit.check(clientId, endpoint)) {
  return Response.json({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
      details: {
        resetTime: rateLimit.getResetTime(clientId),
        retryAfter: rateLimit.getRetryAfter(clientId)
      }
    }
  }, { 
    status: 429,
    headers: rateLimit.getHeaders(clientId)
  })
}
</implementation-example>
</rate-limiting>

<api-versioning>
<versioning-strategy>
  <current-version>v1</current-version>
  <version-header>X-API-Version: v1</version-header>
  <url-versioning>Not implemented (using header-based)</url-versioning>
  <backward-compatibility>Maintain compatibility for 2 major versions</backward-compatibility>
</versioning-strategy>

<version-lifecycle>
  <v1 status="stable" support="full">
    <introduced>2024-01-01</introduced>
    <deprecation-date>TBD</deprecation-date>
    <sunset-date>TBD</sunset-date>
  </v1>
  
  <v2 status="planned" support="development">
    <planned-features>Enhanced filtering, GraphQL support, bulk operations</planned-features>
    <estimated-release>Q3 2024</estimated-release>
  </v2>
</version-lifecycle>

<migration-support>
  <breaking-changes-policy>
    <notification>90 days advance notice for breaking changes</notification>
    <migration-guides>Detailed migration documentation provided</migration-guides>
    <deprecation-warnings>API responses include deprecation warnings</deprecation-warnings>
  </breaking-changes-policy>
</migration-support>
</api-versioning>