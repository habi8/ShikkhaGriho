const fs = require('fs');
const path = require('path');

const files = [
    "app/globals.css",
    "components/logo.tsx",
    "components/navbar.tsx",
    "components/landing/reviews.tsx",
    "components/landing/hero.tsx",
    "components/landing/footer.tsx",
    "components/landing/features.tsx",
    "components/landing/cta.tsx",
    "app/auth/sign-up/page.tsx",
    "app/auth/login/page.tsx",
    "app/(dashboard)/teacher-dashboard/page.tsx"
];

const basePath = "e:/Projects/ShikkhaGriho/v0-ShikkhaGriho/";

for (const relPath of files) {
    const fullPath = path.join(basePath, relPath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        const origContent = content;

        content = content.replace(/1E3A8A/gi, '3F7D4E');
        content = content.replace(/1D4ED8/gi, '2F6B3D');
        content = content.replace(/EFF6FF/gi, 'E6F4EA');

        if (content !== origContent) {
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Updated ${fullPath}`);
        }
    } else {
        console.log(`File not found: ${fullPath}`);
    }
}
