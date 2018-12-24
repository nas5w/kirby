const fs = require('fs');
const marked = require('marked');
const handlebars = require('handlebars');
const yamlFront = require('yaml-front-matter');

const config = require('./config.json');

const getPostFiles = require('./tasks/getPostFiles');
const readFile = require('./tasks/readFile');
const populatePostTemplate = require('./tasks/populatePostTemplate');
const populateIndexTemplate = require('./tasks/populateIndexTemplate');
const writeFile = require('./tasks/writeFile');

getPostFiles(fs, config.postDir)
    .then(postFiles => {
        // Get template
        let promises = [readFile(fs, config.postTemplateLoc)];
        // Get all posts
        postFiles.forEach(postFile => {
            promises.push(readFile(fs, `${config.postDir}/${postFile}`));
        });
        return Promise.all(promises);
    })
    .then(promises => {
        // Get template
        const template = promises.shift();
        let convertedPosts = [];
        // Populate template for each post
        promises.forEach(post => {
            convertedPosts.push(
                populatePostTemplate(
                    yamlFront,
                    handlebars,
                    marked,
                    template,
                    post,
                    config
                )
            );
        });
        return Promise.all(convertedPosts);
    })
    .then(posts => {
        let promises = [];
        // Get index template
        promises.push(readFile(fs, config.indexTemplateLoc));
        posts.forEach(post => {
            console.log(`Writing post file: ${post.permalink}`);
            promises.push(
                writeFile(
                    fs,
                    post.title,
                    post.post,
                    config.publicDir,
                    `${config.postOutputPath}/${post.permalink}.html`
                )
            );
        });
        return Promise.all(promises);
    })
    .then(blogPosts => {
        const indexTemplate = blogPosts.shift();
        return populateIndexTemplate(
            handlebars,
            indexTemplate,
            blogPosts,
            config
        );
    })
    .then(index => {
        console.log('Writing index file...');
        return writeFile(
            fs,
            'Index page',
            index,
            config.publicDir,
            'index.html'
        );
    })
    .then(output => {
        console.log("Blog built! (>'-')>");
    })
    .catch(err => {
        console.log('There was a problem building the posts.', err);
    });
