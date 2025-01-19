import os

# Define the folder structure
folders = [
    'src/pages'
]

# Define the component content
components = {
    'Home.js': """import React from 'react';

function Home() {
  return (
    <div>
      <h1>Welcome to PSEVEN</h1>
      <p>Your go-to platform for jobs, services, buying & selling, and more!</p>
    </div>
  );
}

export default Home;
""",
    'JobEmployers.js': """import React from 'react';

function JobEmployers() {
  return (
    <div>
      <h1>Job & Employers</h1>
      <p>Explore job listings and connect with employers.</p>
    </div>
  );
}

export default JobEmployers;
""",
    'BuySell.js': """import React from 'react';

function BuySell() {
  return (
    <div>
      <h1>Buy & Sell</h1>
      <p>Find or sell products in our marketplace.</p>
    </div>
  );
}

export default BuySell;
""",
    'Services.js': """import React from 'react';

function Services() {
  return (
    <div>
      <h1>Our Services</h1>
      <p>Learn about the services we offer.</p>
    </div>
  );
}

export default Services;
""",
    'Others.js': """import React from 'react';

function Others() {
  return (
    <div>
      <h1>Others</h1>
      <p>Explore additional resources and features.</p>
    </div>
  );
}

export default Others;
""",
    'AboutUs.js': """import React from 'react';

function AboutUs() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Learn more about our company and mission.</p>
    </div>
  );
}

export default AboutUs;
""",
    'Faq.js': """import React from 'react';

function Faq() {
  return (
    <div>
      <h1>FAQ</h1>
      <p>Frequently asked questions and answers.</p>
    </div>
  );
}

export default Faq;
""",
    'ContactUs.js': """import React from 'react';

function ContactUs() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Get in touch with us through email or phone.</p>
    </div>
  );
}

export default ContactUs;
"""
}

# Create folders
for folder in folders:
    os.makedirs(folder, exist_ok=True)

# Create components
for filename, content in components.items():
    path = os.path.join('src', 'pages', filename)
    with open(path, 'w') as file:
        file.write(content)

print("All page components created successfully!")

