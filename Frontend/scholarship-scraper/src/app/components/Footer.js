export default function Footer() {
    return (
      <footer className="bg-blue-800 text-gray-300 py-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* need to add nsbe logo in heree */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold text-white">NSBE</h3>
            <p className="text-sm">National Society of Black Engineers</p>
          </div>
  
          {/* Social Media Links */}
          <div className="flex space-x-6">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/psunsbe/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white-300 hover:text-white transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.31.974.974 1.248 2.241 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.634-1.31 3.608-.975.975-2.242 1.248-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.634-.336-3.608-1.31-.975-.975-1.248-2.242-1.31-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.336-2.634 1.31-3.608.975-.975 2.242-1.248 3.608-1.31 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.507.068-2.849.348-3.892 1.391-1.043 1.043-1.324 2.385-1.391 3.892-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.068 1.507.348 2.849 1.391 3.892 1.043 1.043 2.385 1.324 3.892 1.391 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.507-.068 2.849-.348 3.892-1.391 1.043-1.043 1.324-2.385 1.391-3.892.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.068-1.507-.348-2.849-1.391-3.892-1.043-1.043-2.385-1.324-3.892-1.391-1.28-.058-1.688-.072-4.947-.072zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.207 0-4-1.794-4-4s1.793-4 4-4c2.207 0 4 1.794 4 4s-1.793 4-4 4zm6.406-11.845c-.796 0-1.441.646-1.441 1.441 0 .796.646 1.441 1.441 1.441.796 0 1.441-.646 1.441-1.441 0-.796-.645-1.441-1.441-1.441z" />
              </svg>
            </a>
  
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/psunsbe/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white-300 hover:text-white transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.79-1.75-1.732s.784-1.732 1.75-1.732 1.75.79 1.75 1.732-.784 1.732-1.75 1.732zm13.5 10.268h-3v-4.535c0-1.085-.019-2.482-1.512-2.482-1.514 0-1.745 1.182-1.745 2.404v4.613h-3v-9h2.888v1.233h.041c.403-.762 1.386-1.561 2.85-1.561 3.046 0 3.607 2.005 3.607 4.613v4.715z" />
              </svg>
            </a>
  
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@psunsbe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white-300 hover:text-white transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M22.542 5.947c-.001-.188-.003-.376-.006-.563h-3.451c-.116-2.105-1.645-3.873-3.73-4.35v5.075c1.051.415 2.274.222 3.106-.568-.024.13-.034.261-.034.393.001 2.749 2.229 4.977 4.978 4.978 1.096 0 2.106-.35 2.95-.932v4.548c-.898.217-1.817.326-2.748.326-4.441 0-8.086-2.704-9.464-6.489-2.096 1.725-3.88 3.71-5.322 5.875-1.091 1.696-1.993 3.537-2.682 5.494h3.752c1.197-3.355 3.259-6.354 6.019-8.677-1.229 2.445-.932 5.577.904 7.69 1.324 1.692 3.407 2.673 5.529 2.672.931-.001 1.851-.108 2.75-.324v-5.15c-.83.713-1.891 1.113-3 1.113-2.464 0-4.465-2-4.465-4.464v-9.62h-5.132v9.622c0 3.025-2.47 5.495-5.495 5.495s-5.495-2.47-5.495-5.495v-9.622h5.134z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    );
  }