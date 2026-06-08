# Ahmed Alaraby Portfolio

A premium dark portfolio for Ahmed Alaraby, built with Next.js, Tailwind CSS, Framer Motion, GSAP, and Lenis smooth scrolling.

## Install

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Admin

Open `http://localhost:3000/admin`.

From the admin page you can:

- Add a project
- Edit project content
- Delete projects
- Upload a cover image
- Upload multiple gallery images
- Add Behance links
- Add tags
- Add project descriptions and case study sections

Projects are stored in `data/projects.json`. Uploaded images are stored in `public/uploads`.

## Add a New Project

1. Open `/admin`.
2. Fill in the project title, category, description, overview, problem, solution, process, and outcome.
3. Upload one cover image.
4. Upload any gallery images.
5. Add tags separated by commas.
6. Add a Behance URL when available.
7. Click `Publish Project`.

The homepage and project detail page update automatically.
Use **Show in Featured Work** to control whether a project appears in the homepage story.

## Replace Images

Use the admin upload controls for the fastest workflow. Recommended image sizes:

- Cover image: `1600x1000` or larger
- Gallery image: `1200x900` or larger
- Open Graph image: replace `public/images/og.png` with a `1200x630` PNG

## Add a Client Logo

The fastest option is the admin page:

1. Open `/admin`.
2. Scroll to **Client Logo Manager**.
3. Add the company name and optional category.
4. Upload a transparent SVG, PNG, WebP, GIF, or JPG.
5. Choose whether it is visible and save it.
6. Use the arrow controls to reorder logos.

Client records are stored in `data/clients.json` during local development and uploaded logos are stored in `public/clients/`. With Vercel Blob configured, both content and uploads persist in production. The site normalizes every logo to grayscale by default and reveals its original color on hover.

## Update the Profile Picture

1. Open `/admin`.
2. Use **Profile Settings** at the top of the page.
3. Upload a PNG, JPG, JPEG, or WebP portrait.
4. Preview it and click **Save changes**.

The portrait updates in the Hero, About, and Contact sections. Profile uploads are center-cropped to a square WebP and stored in `public/profile/` during local development. Removing the image activates the `AA` initials fallback.

## Manage Certificates

Open `/admin` and use **Certificate Manager** to upload, edit, hide, or delete certificates. Certificate records are stored in `data/certificates.json` locally and use Vercel Blob when configured.

## Update Content

Use `/admin` for project content. For personal details like name, headline, bio, skills, and contact email, edit:

- `app/page.tsx`
- `app/layout.tsx`

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Create a new Vercel project from that repository.
3. Keep the default framework preset as `Next.js`.
4. Deploy.

For persistent project edits and uploads on Vercel, create a Vercel Blob store and add `BLOB_READ_WRITE_TOKEN` to the project environment variables. Without that token, the admin uses local files for development.

## Production Notes

- The site includes SEO metadata, Open Graph tags, project metadata, image optimization, smooth scrolling, cursor interactions, magnetic buttons, text reveals, image reveals, and scroll-triggered GSAP motion.
- Keep uploaded images compressed for fast loading.
- Add a custom domain in Vercel for the most professional presentation.
## Social presence

Manage the Hero identity card from `/admin` under **Social Settings**. You can add, edit, hide, delete, and reorder links, change their labels, or upload a replacement Resume PDF. Social data is stored in `data/socials.json`; its TypeScript structure is defined in `data/socials.ts`.
