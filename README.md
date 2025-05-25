# BlogBreeze - Modern Blogging Platform

![BlogBreeze](public/blogbreeze-preview.png)

BlogBreeze is a modern, feature-rich blogging platform built with React, Appwrite, and TailwindCSS. It provides a seamless writing experience with a beautiful UI and robust functionality.

## 🚀 Features

- **User Authentication**
  - Email & Password authentication
  - Protected routes
  - User profile management

- **Blog Management**
  - Create, edit, and delete posts
  - Rich text editor with TinyMCE
  - Image upload support
  - Draft and publish workflow

- **Content Features**
  - Responsive image handling
  - Reading time estimation
  - Post categorization
  - Search functionality
  - Sort posts by date or title

- **UI/UX**
  - Responsive design
  - Dark/Light mode support
  - Loading states
  - Error handling
  - Smooth animations

## 🛠️ Tech Stack

- **Frontend:**
  - React 18
  - Redux Toolkit (State Management)
  - React Router v6
  - TailwindCSS
  - TinyMCE Editor

- **Backend:**
  - Appwrite (Backend as a Service)
  - Appwrite Storage
  - Appwrite Authentication

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/BlogBreeze.git
cd BlogBreeze
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_APPWRITE_URL="https://cloud.appwrite.io/v1"
VITE_APPWRITE_PROJECT_ID="your_project_id"
VITE_APPWRITE_DATABASE_ID="your_database_id"
VITE_APPWRITE_COLLECTION_ID="your_collection_id"
VITE_APPWRITE_BUCKET_ID="your_bucket_id"
VITE_TINYMCE_API_KEY="your_tinymce_api_key"
```

4. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
BlogBreeze/
├── src/
│   ├── appwrite/
│   │   ├── auth.js
│   │   └── config.js
│   ├── components/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── post-form/
│   │   └── ...
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Post.jsx
│   │   ├── AddPost.jsx
│   │   └── ...
│   ├── store/
│   │   ├── authSlice.js
│   │   └── store.js
│   └── ...
├── public/
└── ...
```

## ⚙️ Configuration

### Appwrite Setup

1. Create a project in Appwrite
2. Create a database with the following collections:
   - Posts
   - Users
3. Set up storage bucket for images
4. Configure authentication methods
5. Update environment variables

### Environment Variables

```env
VITE_APPWRITE_URL=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=
VITE_APPWRITE_COLLECTION_ID=
VITE_APPWRITE_BUCKET_ID=
VITE_TINYMCE_API_KEY=
```

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to your preferred hosting platform:
   - Vercel
   - Netlify
   - GitHub Pages
   - etc.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [React](https://reactjs.org/)
- [Appwrite](https://appwrite.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [TinyMCE](https://www.tiny.cloud/)

## 📧 Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter)

Project Link: [https://github.com/yourusername/BlogBreeze](https://github.com/yourusername/BlogBreeze)
