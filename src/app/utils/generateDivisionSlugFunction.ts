export const generateDivisionSlugFunction = (name: string) => {
    return name.toLowerCase().split(' ').join('-').concat('-division');
}
