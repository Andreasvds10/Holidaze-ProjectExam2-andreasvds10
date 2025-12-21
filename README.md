# Holidaze-ProjectExam2-andreasvds10

Noroff Project Exam 2 – Holidaze front-end

# Holidaze – Accommodation Booking Front-end

Exam project for Noroff FEU – **Project Exam 2**.  
This application is a front-end for the Holidaze accommodation booking API, built with **React + TypeScript + Vite**.

The project implements both:

- **Customer-facing features** – browsing venues and making bookings
- **Venue manager features** – managing venues and viewing bookings

---

## ✨ Features (User Stories)

### All Users

-  View a list of venues
-  Search for venues by name / location
-  View a single venue by ID with image, description, price, facilities and location
-  See booked dates for a venue and choose available dates when creating a booking

# Customers (Logged-in Users)

-  Register with a `@stud.noroff.no` email
-  Log in and log out
-  Create a booking on a venue
-  View upcoming bookings (separated from past bookings)
-  View and update profile avatar

# Venue Managers

-  Register as a Venue Manager
-  Log in and log out
-  Create a new venue (with media, meta and location)
-  Edit an existing venue
-  Delete a venue
-  View upcoming bookings for the venues they manage

---

# Tech Stack

- **Framework**: React (TypeScript, Vite)
- **Language**: TypeScript
- **Data fetching**: TanStack Query (React Query)
- **Forms & validation**:
  - React Hook Form
  - Zod (+ `@hookform/resolvers`)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **API**: Noroff Holidaze v2
- **Build tool**: Vite

---

#Project Structure

```text
src/
  app/
    queryClient.ts           # React Query client setup
  components/
    booking/
      BookingCalendar.tsx      # Calendar for booking dates
    home/
      BecomeHost.tsx           # Call to action for becoming a host
      FeaturedVenues.tsx       # Displays popular venues
      Features.tsx             # Highlights key features
      Hero.tsx                 # Hero section with main call to action and search
      InfoSection.tsx          # General information and statistics
      VenueCategories.tsx      # Section to browse venues by category
    layout/
      Footer.tsx
      Header.tsx
      Navigation.tsx
    ui/
      Toast.tsx                # UI for notifications
  features/
    bookings/
      Auth/
        authApi.ts             # Authentication API calls
        loginPage.tsx
        registerPage.tsx
        store.ts               # Auth store (Zustand)
        utils.ts
      blockedDates.ts          # Utility for handling blocked dates
      bookingsApi.ts           # Bookings API calls
      MyBookingsPage.tsx
      profile/
        profileApi.ts          # Profile API calls
        ProfilePage.tsx
      venues/
        VenuePage.tsx
        venuesApi.ts           # Venues API calls
        VenuesPage.tsx
    manager/
      CreateVenuePage.tsx
      EditVenuePage.tsx
      ManagerVenuesPage.tsx
      VenueBookingsPage.tsx    # Manager view of venue bookings
  lib/
    api.ts                   # API helper using VITE_API_URL
  pages/
    HomePage.tsx             # Main landing page
    NotFoundPage.tsx
  routes/
    App.tsx                  # Application routes
  shared/
    Layout.tsx               # Layout with header / footer
    RequireAuth.tsx          # Simple auth / manager guards
  index.css                  # Tailwind CSS imports and custom styles
  main.tsx                   # Main entry point for React app
```
