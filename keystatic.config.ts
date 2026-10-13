import { config, collection, singleton, fields } from '@keystatic/core';

/**
 * Keystatic content model for the SNS Institute website.
 *
 * Every visible text has an English field and an optional Hindi field.
 * If the Hindi field is left empty, the English text is shown on the Hindi site.
 *
 * Editors use this at /keystatic. In production, content is saved to GitHub
 * (login + 2FA via GitHub) and the site redeploys automatically.
 */

const repo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined;

const en = (label: string, multiline = false) =>
  fields.text({ label: `${label} (English)`, multiline, validation: { isRequired: true } });
const hi = (label: string, multiline = false) =>
  fields.text({ label: `${label} (हिंदी)`, multiline, description: 'Optional – English is shown if empty' });

const richEn = (label: string) => fields.markdoc.inline({ label: `${label} (English)` });
const richHi = (label: string) => fields.markdoc.inline({ label: `${label} (हिंदी)`, description: 'Optional' });

const pointList = (label: string) =>
  fields.array(fields.object({ en: en('Point'), hi: hi('Point') }), { label, itemLabel: (p) => p.fields.en.value });

const cardList = (label: string) =>
  fields.array(
    fields.object({ titleEn: en('Title'), titleHi: hi('Title'), textEn: en('Text', true), textHi: hi('Text', true) }),
    { label, itemLabel: (p) => p.fields.titleEn.value },
  );

const seo = fields.object(
  {
    title: fields.text({ label: 'SEO title', description: 'Shown in Google. Keep under 60 characters. Leave empty to use the default.' }),
    description: fields.text({
      label: 'SEO description',
      multiline: true,
      description: 'Shown under the title in Google. 140–160 characters.',
    }),
  },
  { label: 'SEO (Google search)' },
);

export default config({
  storage: repo ? { kind: 'github', repo } : { kind: 'local' },
  ui: {
    brand: { name: 'SNS Institute' },
    navigation: {
      'Website': ['settings', 'home', 'about'],
      'Courses & Results': ['courses', 'batches', 'results', 'faculty', 'testimonials'],
      'Updates': ['posts', 'faqs'],
      'Local SEO': ['locations'],
      'Media': ['gallery'],
    },
  },
  singletons: {
    settings: singleton({
      label: 'Contact & Settings',
      path: 'content/settings',
      schema: {
        phones: fields.array(fields.text({ label: 'Phone' }), {
          label: 'Phone numbers',
          itemLabel: (p) => p.value,
        }),
        whatsapp: fields.text({ label: 'WhatsApp number', description: 'Digits only with country code, e.g. 919817412003' }),
        email: fields.text({ label: 'Email' }),
        addressEn: en('Address', true),
        addressHi: hi('Address', true),
        mapUrl: fields.url({ label: 'Google Maps link' }),
        mapEmbed: fields.url({ label: 'Google Maps embed URL', description: 'Maps → Share → Embed a map → copy the src="..." link' }),
        hoursEn: en('Timings'),
        hoursHi: hi('Timings'),
        established: fields.integer({ label: 'Established (year)' }),
        rating: fields.number({ label: 'Google rating', step: 0.1 }),
        reviewCount: fields.integer({ label: 'Number of Google reviews' }),
        instagram: fields.url({ label: 'Instagram' }),
        facebook: fields.url({ label: 'Facebook' }),
        youtube: fields.url({ label: 'YouTube' }),
        googleReviewUrl: fields.url({ label: 'Google reviews link' }),
      },
    }),
    home: singleton({
      label: 'Home page',
      path: 'content/home',
      schema: {
        announcementEn: fields.text({ label: 'Top announcement bar (English)', description: 'e.g. Admissions open for 2027 batches. Leave empty to hide.' }),
        announcementHi: hi('Top announcement bar'),
        heroTitleEn: en('Hero heading'),
        heroTitleHi: hi('Hero heading'),
        heroTextEn: en('Hero text', true),
        heroTextHi: hi('Hero text', true),
        heroImage: fields.image({ label: 'Hero image', directory: 'public/images/home', publicPath: '/images/home/' }),
        stats: fields.array(
          fields.object({
            value: fields.text({ label: 'Number', description: 'e.g. 500+' }),
            labelEn: en('Label'),
            labelHi: hi('Label'),
          }),
          { label: 'Highlights / numbers', itemLabel: (p) => `${p.fields.value.value} ${p.fields.labelEn.value}` },
        ),
        why: fields.array(
          fields.object({ titleEn: en('Title'), titleHi: hi('Title'), textEn: en('Text', true), textHi: hi('Text', true) }),
          { label: 'Why choose SNS', itemLabel: (p) => p.fields.titleEn.value },
        ),
        exams: fields.array(fields.text({ label: 'Exam / board' }), {
          label: 'Exams we prepare for (strip under the banner)',
          itemLabel: (p) => p.value,
        }),
        seo,
      },
    }),
    about: singleton({
      label: 'About page',
      path: 'content/about',
      schema: {
        introEn: en('Intro', true),
        introHi: hi('Intro', true),
        slides: fields.array(
          fields.object({
            image: fields.image({ label: 'Photo', directory: 'public/images/about', publicPath: '/images/about/', validation: { isRequired: true } }),
            captionEn: en('Caption'),
            captionHi: hi('Caption'),
          }),
          { label: 'Photo slider (top of page)', itemLabel: (p) => p.fields.captionEn.value },
        ),
        bodyEn: richEn('Our story'),
        bodyHi: richHi('Our story'),
        image: fields.image({ label: 'Story photo', directory: 'public/images/about', publicPath: '/images/about/' }),
        missionEn: en('Mission', true),
        missionHi: hi('Mission', true),
        visionEn: en('Vision', true),
        visionHi: hi('Vision', true),
        values: cardList('Our values'),
        facilities: fields.array(
          fields.object({
            titleEn: en('Facility'),
            titleHi: hi('Facility'),
            textEn: en('Description', true),
            textHi: hi('Description', true),
            image: fields.image({ label: 'Photo', directory: 'public/images/about', publicPath: '/images/about/' }),
          }),
          { label: 'Facilities', itemLabel: (p) => p.fields.titleEn.value },
        ),
        seo,
      },
    }),
  },
  collections: {
    courses: collection({
      label: 'Courses',
      path: 'content/courses/*',
      slugField: 'titleEn',
      columns: ['titleEn', 'order'],
      schema: {
        titleEn: fields.slug({
          name: { label: 'Course name (English)' },
          slug: { label: 'Page URL', description: 'Use keywords, e.g. neet-coaching-rewari' },
        }),
        titleHi: hi('Course name'),
        order: fields.integer({ label: 'Display order', defaultValue: 10 }),
        icon: fields.select({
          label: 'Icon',
          options: [
            { label: 'Atom (JEE)', value: 'atom' },
            { label: 'Stethoscope (NEET)', value: 'stethoscope' },
            { label: 'Rocket (Foundation)', value: 'rocket' },
            { label: 'Book (Tuition)', value: 'book' },
            { label: 'Graduation cap', value: 'cap' },
            { label: 'Shield (Sainik / Military)', value: 'shield' },
          ],
          defaultValue: 'book',
        }),
        classesEn: en('For classes'),
        classesHi: hi('For classes'),
        durationEn: en('Duration'),
        durationHi: hi('Duration'),
        summaryEn: en('Short summary', true),
        summaryHi: hi('Short summary', true),
        highlights: fields.array(fields.object({ en: en('Point'), hi: hi('Point') }), {
          label: 'Key highlights',
          itemLabel: (p) => p.fields.en.value,
        }),
        subjects: fields.array(fields.text({ label: 'Subject' }), { label: 'Subjects', itemLabel: (p) => p.value }),
        whoFor: pointList('Who should join'),
        syllabus: fields.array(
          fields.object({
            subject: fields.text({ label: 'Subject' }),
            topicsEn: fields.text({ label: 'Topics (English) – one per line', multiline: true }),
            topicsHi: fields.text({ label: 'Topics (हिंदी) – one per line', multiline: true, description: 'Optional' }),
          }),
          { label: 'Syllabus (subject-wise)', itemLabel: (p) => p.fields.subject.value },
        ),
        features: cardList('What you get'),
        roadmap: cardList('Preparation roadmap (step by step)'),
        fee: fields.text({ label: 'Fee (optional)', description: 'e.g. Call for fee details' }),
        bodyEn: richEn('Detailed description'),
        bodyHi: richHi('Detailed description'),
        image: fields.image({ label: 'Image', directory: 'public/images/courses', publicPath: '/images/courses/' }),
        seo,
      },
    }),
    batches: collection({
      label: 'Upcoming batches',
      path: 'content/batches/*',
      slugField: 'nameEn',
      columns: ['nameEn', 'startDate', 'active'],
      schema: {
        nameEn: fields.slug({ name: { label: 'Batch name (English)' } }),
        nameHi: hi('Batch name'),
        active: fields.checkbox({ label: 'Show on website', defaultValue: true }),
        course: fields.relationship({ label: 'Course (optional)', collection: 'courses' }),
        startDate: fields.date({ label: 'Starting date (optional)' }),
        forEn: en('For (classes / students)'),
        forHi: hi('For (classes / students)'),
        fee: fields.text({ label: 'Fee (optional)', description: 'e.g. ₹11,500 incl. test series' }),
        tagEn: fields.text({ label: 'Tag (English)', description: 'e.g. Limited seats, Registration open' }),
        tagHi: hi('Tag'),
        order: fields.integer({ label: 'Display order', defaultValue: 10 }),
      },
    }),
    results: collection({
      label: 'Results / Toppers',
      path: 'content/results/*',
      slugField: 'name',
      columns: ['name', 'exam', 'year'],
      schema: {
        name: fields.slug({ name: { label: 'Student name' } }),
        exam: fields.text({ label: 'Exam', description: 'e.g. NEET 2026, JEE Main 2026, CBSE Class 10' }),
        category: fields.select({
          label: 'Category (for the filter on Results page)',
          options: [
            { label: 'JEE / IIT', value: 'jee' },
            { label: 'NEET', value: 'neet' },
            { label: 'Sainik School / RMS / Navodaya', value: 'sainik' },
            { label: 'Board exams (Class 10 / 12)', value: 'board' },
            { label: 'Class toppers', value: 'class' },
            { label: 'Higher studies (IIT JAM, M.Sc, CUET…)', value: 'higher' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'other',
        }),
        quoteEn: fields.text({ label: 'Student quote (English, optional)', multiline: true }),
        quoteHi: hi('Student quote', true),
        year: fields.integer({ label: 'Year', validation: { isRequired: true } }),
        achievement: fields.text({ label: 'Rank / Score', description: 'e.g. AIR 1520, 98.4 percentile, 96%' }),
        place: fields.text({ label: 'From (town/school)' }),
        photo: fields.image({ label: 'Photo', directory: 'public/images/results', publicPath: '/images/results/' }),
        featured: fields.checkbox({ label: 'Show on home page', defaultValue: true }),
        order: fields.integer({ label: 'Display order', description: 'Lower numbers show first (within a year)', defaultValue: 10 }),
      },
    }),
    faculty: collection({
      label: 'Faculty',
      path: 'content/faculty/*',
      slugField: 'name',
      columns: ['name', 'subject'],
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        subject: fields.text({ label: 'Subject' }),
        qualification: fields.text({ label: 'Qualification' }),
        experience: fields.text({ label: 'Experience', description: 'e.g. 7+ years' }),
        active: fields.checkbox({ label: 'Show on website', defaultValue: true }),
        roleEn: fields.text({ label: 'Role (English)', description: 'e.g. Director, Senior Faculty' }),
        roleHi: hi('Role'),
        leader: fields.checkbox({ label: 'Show in "Leadership" section', defaultValue: false }),
        teaches: fields.array(fields.text({ label: 'Class / exam' }), {
          label: 'Teaches (classes / exams)',
          itemLabel: (p) => p.value,
        }),
        bioEn: fields.text({ label: 'Short bio (English)', multiline: true }),
        bioHi: hi('Short bio', true),
        highlights: pointList('Highlights'),
        photo: fields.image({ label: 'Photo', directory: 'public/images/faculty', publicPath: '/images/faculty/' }),
        order: fields.integer({ label: 'Display order', defaultValue: 10 }),
      },
    }),
    testimonials: collection({
      label: 'Testimonials',
      path: 'content/testimonials/*',
      slugField: 'name',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        role: fields.text({ label: 'Student / Parent of', description: 'e.g. NEET 2026, Class 10 student, Parent' }),
        textEn: en('Review', true),
        textHi: hi('Review', true),
        rating: fields.integer({ label: 'Stars (1-5)', defaultValue: 5, validation: { min: 1, max: 5 } }),
      },
    }),
    posts: collection({
      label: 'Notices & Exam updates (Blog)',
      path: 'content/posts/*',
      slugField: 'titleEn',
      columns: ['titleEn', 'date'],
      schema: {
        titleEn: fields.slug({
          name: { label: 'Title (English)' },
          slug: { label: 'Page URL', description: 'e.g. neet-2027-exam-date' },
        }),
        titleHi: hi('Title'),
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Notice', value: 'notice' },
            { label: 'Exam update', value: 'exam' },
            { label: 'Result', value: 'result' },
            { label: 'Study tips', value: 'tips' },
          ],
          defaultValue: 'exam',
        }),
        excerptEn: en('Short summary', true),
        excerptHi: hi('Short summary', true),
        cover: fields.image({ label: 'Cover image', directory: 'public/images/posts', publicPath: '/images/posts/' }),
        bodyEn: richEn('Article'),
        bodyHi: richHi('Article'),
        seo,
      },
    }),
    faqs: collection({
      label: 'FAQs',
      path: 'content/faqs/*',
      slugField: 'questionEn',
      columns: ['questionEn', 'order'],
      schema: {
        questionEn: fields.slug({ name: { label: 'Question (English)' } }),
        questionHi: hi('Question'),
        answerEn: en('Answer', true),
        answerHi: hi('Answer', true),
        course: fields.relationship({ label: 'Show on course page (optional)', collection: 'courses' }),
        order: fields.integer({ label: 'Display order', defaultValue: 10 }),
      },
    }),
    locations: collection({
      label: 'Nearby town pages',
      path: 'content/locations/*',
      slugField: 'town',
      columns: ['town', 'distanceKm'],
      schema: {
        town: fields.slug({
          name: { label: 'Town (English)' },
          slug: { label: 'Page URL', description: 'e.g. kosli' },
        }),
        townHi: hi('Town'),
        distanceKm: fields.integer({ label: 'Distance from institute (km)' }),
        travelEn: en('How to reach (bus/route/time)', true),
        travelHi: hi('How to reach', true),
        introEn: en('Intro paragraph (unique for this town)', true),
        introHi: hi('Intro paragraph', true),
        seo,
      },
    }),
    gallery: collection({
      label: 'Gallery',
      path: 'content/gallery/*',
      slugField: 'caption',
      schema: {
        caption: fields.slug({ name: { label: 'Caption' } }),
        image: fields.image({
          label: 'Photo',
          directory: 'public/images/gallery',
          publicPath: '/images/gallery/',
          validation: { isRequired: true },
        }),
        order: fields.integer({ label: 'Display order', description: 'Lower numbers show first', defaultValue: 10 }),
      },
    }),
  },
});
