import React from 'react';

function Footer() {
  return (
    <div>
      <hr />
      <footer className="footer footer-center text-base-content rounded p-10 dark:text-white">
        {/* Navigation Links */}
        <nav className="grid grid-flow-col gap-4">
          {/* Update "Contact Us" to send an email */}
          <a
            href="zuberbagawan8@gmail.com"
            className="link link-hover"
          >
            Contact Us
          </a>
          <a href="#privacy" className="link link-hover">
            Privacy Policy
          </a>
          <a href="#terms" className="link link-hover">
            T&C
          </a>
        </nav>

        {/* Social Media Links */}
        <nav>
          <div className="grid grid-flow-col gap-4">
            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >{/* Instagram */}
            <a
             href="https://instagram.com"
             target="_blank"
             rel="noopener noreferrer"
             aria-label="Instagram"
             className="text-blue-500 hover:underline" // Optional: Add styling
            >
  
</a>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M7.75 2h8.5C19.55 2 22 4.45 22 7.75v8.5C22 19.55 19.55 22 16.25 22h-8.5C4.45 22 2 19.55 2 16.25v-8.5C2 4.45 4.45 2 7.75 2zm0 2C5.68 4 4 5.68 4 7.75v8.5C4 18.32 5.68 20 7.75 20h8.5c2.07 0 3.75-1.68 3.75-3.75v-8.5C20 5.68 18.32 4 16.25 4h-8.5zM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm4.25-4a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
              </svg>
            </a>
          </div>
        </nav>

        {/* Footer Text */}
    <aside className="space-y-2">
  <p>
    Contact us at: 
    <p>
    Contact us at: 
    <a href="mailto : mraltamash23@gmail.com" className="text-blue-600 hover:underline">
      mraltamash23@gmail.com
    </a>/ 
    <a href="mailto: zuberbagawan8@gmail.com" className="text-blue-600 hover:underline">
      zuberbagawan8@gmail.com
    </a>/ 
    <a href="mailto: sadiq@gmail.com" className="text-blue-600 hover:underline">
      sadiq@gmail.com
    </a>
  </p>

  </p>
  
  <p className="flex items-center">
    Technical Support:
    <span className="flex space-x-4 ml-2"> {/* Flex container for horizontal layout */}
      {['8431892612', '7411776939', '8123073259'].map((number, index) => (
        <a 
          key={index}
          href={`tel:${number}`}
          className="flex items-center text-blue-600 hover:underline"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          {number}
        </a>
      ))}
    </span>
  </p>
</aside>



      </footer>
    </div>
  );
}

export default Footer;
