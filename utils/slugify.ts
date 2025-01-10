export default function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing spaces
  str = str.toLowerCase(); // convert to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by "-"
    .replace(/-+/g, "-"); // collapse dashes
  return str;
}
