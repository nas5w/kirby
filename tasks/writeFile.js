const writeFile = (fs, title, content, publicDir, path) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${publicDir}/${path}`, content, function(err) {
            if (err) {
                return reject(err);
            }
            return resolve({ title, path });
        });
    });
};

module.exports = writeFile;
