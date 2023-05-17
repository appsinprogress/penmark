export function base64ToBlobUrl(base64String, contentType) {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
}

export function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

export async function loadImagesForContentAsBlobs(fileContent) {
    //regex to find all the images
    const images = fileContent.match(/!\[.*?\]\(.*?\)/g);

    //if there are images
    if (images) {
        //iterate through all of the images
        for (let i = 0; i < images.length; i++) {

            //get image filename
            const imageFilepath = images[i].match(/\((.*?)\)/)[1];
            const imageFilename = imageFilepath.split('/').pop();

            //fetch the image from the github
            const response = await octokit.rest.repos.getContent({
                owner: 'thomasgauvin',
                repo: 'blog',
                path: `_drafts/${imageFilename}`,
            })

            //convert response.data.content to blob
            //get data type from url
            const fileExtension = response.data.name.split('.').pop();
            const base64DataType = getFileDataType(fileExtension);
            const base64Url = `data:${base64DataType};base64,${response.data.content}`;

            //create blob
            console.log('creating a blob for base64')
            const imageBlob = await fetch(base64Url).then(r => r.blob());

            //get image blob url
            const imageBlobUrl = URL.createObjectURL(imageBlob);
            console.log(imageBlobUrl)

            //replace the image url with the blob url
            fileContent = fileContent.replace(imageFilepath, `${imageBlobUrl} "${imageFilename}"`);
        }
    }
    return fileContent;
}

//convert fileExtension to base64 datatype
function getFileDataType(extension) {
    // Convert the extension to lowercase for case-insensitive comparison
    extension = extension.toLowerCase();

    // Define the mapping of file extensions to Base64 image data types
    const extensionToDataType = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'webp': 'image/webp'
        // Add more mappings as needed
    };

    // Check if the extension exists in the mapping
    if (extension in extensionToDataType) {
        return extensionToDataType[extension];
    }

    // Return a default data type if the extension is not found
    return 'image/png'; // You can change the default data type if desired
}