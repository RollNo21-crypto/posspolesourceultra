# Posspole Source 

# POSSPOLE - RFQ Marketplace

POSSPOLE Source is a comprehensive marketplace platform designed for buying, selling, and donating laboratory and medical equipment. The platform facilitates connections between equipment providers and institutions in need, streamlining the process of equipment acquisition and donation.

## Features

### For Users
- **Buy Equipment**: Browse and request quotes for laboratory equipment
- **Donate Equipment**: List and donate unused or surplus equipment
- **Sell Equipment**: Register as a seller and list products for sale
- **Request Management**: Track buy and donation requests
- **Real-time Updates**: Get notifications on request status changes

### For Administrators
- **Dashboard**: Comprehensive overview of platform activities
- **Request Management**: Handle buy and donation requests
- **Seller Management**: Review and manage seller applications
- **Product Management**: Monitor and moderate product listings
- **Email Communication**: Built-in system for user communications

## Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Tailwind CSS
  - Lucide Icons
  - React Router DOM
  - React Hot Toast
  - Zustand (State Management)

- **Backend**:
  - Supabase (Database & Authentication)
  - Row Level Security (RLS)
  - PostgreSQL

- **Development**:
  - Vite
  - ESLint
  - PostCSS
  - TypeScript ESLint

## Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd posspole
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
posspole/
├── src/
│   ├── components/
│   │   ├── admin/      # Admin panel components
│   │   ├── layout/     # Layout components
│   │   └── ui/         # Reusable UI components
│   ├── lib/
│   │   ├── hooks/      # Custom React hooks
│   │   ├── supabase/   # Supabase client & types
│   │   └── utils/      # Utility functions
│   ├── pages/          # Page components
│   └── main.tsx        # Application entry point
├── public/             # Static assets
├── supabase/
│   └── migrations/     # Database migrations
└── package.json
```

## Key Features

### User Features
- Product browsing with category filters
- Quote request system
- Donation management
- Seller registration and management
- Real-time status updates
- Email notifications

### Admin Features
- Comprehensive dashboard
- Request management
- Seller verification
- Product moderation
- User communication system
- Export functionality (CSV)

### Security Features
- Row Level Security (RLS)
- Role-based access control
- Secure authentication
- Data validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@posspole.com or create an issue in the repository.

## Acknowledgments

- [React](https://reactjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)