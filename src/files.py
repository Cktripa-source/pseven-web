import os

# Define the directory and component names
base_dir = "src/admin"
components = [
    "dashboard",
    "inbox",
    "users",
    "productmanagement",
    "jobs",
    "services",
    "settings",
    "faq",
    "about",
    "logout",
    "signup"
]

# Ensure the base directory exists
os.makedirs(base_dir, exist_ok=True)

# Create a file for each component
for component in components:
    component_name = component.capitalize()
    file_path = os.path.join(base_dir, f"{component_name}.jsx")
    content = f"""
import React from 'react';

const {component_name} = () => {{
    return (
        <div>
            <h1>{component_name}</h1>
            <p>This is the {component_name} page.</p>
        </div>
    );
}};

export default {component_name};
    """.strip()
    
    # Write the content to the file
    with open(file_path, "w") as file:
        file.write(content)
    
    print(f"Created: {file_path}")

print("All files created successfully.")

