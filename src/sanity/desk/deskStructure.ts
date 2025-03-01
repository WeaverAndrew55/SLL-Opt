// sanity/desk/deskStructure.ts
import { StructureBuilder } from 'sanity/desk';
import { CogIcon, FileTextIcon, HomeIcon, SettingsIcon, MailIcon } from '@sanity/icons';

export const deskStructure = (S: StructureBuilder) => {
  return S.list()
    .title('Content')
    .items([
      // Singleton for site settings
      S.listItem()
        .title('Site Settings')
        .icon(SettingsIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      
      // Home page as a singleton
      S.listItem()
        .title('Home Page')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('page')
            .documentId('home')
            .title('Home Page')
        ),
      
      // Regular pages
      S.listItem()
        .title('Pages')
        .icon(FileTextIcon)
        .child(
          S.documentTypeList('page')
            .title('Pages')
            // Filter out the home page since it's a singleton
            .filter('_id != "home"')
        ),
      
      // Contact submissions
      S.listItem()
        .title('Contact Submissions')
        .icon(MailIcon)
        .child(
          S.documentTypeList('contactSubmission')
            .title('Contact Submissions')
        ),
      
      // Add a divider
      S.divider(),
      
      // All other document types
      ...S.documentTypeListItems().filter(
        listItem => !['siteSettings', 'page', 'contactSubmission'].includes(listItem.getId() as string)
      ),
    ]);
};
