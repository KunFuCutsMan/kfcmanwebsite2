require('dotenv').config()

const NeoCities = require('neocities')
const fs = require('fs/promises')

const { NEOCITIES_USER, NEOCITIES_PASS } = process.env
const nc = new NeoCities(NEOCITIES_USER, NEOCITIES_PASS)

function neocitiesUploadAsync(files) {
    return new Promise( function (resolve, reject) {
        nc.upload(files, function(resp) {
            if ( resp.result != 'success' ) {
                reject( new Error("Got an error uploading file") )
            }
            else resolve()
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
            let fileData = {
                name: `./${entry.path.replace('public', '')}/${entry.name}`,
                path: `${entry.path.replace()}/${entry.name}`,
            }
            neocitiesUploadAsync([fileData])
                .then( () => {
                    console.log(`✅ ${fileData.name} uploaded successfully`)
                } )
                .catch( err => console.error(`❌ ${fileData.name}`, err) )
        }
    }
}

pushDir("public")