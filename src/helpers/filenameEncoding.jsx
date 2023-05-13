export function encodeFilename(articleTitle, articleDate) {
    const encodedTitle = encodeURIComponent(articleTitle);
    const encodedDate = encodeURIComponent(articleDate);
    return `${encodedDate}_${encodedTitle}.md`;
  }
  
  export function decodeFilename(filename) {

    console.log('decoding file name')
    console.log(filename)
    
    try{
        const [encodedDate, encodedTitle] = filename.split('_');
        const articleTitle = decodeURIComponent(encodedTitle.split('.')[0]);
        const articleDate = decodeURIComponent(encodedDate);
        return { articleTitle, articleDate };
    }
    catch{
        return { articleTitle: filename, articleDate: ''}
    }

  }