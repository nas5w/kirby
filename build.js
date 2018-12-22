const fs = require('fs');
const marked = require('marked');
const handlebars = require('handlebars');
const yamlFront = require('yaml-front-matter');

const config = require('./config.json');

const postDir = './posts';

// Loop through all the files in the temp directory
fs.readdir(postDir, function(err, files) {
    if (err) {
        console.error('Could not list the directory.', err);
        process.exit(1);
    }
    // Retrieve Post Template
    fs.readFile(`./templates/post.html`, 'utf8', function(err, source) {
        // Loop through blog post files
        let blogPosts = [];
        files.forEach(function(file, index) {
            fs.readFile(`${postDir}/${file}`, 'utf8', function(err, data) {
                const contentWithMetadata = yamlFront.loadFront(data);
                const postContent = marked(contentWithMetadata.__content);
                const template = handlebars.compile(source);
                const date = new Date(contentWithMetadata.dateTime);
                const postDate = date.toLocaleDateString(
                    config.postDateFormat.locale,
                    config.postDateFormat.dateOptions
                );
                const postTime = date.toLocaleTimeString(
                    config.postDateFormat.locale,
                    config.postDateFormat.timeOptions
                );

                const context = {
                    postContent: postContent,
                    websiteName: config.websiteName || 'Kirby Blog',
                    postTitle: contentWithMetadata.title || '',
                    postDate: postDate,
                    postTime: postTime
                };

                const postUri = `./public/posts/${
                    contentWithMetadata.permalink
                }.html`;
                blogPosts.push({
                    title: context.postTitle,
                    link: `./posts/${contentWithMetadata.permalink}.html`,
                    dateTime: date
                });

                fs.writeFile(postUri, template(context), function(err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log(`${contentWithMetadata.permalink} built!`);
                });
            });
        });

        // Retrieve Index Template
        fs.readFile(`./templates/index.html`, 'utf8', function(err, source) {
            const template = handlebars.compile(source);
            const context = {
                websiteName: config.websiteName || 'Kirby Blog',
                blogPosts: blogPosts
            };

            fs.writeFile('./public/index.html', template(context), function(
                err
            ) {
                if (err) {
                    return console.log(err);
                }

                console.log(`Index page built!`);
            });
        });
    });
});
