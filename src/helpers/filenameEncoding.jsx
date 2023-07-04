export function encodeFilename(articleTitle, articleDate) {
  const encodedTitle = encodeURIComponent(articleTitle);
  const encodedDate = encodeURIComponent(articleDate);
  return `${encodedDate}-${encodedTitle}.md`;
}

export function decodeFilename(filename) {

  try {
    //the filename is encoded as 2023-03-24-This%20is%20a%20test.md
    //get encoded title and date
    const encodedTitle = filename.split('-').slice(3).join('-');
    const encodedDate = filename.split('-').slice(0, 3).join('-');

    const articleTitle = decodeURIComponent(encodedTitle.split('.')[0]);
    const articleDate = decodeURIComponent(encodedDate);
    if (!articleDate || !articleTitle) throw new Error('Invalid filename');

    return { articleTitle, articleDate };
  }
  catch {
    return { articleTitle: filename, articleDate: null }
  }

}