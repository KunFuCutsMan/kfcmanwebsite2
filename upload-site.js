require('dotenv').config()

const NeoCities = require('neocities')
const fs = require('fs/promises')
const path = require('path')

const { NEOCITIES_USER, NEOCITIES_PASS } = process.env
const nc = new NeoCities(NEOCITIES_USER, NEOCITIES_PASS)

function neocitiesUploadAsync(files) {
    return new Promise( function (resolve, reject) {
        nc.upload(files, function(resp) {
            if ( resp.result != 'success' ) {
                reject( new Error("Got an error uploading file"), resp )
            }
            else resolve(resp)
        })
    } )
}

/**
 * Thank you so much for Neonaut's code solution!
 * 
 * https://neonaut.neocities.org/neocities/#using-python-to-upload
 * @param {string} dir Directory to upload
 */
async function pushDir(dir) {
    const directory = await fs.opendir(dir, { recursive: true })

    for await (const entry of directory) {
        if ( entry.isFile() ) {
            // Path that will be uploaded file to
            const namePath = path.format({
                base: entry.name,
                dir: entry.path.replace('public', '/')
            }).replaceAll('\\', '/')

            // Relative path in my computer from this file
            const filePath = path.format({
                base: entry.name,
                dir: entry.path,
            })

            neocitiesUploadAsync([{
                name: namePath,
                path: filePath,
            }])
            .then( (resp) => console.log(`✅ ${namePath} uploaded successfully`) )
            .catch( (err, resp) => console.error(`❌ ${namePath} ${resp}`, err) )
        }
    }
}

pushDir("public")