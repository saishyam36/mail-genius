# 📧 Mail Genius
*Boost your email productivity with Mail Genius - an AI-powered email generator with seamless Gmail integration*

---

## 🚀 Description

Mail Genius is an intelligent email management application that revolutionizes how you handle your inbox. Powered by advanced AI technology, it seamlessly integrates with Gmail to provide smart email generation, automated replies, grammar refinement, and intelligent email summarization. Whether you're managing a busy inbox or crafting the perfect professional email, Mail Genius enhances your productivity and better workflow efficiency with cutting-edge AI features.

---

## ✨ Features

🤖 **AI-Powered Email Generation** - Create professional emails instantly with customizable tone and creativity levels. Use Advance mode for more context specific email

📬 **Gmail Integration** - Seamless integration with Gmail API for real-time inbox management  

💬 **Smart Reply Feature** - Generate contextually appropriate replies using advanced AI algorithms with proper format

🔧 **AI Grammar Refine** - Intelligent grammar correction and addressing improvements for polished communication

📋 **Email Summarization** - Get concise, understandable summaries of lengthy emails with key insights and action items of the email

🎨 **Rich Text Editor** - Advanced email composition with formatting, lists, and styling options

🔍 **Smart Search** - Powerful email search functionality across your entire inbox

🖊️ **Configurtion** - Add your own google AI API for extensive use and Add Google Cloud Platform account with Gmail API if you require

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | AI/ML | Backend APIs | Styling | Build Tools |
|----------|-------|--------------|---------|-------------|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" height="40" alt="React"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" width="40" height="40" alt="Vertex AI"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" width="40" height="40" alt="Gmail API"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="40" height="40" alt="TailwindCSS"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" width="40" height="40" alt="Vite"/> |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40" height="40" alt="JavaScript"/> |  | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/axios/axios-plain.svg" width="40" height="40" alt="Axios"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="40" height="40" alt="HTML5"/> |  |
|  |  |  | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="40" height="40" alt="CSS3"/> |  |

</div>

**Core Technologies:**
- **Frontend**: React, React Router DOM, Context API
- **AI Integration**: Google GenAI, Vertex AI (Gemini 2.0 Flash)
- **Email Services**: Gmail API, Google OAuth 2.0
- **UI Framework**: Radix UI, Lucide React Icons
- **Styling**: TailwindCSS, SCSS
- **Build Tool**: Vite
- **Rich Text**: Lexical Editor

---

## 📦 Installation & Usage

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/saishyam36/mail-genius.git

# Navigate to project directory
cd mail-genius-frontend

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Usage

1. **Authentication**: Sign in with your Google account to enable Gmail integration
2. **Email Generation**: Use the AI-powered generator to create professional emails
3. **Inbox Management**: View and manage your Gmail inbox with advanced search
4. **Smart Replies**: Generate contextual replies using the Magic Reply feature
5. **Grammar Refinement**: Use AI Refine to improve email grammar and clarity
6. **Email Summarization**: Get quick summaries of lengthy emails

---

## 📁 Folder Structure

| Directory/File | Description |
|----------------|-------------|
| `📁 public/` | Static assets including logos and favicon |
| `📁 src/` | Main source code directory |
| `├── 📁 auth/` | Authentication logic and Google OAuth integration |
| `├── 📁 components/` | Reusable React components (UI, Editor, Modals) |
| `├── 📁 contexts/` | React Context providers for state management |
| `├── 📁 hooks/` | Custom React hooks (debounce, media queries) |
| `├── 📁 lib/` | Utility functions and helper libraries |
| `├── 📁 pages/` | Main application pages and routes |
| `├── 📁 services/` | API services (Gmail, GenAI integration) |
| `├── 📁 styles/` | SCSS stylesheets and custom styling |
| `├── 📁 utils/` | Helper functions and constants |
| `📄 App.jsx` | Main application component with routing |
| `📄 main.jsx` | Application entry point |
| `📄 index.html` | HTML template with SEO optimization |
| `📄 package.json` | Project dependencies and scripts |
| `📄 vite.config.js` | Vite build configuration |
| `📄 tailwind.config.js` | TailwindCSS configuration |

---

## 📸 Screenshots

| Email Generator | Inbox Management | Reply Editor |
|----------------|------------------|-------------|
| ![Email Generator](<img width="1918" height="864" alt="Screenshot 2025-09-04 230252" src="https://github.com/user-attachments/assets/899312ac-fd81-4426-a994-1f08138c6ea1" />) | ![Inbox](<img width="1919" height="860" alt="Screenshot 2025-09-04 230749" src="https://github.com/user-attachments/assets/8bba2c76-153c-484e-b7d9-2a2f6cb46f9f" />)| ![Reply] (<img width="1299" height="801" alt="Screenshot 2025-09-04 230823" src="https://github.com/user-attachments/assets/6ac5b541-3b15-447c-a6c1-ceec286fe838" />)|
| AI-powered email creation with customizable tone and creativity | Smart inbox with search and AI features | Smart replies and grammer refinement |

---

## 🤝 Contributing

We welcome contributions to Mail Genius! Here's how you can help:

### Development Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with descriptive messages**
   ```bash
   git commit -m "Add amazing new AI feature"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Guidelines

- Follow React best practices and hooks patterns
- Maintain consistent code formatting with ESLint
- Write descriptive commit messages
- Add comments for complex AI integration logic
- Test Gmail API integrations thoroughly

### Areas for Contribution

- 🔧 New AI features and integrations
- 🎨 UI/UX improvements and animations
- 📧 Enhanced email templates and formatting
- 🔍 Advanced search and filtering capabilities
- 🌐 Internationalization support

## 🌟 Support

If you find Mail Genius helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs or feature requests
- 💡 Contributing to the codebase
- 📢 Sharing with your network

---

<div align="center">

**Built with ❤️ using AI and modern web technologies**

[Website](https://mailgenius.vercel.app) • [Issues](https://github.com/yourusername/mail-genius/issues)

</div>
