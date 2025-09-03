export const generateDivisionThumbnailFunction = (name: string) => {
    return name.toLowerCase().split(' ').join('-').concat('-division-thumbnail.jpg');
}
