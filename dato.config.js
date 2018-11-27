const htmlTag = require('html-tag');

const fs = require('fs');
const lodash = require('lodash');

// This function helps transforming structures like:
//
// [{ tagName: 'meta', attributes: { name: 'description', content: 'foobar' } }]
//
// into proper HTML tags:
//
// <meta name="description" content="foobar" />

const toHtml = (tags) =>
    tags
        .map(({tagName, attributes, content}) =>
            htmlTag(tagName, attributes, content),
        )
        .join('');

// Arguments that will receive the mapping function:
//
// * dato: lets you easily access any content stored in your DatoCMS
//   administrative area;
//
// * root: represents the root of your project, and exposes commands to
//   easily create local files/directories;
//
// * i18n: allows to switch the current locale to get back content in
//   alternative locales from the first argument.
//
// Read all the details here:
// https://github.com/datocms/js-datocms-client/blob/master/docs/dato-cli.md

module.exports = (dato, root, i18n) => {
    // Add to the existing Hugo config files some properties coming from data
    // stored on DatoCMS
    ['config.dev.toml', 'config.prod.toml'].forEach((file) => {
        root.addToDataFile(file, 'toml', {
            title: dato.site.globalSeo.siteName,
            languageCode: i18n.locale,
        });
    });

    const content = {
        name: dato.site.globalSeo.siteName,
        language: dato.site.locales[0],
        intro: dato.home.introText,
        copyright: dato.home.copyright,
        // iterate over all the `social_profile` item types
        socialProfiles: dato.socialProfiles.map((profile) => {
            return {
                type: profile.profileType.toLowerCase().replace(/ +/, '-'),
                url: profile.url,
            };
        }),
        faviconMetaTags: toHtml(dato.site.faviconMetaTags),
        seoMetaTags: toHtml(dato.home.seoMetaTags),
    };
    // Create a YAML data file to store global data about the site
    root.createDataFile('data/settings.yml', 'yaml', content);

    // Create a markdown file with content coming from the `about_page` item
    // type stored in DatoCMS
    root.createPost(`content/about/about.md`, 'yaml', {
        frontmatter: {
            title: dato.aboutPage.title,
            subtitle: dato.aboutPage.subtitle,
            photo: dato.aboutPage.photo.url({
                w: 800,
                fm: 'jpg',
                auto: 'compress',
            }),
            seoMetaTags: toHtml(dato.aboutPage.seoMetaTags),
        },
        content: dato.aboutPage.bio,
    });

    root.createPost(`content/imprint/_index.md`, 'yaml', {
        frontmatter: {
            title: dato.imprintPage.title,
            seoMetaTags: toHtml(dato.imprintPage.seoMetaTags),
        },
        content: dato.imprintPage.text,
    });

    root.createPost(`content/privacypolicy/_index.md`, 'yaml', {
        frontmatter: {
            title: dato.privacypolicyPage.title,
            seoMetaTags: toHtml(dato.privacypolicyPage.seoMetaTags),
        },
        content: dato.privacypolicyPage.text,
    });

    root.createPost(`content/articles/_index.md`, 'yaml', {
        frontmatter: {
            title: dato.articlePage.title,
            seoMetaTags: toHtml(dato.articlePage.seoMetaTags),
            type: 'article',
        },
        content: dato.articlePage.text,
    });

    root.createPost(`content/videos/_index.md`, 'yaml', {
        frontmatter: {
            title: dato.videoPage.title,
            seoMetaTags: toHtml(dato.videoPage.seoMetaTags),
        },
        content: dato.videoPage.text,
    });

    // Create a `category` directory
    root.directory('content/categories', (categoriesDir) => {
        // ...and for each of the category stored online...
        dato.categories.forEach((category, index) => {
            // ...create a markdown file with all the metadata in the frontmatter
            categoriesDir.directory(category.slug, (categorieDir) => {
                categorieDir.createPost('_index.md', 'yaml', {
                    frontmatter: {
                        title: category.name,
                        slug: category.slug,
                    },
                });
            });
        });
    });
    // Create a `post` directory (or empty it if already exists)...
    root.directory('content/post', (dir) => {
        // ...and for each of the post stored online...
        dato.posts.forEach((post, index) => {
            // ...create a markdown file with all the metadata in the frontmatter
            dir.createPost(`${post.slug}.md`, 'yaml', {
                frontmatter: {
                    //postaall: post.toMap(),
                    title: post.title,
                    description: post.description,
                    seoMetaTags: toHtml(post.seoMetaTags),
                    publishedDate: post.createdAt,
                    heroVideo: post.heroVideo,
                    heroImage: post.heroImage.url({
                        h: 640,
                        auto: 'compress',
                    }),
                    credits: post.credits.toMap(),
                    listImage: post.heroImage.url({
                        crop: 'top, right',
                    }),
                    featured: post.featured,
                    content: post.content.toMap(),
                    category: post.category.slug,
                    categoryData: {
                        title: post.category.name,
                        slug: post.category.slug,
                    },
                },
            });
        });
    });
};
