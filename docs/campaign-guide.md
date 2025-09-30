# Launching a Campaign Landing Page in Under 10 Minutes

This playbook walks marketers through creating, editing, and publishing a campaign page using the Context-Aware Landing Page Generator MVP.

## 1. Sign in

1. Visit `/signin` and authenticate with your Google Workspace account.
2. You will be redirected to the admin dashboard after successful login.

## 2. Review workspace defaults

- The dashboard shows total campaigns and recent form submissions.
- Workspace design tokens (colors, typography, spacing) are applied automatically across every landing page. Tokens can be updated in the database `Workspace.brandTokens` field.

## 3. Create a campaign draft

1. Navigate to `/admin/pages` and click **New campaign**.
2. Complete the guided form:
   - **Campaign title** – internal + headline seed.
   - **URL slug** – determines the published URL `/p/<slug>`.
   - **Campaign type** – choose *Custom offer* or *Event* to auto-generate a schema tailored to the use case.
3. Submit the form. You will be redirected back to the list with a new draft.

## 4. Customize content

1. Open the campaign detail view (`/admin/pages/<id>`).
2. Use the **Quick edit** panel to adjust title, slug, and publish status.
3. Scroll to the **Schema editor**:
   - Update section JSON directly (Hero, Benefits, Locations, FAQ, Form, Footer).
   - Modify the `form` section to change fields and success message.
   - Update SEO metadata JSON with title/description/keywords.
4. Click **Save schema** to persist changes. Invalid JSON will surface friendly errors.

### Need AI copy inspiration?

- Send a `POST` request to `/api/seo` with `{ brand, offer, audience?, tone? }` to receive suggested title, description, and keywords. You can use the browser console or your favorite HTTP client during setup.

## 5. Preview the landing page

- Every campaign shows a **View live page** link that opens `/p/<slug>`.
- Draft pages return 404s to protect unpublished work.
- Published pages are statically rendered and revalidate within 60 seconds.

## 6. Capture and route leads

- The schema-driven form automatically posts to the `SubmitLeadForm` server action.
- Submissions appear instantly in the dashboard and persist in the `FormSubmission` table.
- Configure `Workspace.webhookUrl` to forward payloads to CRMs or Zapier.

## 7. Publish

1. Switch the campaign status to **PUBLISHED** in the quick edit panel.
2. Updates revalidate automatically within a minute, while `revalidatePath` ensures admin views refresh immediately.

## 8. Monitor performance

- The dashboard highlights the most recent five form submissions.
- Extend analytics by connecting the webhook to downstream systems or adding tracking snippets via schema content.

## Additional Notes

- Authentication is Google-only to reduce scope for the MVP.
- There is no asset upload, A/B testing, or localization in this version.
- Host the Next.js app on Vercel and the Postgres database on Neon/Supabase.
