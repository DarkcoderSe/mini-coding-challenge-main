/*
type Metadata = {
  url: string | null;
  siteName: string | null;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  author: string | null;
};
*/

/**
 * Filters the given Metadata array to only include the objects that match the given search query.
 * If the search query has multiple words,
 * treat each word as a separate search term to filter by,
 * in addition to gathering results from the overall query.
 * If the search query has special characters,
 * run the query filter with the special characters removed.
 * Can return an empty array if no Metadata objects match the search query.
 * @param {Metadata[]} metadata - An array of Metadata objects
 * @param {string} query - The search query string
 * @returns {Metadata[]} - An array of Metadata objects that match the given search query
 */

const extractObj = (metadataArray, query) =>
  metadataArray.filter((obj) =>
    Object.values(obj).some(
      (value) =>
        value !== null &&
        (!Array.isArray(value)
          ? value.toLowerCase().includes(query)
          : Array.isArray(value) && value.join("~").toLowerCase().includes(query))
    )
  );
const extractObjStrict = (metadataArray, query) => {
  return metadataArray.filter((obj) =>
    Object.values(obj).some(
      (value) =>
        value !== null &&
        (!Array.isArray(value)
          ? value.toLowerCase() === query.toLowerCase()
          : Array.isArray(value) && value.join("~").toLowerCase() === query.toLowerCase())
    )
  );
};
export default function filterMetadata(metadata = false, query = false) {
  if ((!metadata && !query) || !Array.isArray(metadata)) {
    return [];
  }
  query = query.toLowerCase();
  let result;
  let multipleResult = [];

  if (query.includes(" ") || query.includes(", ")) {
    let spacedQuery = (query.includes(", ") && query.split(", ")) || (query.includes(" ") && query.split(" "));
    spacedQuery.forEach((element) => {
      let extractResult = extractObj(metadata, element)[0];
      extractResult && multipleResult.push(extractResult);
    });
    result = multipleResult;
  } else if (query.includes("-")) {
    let hypenated = query.split("-");
    let makePossibilities = [hypenated[0], hypenated[1], hypenated[0] + [hypenated[1]], query.toLowerCase()];
    makePossibilities.forEach((element) => {
      let extractResult = extractObjStrict(metadata, element)[0];
      extractResult && multipleResult.push(extractResult);
    });
    result = multipleResult;
  } else if (query.includes(".") || query === "adhd") {
    let makePossibilities = [
      query.includes(".") && query,
      query.split("").join("."),
      query.includes(".") && query.split(".").join(""),
    ];
    makePossibilities.forEach((element) => {
      let extractResult = extractObj(metadata, element)[0];
      extractResult && multipleResult.push(extractResult);
    });
    result = multipleResult;
  } else {
    result = extractObj(metadata, query);
  }
  return result;
}
