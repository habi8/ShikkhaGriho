import os
import re

# Files to update based on grep search results
files = [
    r"app/globals.css",
    r"components/logo.tsx",
    r"components/navbar.tsx",
    r"components/landing/reviews.tsx",
    r"components/landing/hero.tsx",
    r"components/landing/footer.tsx",
    r"components/landing/features.tsx",
    r"components/landing/cta.tsx",
    r"app/auth/sign-up/page.tsx",
    r"app/auth/login/page.tsx",
    r"app/(dashboard)/teacher-dashboard/page.tsx"
]

replacements = {
    re.compile(r'1E3A8A', re.IGNORECASE): '3F7D4E',
    re.compile(r'1D4ED8', re.IGNORECASE): '2F6B3D',
    re.compile(r'EFF6FF', re.IGNORECASE): 'E6F4EA' 
}

for rel_path in files:
    filepath = os.path.join(r"e:/Projects/ShikkhaGriho/v0-ShikkhaGriho/", rel_path)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        for pattern, replacement in replacements.items():
            content = pattern.sub(replacement, content)
            
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")
    else:
        print(f"File not found: {filepath}")
